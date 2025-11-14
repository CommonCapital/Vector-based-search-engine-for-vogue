import { handleBootSrap } from "@/app/services/bootstrap";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { targetIndex } = await req.json();  // FIXED
    await handleBootSrap(targetIndex);

    //return NextResponse
}