import dotenv from "dotenv";

dotenv.config({ quiet: true });

console.log("ENV: Loading environment variables");

export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    ADMIN_CLERK_IDS: (process.env.ADMIN_CLERK_IDS || "")
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean),
    INNGEST_EVENT_KEY : process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY : process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY : process.env.STREAM_API_KEY,
    STREAM_API_SECRET : process.env.STREAM_API_SECRET 
    ,
    CLERK_API_KEY: process.env.CLERK_API_KEY
};

console.log("ENV: Environment variables loaded, PORT:", ENV.PORT, "NODE_ENV:", ENV.NODE_ENV);