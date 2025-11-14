import { initiateBootstrap } from '@/app/services/bootstrap';
import {NextResponse} from 'next/server';
export async function POST() {
    //Initiate the bootstrapping process
      await initiateBootstrap(process.env.PINECONE_INDEX as string);


    //return NextResponse
    return NextResponse.json({success: true}, {status: 200});
}