// server.js

import express from "express";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.config.js";
import socketConfig from "./config/socket.config.js"; // Import socket configuration
import userRoutes from "./routes/user.route.js";
import eventRoutes from "./routes/event.route.js";
import emailRoutes from "./routes/email.routes.js";
import participantRoutes from "./routes/participant.routes.js";
import reportRoutes from "./routes/report.route.js"; // Import report routes
import cors from "cors";
import "./cronJobs/taskReminder.js"; // import and execute the cron job for sending task reminder emails at 8:00AM daily.

// Manually run the cron job for testing when server will start corn job function will call

/* import checkOverdueTasks from "./cronJobs/taskReminder.js";
checkOverdueTasks(); 
*/

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app); // here i wraps express server inside http

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:8081"];
app.use(
  cors({
    origin: "http://localhost:8081", // Allow requests from your frontend
    credentials: true, // Allow cookies and auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);

// Initialize WebSocket
socketConfig(server);

// Routes

app.use("/api/user", userRoutes); // user routes
app.use("/api/event", eventRoutes); // event route
app.use("/api/email", emailRoutes); // email route
app.use("/api/participant", participantRoutes); // participant route
app.use("/api/reports", reportRoutes); // report routes

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Set up the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // using server.listen instead of app.listen to support socket.io
  console.log(`Server running on port ${PORT}`);
});
