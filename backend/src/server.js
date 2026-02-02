import express from "express"
import { ENV } from "./lib/env.js";

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({ msg: "success" })
});

app.listen(ENV.PORT, () => 
    console.log(`server is running on post http://localhost:${ENV.PORT}`
));