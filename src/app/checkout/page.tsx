"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Form error states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment and Shipping states
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [shippingCost, setShippingCost] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState("");

  // Calculate dynamic shipping cost for COD orders
  useEffect(() => {
    if (paymentMethod === "ONLINE") {
      setShippingCost(0);
      setShippingError("");
      return;
    }

    // Only calculate when pincode is exactly 6 digits (standard Indian pincode)
    if (paymentMethod === "COD" && formData.zip.trim().length === 6) {
      const fetchShippingCost = async () => {
        setCalculatingShipping(true);
        setShippingError("");
        try {
          const res = await fetch("/api/checkout/calculate-shipping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pincode: formData.zip,
              items: cart.map((i) => ({ id: i.id, quantity: i.quantity })),
            }),
          });
          const data = await res.json();
          if (res.ok && typeof data.shippingCost === "number") {
            setShippingCost(data.shippingCost);
          } else {
            setShippingError(data.error || "Failed to calculate shipping.");
            setShippingCost(0);
          }
        } catch (err) {
          setShippingError("Failed to calculate shipping.");
          setShippingCost(0);
        } finally {
          setCalculatingShipping(false);
        }
      };

      fetchShippingCost();
    } else {
      setShippingCost(0);
    }
  }, [paymentMethod, formData.zip, cart]);

  useEffect(() => {
    setMounted(true);

    // Dynamically inject Razorpay Standard checkout iframe library script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Route protection redirect
  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [mounted, status, router]);

  // Hydrated checkout items check
  useEffect(() => {
    if (mounted && status === "authenticated" && cart.length === 0) {
      router.push("/collections/all");
    }
  }, [mounted, status, cart, router]);

  // Profile info autofill
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((user) => {
          if (user) {
            setFormData((prev) => ({
              ...prev,
              name: user.name || prev.name,
              email: user.email || prev.email,
              phone: user.phone || prev.phone,
              address: user.address || prev.address,
              city: user.city || prev.city,
              state: user.state || prev.state,
              zip: user.zip || prev.zip,
            }));
          }
        })
        .catch((err) => console.error("Error loading user profile for autofill:", err));
    }
  }, [status]);

  if (!mounted || status === "loading" || (status === "authenticated" && cart.length === 0)) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center font-primary text-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
          <p className="font-bold uppercase tracking-wider text-xs">
            {status === "loading" ? "Verifying Session..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const subtotal = cartTotal;
  const actualShippingCost = paymentMethod === "ONLINE" ? 0 : shippingCost;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + actualShippingCost - discountAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        setCouponSuccess(data.message || `Coupon '${data.code}' applied successfully!`);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.error || "Invalid coupon code.");
      }
    } catch (err) {
      setCouponError("Failed to validate coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid Email is required";
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit Phone Number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim() || formData.zip.length !== 6) errors.zip = "Valid 6-digit Pincode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (paymentMethod === "COD" && calculatingShipping) {
      alert("Please wait until the shipping charges are calculated.");
      return;
    }

    if (paymentMethod === "COD" && formData.zip.trim().length !== 6) {
      alert("A valid 6-digit pincode is required for COD shipping calculation.");
      return;
    }

    setLoading(true);
    try {
      // If COD is selected and shipping cost is greater than 0, collect shipping online first
      if (paymentMethod === "COD" && actualShippingCost > 0) {
        // 1. Call route to create Razorpay Order for ONLY shipping Cost
        const rzpRes = await fetch("/api/checkout/razorpay-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total: actualShippingCost }),
        });

        if (!rzpRes.ok) {
          throw new Error("Failed to initialize payment gateway for shipping charge.");
        }

        const rzpOrder = await rzpRes.json();

        // Helper function to submit final verified COD order data to backend
        const submitCodOrderData = async (paymentDetails: any) => {
          const orderRes = await fetch("/api/checkout/place-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerInfo: formData,
              items: cart.map((i) => ({
                id: i.id,
                slug: i.slug,
                title: i.title,
                price: i.price,
                originalPrice: i.originalPrice,
                imageSrc: i.imageSrc,
                variant: i.variant,
                quantity: i.quantity,
              })),
              pricing: {
                subtotal,
                shippingCost: actualShippingCost,
                discountAmount,
                total,
              },
              couponCode: appliedCoupon ? appliedCoupon.code : "",
              paymentMethod: "COD",
              ...paymentDetails,
            }),
          });

          const orderData = await orderRes.json();
          if (orderRes.ok && orderData.success) {
            router.push(`/checkout/success?orderId=${orderData.order.orderNumber}`);
          } else {
            alert(orderData.error || "Failed to save order record in database. Please contact support.");
          }
        };

        // Check if we received mock order details back (in development)
        if (rzpOrder.mock) {
          console.log("Mock COD Payment active. Simulating payment confirmation.");
          await submitCodOrderData({
            razorpayOrderId: rzpOrder.id,
            razorpayPaymentId: `pay_mock_${Math.floor(100000 + Math.random() * 900000)}`,
            razorpaySignature: `sig_mock_${Math.floor(100000 + Math.random() * 900000)}`,
          });
          return;
        }

        // Launch Razorpay standard checkout iframe modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id",
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Sustento",
          description: "COD Shipping Charge Payment",
          order_id: rzpOrder.id,
          handler: async function (response: any) {
            try {
              await submitCodOrderData({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            } catch (err) {
              alert("Payment confirmation failed. Please contact support.");
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: formData.address,
            type: "COD Shipping Charge",
          },
          theme: {
            color: "#9e8f85",
          },
        };

        const rzpInstance = new (window as any).Razorpay(options);
        rzpInstance.open();
        return;
      }

      // If COD with 0 shipping cost, place order directly
      if (paymentMethod === "COD") {
        const orderRes = await fetch("/api/checkout/place-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerInfo: formData,
            items: cart.map((i) => ({
              id: i.id,
              slug: i.slug,
              title: i.title,
              price: i.price,
              originalPrice: i.originalPrice,
              imageSrc: i.imageSrc,
              variant: i.variant,
              quantity: i.quantity,
            })),
            pricing: {
              subtotal,
              shippingCost: actualShippingCost,
              discountAmount,
              total,
            },
            couponCode: appliedCoupon ? appliedCoupon.code : "",
            paymentMethod: "COD",
          }),
        });

        const orderData = await orderRes.json();
        if (orderRes.ok && orderData.success) {
          router.push(`/checkout/success?orderId=${orderData.order.orderNumber}`);
        } else {
          alert(orderData.error || "Failed to place COD order. Please try again.");
        }
        return;
      }

      // 1. Call route to create Razorpay Order for ONLINE Prepaid payment
      const rzpRes = await fetch("/api/checkout/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total }),
      });

      if (!rzpRes.ok) {
        throw new Error("Failed to initialize payment gateway order.");
      }

      const rzpOrder = await rzpRes.json();

      // Helper function to submit final verified order data to backend
      const submitOrderData = async (paymentDetails: any) => {
        const orderRes = await fetch("/api/checkout/place-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerInfo: formData,
            items: cart.map((i) => ({
              id: i.id,
              slug: i.slug,
              title: i.title,
              price: i.price,
              originalPrice: i.originalPrice,
              imageSrc: i.imageSrc,
              variant: i.variant,
              quantity: i.quantity,
            })),
            pricing: {
              subtotal,
              shippingCost: actualShippingCost,
              discountAmount,
              total,
            },
            couponCode: appliedCoupon ? appliedCoupon.code : "",
            paymentMethod: "ONLINE",
            ...paymentDetails,
          }),
        });

        const orderData = await orderRes.json();
        if (orderRes.ok && orderData.success) {
          router.push(`/checkout/success?orderId=${orderData.order.orderNumber}`);
        } else {
          alert(orderData.error || "Failed to save order record in database. Please contact support.");
        }
      };

      // 2. Check if we received mock order details back (in development)
      if (rzpOrder.mock) {
        console.log("Mock Payment active. Simulating payment confirmation.");
        await submitOrderData({
          razorpayOrderId: rzpOrder.id,
          razorpayPaymentId: `pay_mock_${Math.floor(100000 + Math.random() * 900000)}`,
          razorpaySignature: `sig_mock_${Math.floor(100000 + Math.random() * 900000)}`,
        });
        return;
      }

      // 3. Launch Razorpay standard checkout iframe modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key_id",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Sustento",
        description: "Premium Fruit Snacks Checkout",
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          try {
            await submitOrderData({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (err) {
            alert("Payment confirmation failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#9e8f85", // Match brand primary brown
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.open();

    } catch (err: any) {
      alert(err.message || "Something went wrong. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="w-full bg-warm-white pt-32 pb-20 select-none">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── LEFT COLUMN: SHIPPING INFORMATION ────────────────── */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/5 flex flex-col text-left">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-accent text-3xl font-bold text-dark rotate-[-2deg]">Where</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-dark">should we ship?</h2>
            </div>

            <div className="flex flex-col gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors ${formErrors.name ? "border-red-500" : "border-black/10"
                    }`}
                />
                {formErrors.name && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.name}</span>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul@gmail.com"
                    className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors ${formErrors.email ? "border-red-500" : "border-black/10"
                      }`}
                  />
                  {formErrors.email && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.email}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors ${formErrors.phone ? "border-red-500" : "border-black/10"
                      }`}
                  />
                  {formErrors.phone && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.phone}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Street Address <span className="text-red-500">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Flat No, Wing, Building Name, Street Name"
                  rows={2}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors resize-none ${formErrors.address ? "border-red-500" : "border-black/10"
                    }`}
                />
                {formErrors.address && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.address}</span>}
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai"
                    className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors ${formErrors.city ? "border-red-500" : "border-black/10"
                      }`}
                  />
                  {formErrors.city && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.city}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">State <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Maharashtra"
                    className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors ${formErrors.state ? "border-red-500" : "border-black/10"
                      }`}
                  />
                  {formErrors.state && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.state}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-primary font-black text-xs uppercase tracking-wider text-charcoal/50">Pincode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="e.g. 400001"
                    maxLength={6}
                    className={`w-full bg-[#FAF9F5] border rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-dark transition-colors ${formErrors.zip ? "border-red-500" : "border-black/10"
                      }`}
                  />
                  {formErrors.zip && <span className="text-red-500 text-xs font-semibold px-2">{formErrors.zip}</span>}
                </div>
              </div>
            </div>

            {/* Payment Options Banner */}
            <div className="mt-8 border-t border-black/5 pt-8">
              <h3 className="text-sm font-black uppercase tracking-wider text-dark mb-4">Payment Method</h3>
              <div className="flex flex-col gap-3">
                {/* Pay Online */}
                <label 
                  className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "ONLINE" 
                      ? "border-[#9EAB75] bg-[#9EAB75]/5" 
                      : "border-black/10 hover:border-black/20"
                  }`}
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="accent-dark animate-none" 
                  />
                  <div>
                    <span className="font-primary font-black text-[13px] text-dark uppercase block">Pay Online (Card / UPI / NetBanking)</span>
                    <span className="text-[11px] font-bold text-green-600 uppercase tracking-wide">🔥 Get Free Shipping on Online Orders!</span>
                  </div>
                </label>

                {/* COD */}
                <label 
                  className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === "COD" 
                      ? "border-[#9EAB75] bg-[#9EAB75]/5" 
                      : "border-black/10 hover:border-black/20"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-dark animate-none" 
                  />
                  <div>
                    <span className="font-primary font-black text-[13px] text-dark uppercase block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] font-bold text-charcoal/40 uppercase tracking-wide">Pay cash when shipment is delivered (Shipping charges calculated by Shiprocket)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: ORDER SUMMARY & COUPONS ─────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">

            {/* Summary card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-black/5 text-left">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-accent text-3xl font-bold text-dark rotate-[-2deg]">Order</span>
                <h2 className="text-xl font-black uppercase tracking-tight text-dark">Summary</h2>
              </div>

              {/* Cart List */}
              <div className="flex flex-col gap-3.5 mb-6 max-h-[220px] overflow-y-auto pr-1 border-b border-black/5 pb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3.5">
                    <div className={`relative w-12 h-12 rounded-lg bg-gray-50 border border-black/5 overflow-hidden flex items-center justify-center shrink-0 ${item.archClass}`}>
                      <Image src={item.imageSrc} alt={item.title} fill sizes="48px" className="object-contain p-0.5 mix-blend-multiply" unoptimized={true} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-primary font-black text-xs text-dark uppercase block truncate">{item.title}</span>
                      <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wide">
                        {item.variant === "single" ? "Single Pouch" : item.variant === "pack3" ? "Pack of 3" : "Pack of 5"} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-primary font-black text-xs text-dark shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2.5 mb-6">
                <input
                  type="text"
                  placeholder="DISCOUNT CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  className="flex-1 bg-[#FAF9F5] border border-black/10 rounded-full px-5 py-3 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-dark disabled:opacity-50"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-primary font-black text-xs uppercase tracking-wider rounded-full shadow-sm cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-6 py-3 bg-[#9EAB75] hover:bg-[#FFC933] text-dark font-primary font-black text-xs uppercase tracking-wider rounded-full shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                )}
              </form>

              {couponError && <p className="text-red-500 text-xs font-semibold mb-4 px-1">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-xs font-semibold mb-4 px-1">{couponSuccess}</p>}

              {/* Subtotal blocks */}
              <div className="flex flex-col gap-2.5 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-charcoal/60">Subtotal</span>
                  <span className="font-semibold text-dark">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-charcoal/60">Shipping</span>
                  <span className="font-semibold text-dark">
                    {paymentMethod === "ONLINE" ? (
                      <span className="text-green-600 font-bold uppercase text-[11px] tracking-wider bg-green-50 px-2.5 py-0.5 rounded-full">FREE</span>
                    ) : calculatingShipping ? (
                      <span className="text-xs text-charcoal/40 animate-pulse font-bold uppercase tracking-wider">Calculating...</span>
                    ) : shippingError ? (
                      <span className="text-xs text-red-500 font-bold">{shippingError}</span>
                    ) : actualShippingCost > 0 ? (
                      `₹${actualShippingCost}`
                    ) : formData.zip.trim().length === 6 ? (
                      <span className="text-xs text-charcoal/40">Free or N/A</span>
                    ) : (
                      <span className="text-[10px] text-charcoal/40 uppercase tracking-wider">Enter 6-digit Pincode</span>
                    )}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-green-600 font-bold">
                    <span>Discount Applied</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between border-t border-black/5 pt-5 mb-4">
                <span className="font-primary font-black text-[13px] uppercase tracking-wider text-charcoal/50">Grand Total</span>
                <span className="font-primary font-black text-2xl text-dark">₹{total}</span>
              </div>

              {paymentMethod === "COD" && actualShippingCost > 0 && (
                <div className="bg-[#FAF9F5] border border-black/5 rounded-2xl p-4 text-xs font-semibold text-charcoal/60 mb-6 flex flex-col gap-2.5 text-left">
                  <div className="flex justify-between items-center text-dark font-bold">
                    <span>Pay Shipping Charge Online</span>
                    <span className="text-sm">₹{actualShippingCost}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#CC2828] border-t border-black/5 pt-2.5 font-bold">
                    <span>Pay remaining amount at delivery (COD)</span>
                    <span className="text-sm">₹{total - actualShippingCost}</span>
                  </div>
                </div>
              )}

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || (paymentMethod === "COD" && calculatingShipping)}
                className="w-full bg-black hover:bg-dark/95 text-white font-primary font-black text-[13px] uppercase tracking-wider py-4 rounded-full shadow-md hover:-rotate-1 transition-all duration-200 cursor-pointer text-center block disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {paymentMethod === "COD" ? "Processing Shipping Fee..." : "Processing Payment..."}
                  </span>
                ) : paymentMethod === "COD" ? (
                  calculatingShipping ? "Calculating Shipping..." : "Pay Shipping & Complete Order"
                ) : (
                  "Pay & Complete Order"
                )}
              </button>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
