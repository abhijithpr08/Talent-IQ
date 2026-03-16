import express from "express";
import path from "path";
import cors from "cors";

import { clerkMiddleware } from '@clerk/express'
import {serve} from "inngest/express"
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest,functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import problemRoutes from "./routes/problemRoute.js";
import adminRoutes from "./routes/adminRoute.js";

const app = express();

const __dirname = path.resolve();

console.log("Server: Initializing Express app");

// middleware
console.log("Server: Setting up middleware");
app.use(express.json())
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(clerkMiddleware());

console.log("Server: Mounting routes");
app.use("/api/inngest", serve({client:inngest, functions}))
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
    console.log("Server: Health check requested");
    req.auth;
    res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  console.log("Server: Production mode - serving static files");

  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/:path(*)", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
    console.log("Server: Starting server initialization");
    try {
        console.log("Server: Connecting to database");
        await connectDB();
        console.log("Server: Database connected successfully");
        console.log("Server: Starting HTTP server on port", ENV.PORT);
        app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`));
    } catch (error){
        console.log("Server: Error starting server:", error.message);
    }
};

startServer()