 import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res){
    try {
        const token = chatClient.createToken(req,User.clerkId)

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image
        })
    } catch (error) {
        console.log("Error in getstreamToken cntroller:", error.message);
        res.status(500).json({mesaage: "Internal server Error"});
    }
}