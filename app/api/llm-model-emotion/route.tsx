import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const {searchInput,recordId} = await request.json();

    const inngestRunId = await inngest.send({
    name: "friendly-chat",
    data: {
        searchInput,
        recordId,
        },

  });

  return NextResponse.json(inngestRunId);
}