import express from "express"
import db from "./config/db.js";
import "dotenv/config"
import authroutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorHandler } from "./middleware/errorHandler.js";
import { checkExpiredSubscriptions } from "./services/subscriptionService.js";

const port = process.env.PORT || 3000;
const app = express();

// Connect to database
db();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.send("Backend is working");
});

app.use("/auth", authroutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/admin", adminRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Check expired subscriptions every hour
setInterval(async () => {
  try {
    await checkExpiredSubscriptions();
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
  }
}, 3600000); // 1 hour


