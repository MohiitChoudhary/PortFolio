const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGINS || "*";
const corsOptions = corsOrigin === "*" ? {} : { origin: corsOrigin.split(',') };

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing name, email, or message" });
  }

  console.log("Contact request:", { name, email, message });
  res.json({ status: "success", message: "Thanks! Your message has been received." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
