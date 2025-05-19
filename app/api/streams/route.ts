import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = new RegExp("^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$");



const CreateStreamSchema = z.object({
    creatorId: z.string(), 
    url: z.string()
 })

export async function  POST(req:NextRequest){
   try {
     const data = CreateStreamSchema.parse(await req.json()); 
     const isYt = data.url.match(YT_REGEX);

     if(!isYt){
        return NextResponse .json({
            message:"Wrong URL"
            
        },{
            status:411
        })
         
     }
     const extractedId = data.url.split("?v=")[1];

   const res = await youtubesearchapi.getVideo(extractedId);
   console.log(res.title);
   console.log(res.thumbnail.thumbnails);
   const thumbnails = res.thumbnail.thumbnails;
   thumbnails.sort((a:{width:Number},b:{width:Number}) => a.width < b.width ? -1 : 1);

     
     const stream = await prismaClient.stream.create({
       data:{
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type:"Youtube",
        title:res.title ?? "Can't Find a Video",
        smallImg: thumbnails.length > 1 ? thumbnails(thumbnails.length-2)  ,
        bigImg: thumbnails(thumbnails.length -1) ?? "",
       }
     })

     return NextResponse.json({
        message:"Added Stream",
        id:stream.id
     })

   } catch (e) {
    return NextResponse.json({
        message:"Error while adding a stream"
    },{
        status:411
    })
    
   }
    
    
} 

export async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId"); 
    const streams = await prismaClient.user.findMany({
        where:{
            userId:creatorId ?? ""
        }

    })
    return  NextResponse.json(streams);
} 

