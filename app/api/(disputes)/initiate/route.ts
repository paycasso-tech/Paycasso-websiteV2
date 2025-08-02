import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Dispute from '@/models/Dispute';


export async function POST(req: NextRequest) {
    await dbConnect();
    try {

        
        const data = await req.json();
        console.log(data)
        const {
        raisedBy,
        email,      
        walletAddress,
        disputeTitle,   
        description,
        amountInvolved,
        ipfs_url,           
        cid          
    
        }=data;
        console.log( raisedBy,
        email,      
        walletAddress,
        disputeTitle,   
        description,
        amountInvolved,
        ipfs_url,           
        cid         )
        //validation if they are present or not
        if(!raisedBy||!email||!walletAddress||!disputeTitle||!description||!amountInvolved ||!ipfs_url ||!cid){
            return NextResponse.json({success:false,message:"Please fill all the required fields"}, {status:400});
        }

        // the initialiser data is being store in dispute model
            const dispute=await Dispute.create({
                raisedBy,
                email,      
                walletAddress,
                disputeTitle,   
                description,
                amountInvolved,                     
                ipfs_url,           
                cid    ,
                createdAt: new Date(),
                status:"pending"

                })
                

        return NextResponse.json({ successs:true }, { status: 200 });

    } 

    catch (error: any) {
            console.error('Error creating dispute:', error);
            return NextResponse.json({ success: false, error: error.message  }, { status: 400 });
        }
}