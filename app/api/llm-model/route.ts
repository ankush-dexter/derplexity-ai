import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const {searchInput,searchResultWeb,recordId} = await request.json();

    const inngestRunId = await inngest.send({
    name: "llm-model",
    data: {
        searchInput,
        searchResultWeb,
        recordId,
        },

  });

  return NextResponse.json(inngestRunId);
}