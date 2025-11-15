import { handleBootSrap } from "@/app/services/bootstrap";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const { targetIndex } = await req.json();  // FIXED
    await handleBootSrap(targetIndex);

    //return NextResponse
     return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
         console.error("Bootstrap failed:", error);

    // Return error response
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
    }
    
    
}