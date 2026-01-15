import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// IMPORTANT: allow Carrd / embeds to call this server
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});

app.post("/pay", async (req, res) => {
  try {
    const { email, amount } = req.body;

    const response = await fetch(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KORAPAY_SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount,
          currency: "NGN",
          reference: `fx_${Date.now()}`,
          redirect_url: "https://fortunexsuccess.uwu.ai",
          customer: { email }
        })
      }
    );

    const data = await response.json();
    res.json({ checkout_url: data.data.checkout_url });
  } catch (err) {
    res.status(500).json({ error: "Payment init failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
