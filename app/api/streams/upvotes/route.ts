
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server"; 
import {z} from "zod";


const UpvoteSchema = z.object({
    streamId: z.string()


})

export async function POST(req:NextRequest){
    const session = await getServerSession();
    if(!session?.user?.email){
        return NextResponse.json({
            message:"UnAuthorized"
        },{
            status:403
        })

    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })
   
    try {
         const data = await UpvoteSchema.parse(await req.json());
         await prismaClient.upvote.create({
            data:{
                userId: user.id,
                streamId:data.streamId

            }
         })
        
    } catch (error) {
        return NextResponse.json({
            message:"Error while upvoting"
        },{
            status:403
        })
        
        
    }
}