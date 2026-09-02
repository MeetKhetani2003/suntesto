const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    val = val.replace('\\$', '$');
    process.env[match[1].trim()] = val;
  }
});

async function testAuth() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  
  console.log("Email:", email);
  console.log("Password:", password.substring(0, 3) + "***");

  try {
      const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.error("Auth failed:", await res.text());
        return;
      }
      
      const data = await res.json();
      console.log("Auth success! Token received.");
      
      console.log("Attempting to add pickup location via API...");
      
      const addPickupPayload = {
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Test Warehouse",
        name: "Admin",
        email: email,
        phone: process.env.SHIPROCKET_WAREHOUSE_PHONE || "9999999999",
        address: process.env.SHIPROCKET_WAREHOUSE_ADDRESS || "Test Warehouse Address",
        address_2: "",
        city: process.env.SHIPROCKET_WAREHOUSE_CITY || "Rajkot",
        state: process.env.SHIPROCKET_WAREHOUSE_STATE || "Gujarat",
        country: "India",
        pin_code: process.env.SHIPROCKET_WAREHOUSE_PINCODE || "360005"
      };

      const addPickupRes = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/addpickup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.token}`
        },
        body: JSON.stringify(addPickupPayload)
      });
      
      console.log("Add Pickup status:", addPickupRes.status);
      console.log("Add Pickup response:", await addPickupRes.text());
  } catch (err) {
      console.error("Error:", err);
  }
}

testAuth();
