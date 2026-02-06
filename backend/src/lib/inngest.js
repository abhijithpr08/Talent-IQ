import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

/* ================== USER CREATED ================== */
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🚀 [sync-user] Function triggered");
    console.log("📦 Event Data:", event.data);

    try {
      console.log("🔌 Connecting to DB...");
      await connectDB();
      console.log("✅ DB Connected");

      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`,
        profileImage: image_url,
      };

      console.log("📝 Creating user in DB:", newUser);
      await User.create(newUser);
      console.log("✅ User saved to MongoDB");

      console.log("🔄 Syncing user to Stream...");
      await upsertStreamUser({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        image: newUser.profileImage,
      });
      console.log("✅ Stream user synced successfully");

    } catch (error) {
      console.error("❌ [sync-user] Error occurred:", error);
      throw error; // important so Inngest marks the run as failed
    }
  }
);

/* ================== USER DELETED ================== */
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("🗑️ [delete-user-from-db] Function triggered");
    console.log("📦 Event Data:", event.data);

    try {
      console.log("🔌 Connecting to DB...");
      await connectDB();
      console.log("✅ DB Connected");

      const { id } = event.data;

      console.log("🗑️ Deleting user from DB with clerkId:", id);
      await User.deleteOne({ clerkId: id });
      console.log("✅ User deleted from MongoDB");

      console.log("🔄 Deleting user from Stream...");
      await deleteStreamUser(id.toString());
      console.log("✅ Stream user deleted");

    } catch (error) {
      console.error("❌ [delete-user-from-db] Error occurred:", error);
      throw error;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];
