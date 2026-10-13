import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import compression from "compression";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gzip compression for all text-based assets (HTML, CSS, JS, etc.)
  app.use(compression());

  // JSON request body parser
  app.use(express.json());

  // Security headers and crawl optimization
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  // WWW to non-WWW redirect & SSL enforcement (Canonical Host redirect)
  app.use((req, res, next) => {
    const host = req.headers.host || "";
    const isWww = host.startsWith("www.");
    const isHttp = req.headers["x-forwarded-proto"] === "http";

    if (isWww || isHttp) {
      const cleanHost = isWww ? host.slice(4) : host;
      if (host.includes("dukaanmitra.in")) {
        return res.redirect(301, `https://${cleanHost}${req.originalUrl}`);
      }
    }
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;
      if (!amount || amount < 100) {
        return res.status(400).json({ error: "Amount must be at least 100 paise" });
      }

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      });

      const options = {
        amount,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const order = await instance.orders.create(options);
      res.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      console.error("Razorpay create-order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.post("/api/verify-payment", (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET || "";
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature === razorpay_signature) {
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error) {
      console.error("Razorpay verify-payment error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files with intelligent cache control
    app.use(express.static(distPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        // Force revalidation for HTML, XML sitemaps, and robots.txt files
        const ext = path.extname(filePath);
        if (ext === ".html" || ext === ".xml" || filePath.endsWith("robots.txt")) {
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        } else {
          // Cache fingerprinted and static assets (images, js, css, etc.) immutably
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));

    // Handle SPA fallback. Prevent files with file extensions (e.g. .png, .js, .css, .json)
    // that don't exist from falling back to index.html with a 200 OK status.
    app.get("*", (req, res) => {
      const ext = path.extname(req.path);
      if (ext && ext !== ".html") {
        return res.status(404).send("Not Found");
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
