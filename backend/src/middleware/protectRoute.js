import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = [
    requireAuth(),
    async (req,res,next)=>{
        try {
                const clerkId = req.auth().userId;

                if(!clerkId) return res.status(401).json({message: "Unauthorized - invalid token"})

                let user = await User.findOne({clerkId})

                // If the user isn't in our DB, attempt to fetch from Clerk and create locally
                if(!user) {
                    // If CLERK_API_KEY is provided, try to fetch user details from Clerk
                    if (ENV.CLERK_API_KEY) {
                        try {
                            const resp = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
                                headers: { Authorization: `Bearer ${ENV.CLERK_API_KEY}` },
                            });

                            if (resp.ok) {
                                const userData = await resp.json();
                                const email = userData.email_addresses?.[0]?.email_address;
                                const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || email || 'Unknown';

                                if (email) {
                                    const newUser = await User.create({
                                        clerkId,
                                        email,
                                        name,
                                        profileImage: userData.image_url || '',
                                    });
                                    user = newUser;
                                } else {
                                    console.error('Clerk user missing email, cannot create local user');
                                    return res.status(404).json({ message: 'User not found' });
                                }
                            } else {
                                console.error('Failed to fetch user from Clerk', await resp.text());
                                return res.status(404).json({ message: 'User not found' });
                            }
                        } catch (err) {
                            console.error('Error creating user from Clerk data', err);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    } else {
                        // No Clerk API key: create a minimal local user using clerkId-derived email
                        try {
                            const generatedEmail = `${clerkId}@clerk.local`;
                            const name = `User ${clerkId.slice(0, 8)}`;
                            const newUser = await User.create({
                                clerkId,
                                email: generatedEmail,
                                name,
                                profileImage: '',
                            });
                            user = newUser;
                        } catch (err) {
                            console.error('Error creating fallback local user', err);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    }
                }

                req.user = user

                next()

            } catch (error) {
                console.error("Error in protectRoute middleware",error)
                res.status(500).json({message: "Internal server error"})
            }
    }
]