import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = [
    requireAuth(),
    async (req,res,next)=>{
        console.log("protectRoute: Authenticating user");
        try {
                const clerkId = req.auth().userId;
                console.log("protectRoute: Clerk ID:", clerkId);

                if(!clerkId) {
                    console.log("protectRoute: No clerkId found");
                    return res.status(401).json({message: "Unauthorized - invalid token"})
                }

                let user = await User.findOne({clerkId})
                console.log("protectRoute: User found in DB:", !!user);

                // If the user isn't in our DB, attempt to fetch from Clerk and create locally
                if(!user) {
                    // If CLERK_API_KEY is provided, try to fetch user details from Clerk
                    if (ENV.CLERK_API_KEY) {
                        console.log("protectRoute: Fetching user from Clerk API");
                        try {
                            const resp = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
                                headers: { Authorization: `Bearer ${ENV.CLERK_API_KEY}` },
                            });

                            if (resp.ok) {
                                const userData = await resp.json();
                                const email = userData.email_addresses?.[0]?.email_address;
                                const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || email || 'Unknown';
                                console.log("protectRoute: Fetched user data from Clerk:", { email, name });

                                if (email) {
                                    const newUser = await User.create({
                                        clerkId,
                                        email,
                                        name,
                                        profileImage: userData.image_url || '',
                                    });
                                    user = newUser;
                                    console.log("protectRoute: New user created in DB");
                                } else {
                                    console.log("protectRoute: Clerk user missing email");
                                    return res.status(404).json({ message: 'User not found' });
                                }
                            } else {
                                console.log("protectRoute: Failed to fetch from Clerk API");
                                return res.status(404).json({ message: 'User not found' });
                            }
                        } catch (err) {
                            console.log("protectRoute: Error creating user from Clerk data:", err.message);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    } else {
                        // No Clerk API key: create a minimal local user using clerkId-derived email
                        console.log("protectRoute: No Clerk API key, creating fallback user");
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
                            console.log("protectRoute: Fallback user created");
                        } catch (err) {
                            console.log("protectRoute: Error creating fallback user:", err.message);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    }
                }

                req.user = user
                console.log("protectRoute: Authentication successful, proceeding to next middleware");
                next()

            } catch (error) {
                console.log("protectRoute: Error in middleware:", error.message);
                res.status(500).json({message: "Internal server error"})
            }
    }
]