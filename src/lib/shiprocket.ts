/**
 * src/lib/shiprocket.ts
 * 
 * Shiprocket API helper — handles JWT auth token with automatic refresh.
 * Token is valid for 24 hours; we cache it in-memory and refresh when expired.
 * 
 * In MOCK MODE (placeholder credentials), all functions return simulated responses
 * so local development works end-to-end without a real Shiprocket account.
 */

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// In-memory token cache (resets on server restart, fine for serverless)
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/** Returns true if Shiprocket credentials are real (not placeholders) */
export function isShiprocketConfigured(): boolean {
  const email = process.env.SHIPROCKET_EMAIL || "";
  const password = process.env.SHIPROCKET_PASSWORD || "";
  return (
    email.length > 0 &&
    password.length > 0 &&
    !email.startsWith("placeholder") &&
    !password.startsWith("placeholder")
  );
}

/** Get a valid Shiprocket JWT token (cached, auto-refreshes) */
export async function getShiprocketToken(): Promise<string> {
  // Return cached token if still valid (5 min buffer before expiry)
  if (cachedToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL!;
  const password = process.env.SHIPROCKET_PASSWORD!;

  console.log("====== SHIPROCKET AUTH DEBUG ======");
  console.log("1. Email being sent:", email);
  console.log("2. Password length:", password?.length);
  console.log("3. Password exactly as parsed:", password);
  console.log("===================================");

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("====== SHIPROCKET API ERROR ======");
    console.error("HTTP Status Code:", res.status);
    console.error("Raw Response Text:", err);
    console.error("==================================");
    throw new Error(`Shiprocket auth failed: ${err}`);
  }

  const data = await res.json();
  console.log("[Shiprocket] Auth Success! Token received and cached.");
  
  cachedToken = data.token;
  // Token valid for 24h, cache for 23h
  tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
  return cachedToken!;
}

/** Create a Shiprocket order and auto-assign courier */
export async function createShiprocketOrder(payload: ShiprocketOrderPayload): Promise<ShiprocketOrderResult> {
  if (!isShiprocketConfigured()) {
    // MOCK MODE — simulate a successful response for local dev
    console.log("[Shiprocket MOCK] Simulating order creation:", payload.order_id);
    return {
      shiprocket_order_id: `mock_sr_${Date.now()}`,
      shipment_id: `mock_ship_${Date.now()}`,
      awb_code: `MOCK${Math.floor(100000000 + Math.random() * 900000000)}`,
      courier_name: "Mock Express",
      tracking_url: `https://shiprocket.co/tracking/MOCK`,
    };
  }

  const token = await getShiprocketToken();

  // Step 1: Create order
  const createRes = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Shiprocket create order failed: ${err}`);
  }

  const createData = await createRes.json();
  const shipmentId: string = createData.shipment_id;
  const shiprocketOrderId: string = createData.order_id;

  // Step 2: Auto-assign cheapest courier
  const assignRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: shipmentId }),
  });

  if (!assignRes.ok) {
    // Non-fatal — return order without AWB; admin can retry
    console.error("[Shiprocket] Courier auto-assign failed for shipment:", shipmentId);
    return {
      shiprocket_order_id: String(shiprocketOrderId),
      shipment_id: String(shipmentId),
      awb_code: "",
      courier_name: "",
      tracking_url: "",
    };
  }

  const assignData = await assignRes.json();
  const awbCode: string = assignData.response?.data?.awb_code || "";
  const courierName: string = assignData.response?.data?.courier_name || "";

  return {
    shiprocket_order_id: String(shiprocketOrderId),
    shipment_id: String(shipmentId),
    awb_code: awbCode,
    courier_name: courierName,
    tracking_url: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : "",
  };
}

/** Fetch latest tracking status for an AWB from Shiprocket */
export async function getShiprocketTracking(awbCode: string): Promise<ShiprocketTrackingResult> {
  if (!isShiprocketConfigured() || awbCode.startsWith("MOCK")) {
    return {
      current_status: "Mock In Transit",
      courier_name: "Mock Express",
      etd: "3-5 business days",
      tracking_data: [],
    };
  }

  const token = await getShiprocketToken();

  const res = await fetch(
    `${SHIPROCKET_BASE_URL}/courier/track/awb/${awbCode}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Shiprocket tracking fetch failed for AWB: ${awbCode}`);
  }

  const data = await res.json();
  const trackingData = data.tracking_data || {};

  return {
    current_status: trackingData.shipment_track?.[0]?.current_status || "Unknown",
    courier_name: trackingData.shipment_track?.[0]?.courier_name || "",
    etd: trackingData.shipment_track?.[0]?.etd || "",
    tracking_data: trackingData.shipment_track_activities || [],
  };
}

/** Calculate courier serviceability and shipping rates for a delivery pincode */
export async function calculateShiprocketRate(params: {
  delivery_pincode: string;
  weight: number; // in kg
  cod: boolean;
}): Promise<number> {
  const pickup_pincode = process.env.SHIPROCKET_WAREHOUSE_PINCODE || "360005";
  const codVal = params.cod ? 1 : 0;
  const weightVal = params.weight;

  if (!isShiprocketConfigured()) {
    // MOCK MODE — simulate shipping rate
    console.log("[Shiprocket MOCK] Simulating rate calculation for:", params.delivery_pincode);
    return 50;
  }

  try {
    const token = await getShiprocketToken();
    const query = new URLSearchParams({
      pickup_postcode: pickup_pincode,
      delivery_postcode: params.delivery_pincode,
      weight: String(weightVal),
      cod: String(codVal),
    });

    const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/serviceability/?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Shiprocket] Rate calculation failed:", err);
      return 50; // Fallback rate
    }

    const json = await res.json();
    const companies = json.data?.available_courier_companies;
    if (companies && Array.isArray(companies) && companies.length > 0) {
      // Find the courier company with the lowest rate
      let minRate = Infinity;
      for (const company of companies) {
        if (typeof company.rate !== "undefined" && Number(company.rate) < minRate) {
          minRate = Number(company.rate);
        }
      }
      if (minRate !== Infinity) {
        return minRate;
      }
    }
    
    return json.data?.shipping_cost || 50;
  } catch (error) {
    console.error("[Shiprocket] Error calculating rate:", error);
    return 50; // Fallback
  }
}

// ── Type Definitions ──────────────────────────────────────────────

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: number;
}

export interface ShiprocketOrderPayload {
  order_id: string;            // Your internal order number e.g. SU-123456
  order_date: string;          // "YYYY-MM-DD HH:mm"
  pickup_location: string;     // Matches pickup address name in Shiprocket dashboard
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: ShiprocketOrderItem[];
  payment_method: string;      // "Prepaid" or "COD"
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;              // In kg
}

export interface ShiprocketOrderResult {
  shiprocket_order_id: string;
  shipment_id: string;
  awb_code: string;
  courier_name: string;
  tracking_url: string;
}

export interface ShiprocketTrackingResult {
  current_status: string;
  courier_name: string;
  etd: string;
  tracking_data: any[];
}
