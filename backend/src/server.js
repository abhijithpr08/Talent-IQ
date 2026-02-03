import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";

const app = express();

const __dirname = path.resolve()

app.get("/hey", (req, res) => {
    res.status(200).json({ msg: "success" })
});

//make our app ready for deployment
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("/{*any}", (req,res)=> {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    })
}

app.listen(ENV.PORT, () => 
    console.log(`server is running on post http://localhost:${ENV.PORT}`
));