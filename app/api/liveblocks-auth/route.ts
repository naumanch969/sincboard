import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_API_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const userAuth = await auth();
    const user = await currentUser();

    if (!userAuth || !user)
      return new Response("Unauthorized", { status: 403 });

    const { room: roomId } = await request.json();
    const board = await convex.query(api.board.get, { id: roomId }); // roomId of room is kept --> boardId (See RoomProvider)

    if (board?.orgId !== userAuth.orgId)
      // Only allow if user is part of organization
      return new Response("Unauthorized", { status: 403 });

    const userInfo = {
      name: user.firstName || "Anonymous",
      picture: user.imageUrl!,
    };

    const session = liveblocks.prepareSession(user.id, { userInfo });

    if (roomId) {
      session.allow(roomId, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();
    console.log(body, status);
    return new Response(body, { status });
  } catch (error) {
    console.log("error", error);
  }
}
