import { createClerkClient } from "@clerk/backend";
import { WebhookEvent, UserJSON } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const data = evt.data as UserJSON;

    const user = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: data.username || "",
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      photo: data.image_url,
    };

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(data.id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "User created", user: newUser });
  }

  if (eventType === "user.updated") {
    const data = evt.data as UserJSON;

    const updatedUser = await updateUser(data.id, {
      username: data.username || "",
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      photo: data.image_url,
    });

    return NextResponse.json({ message: "User updated", user: updatedUser });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data as { id: string };

    const deletedUser = await deleteUser(id);

    return NextResponse.json({ message: "User deleted", user: deletedUser });
  }

  return new Response("Unhandled event", { status: 200 });
}
