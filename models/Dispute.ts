
import mongoose from 'mongoose';

const disputeSchema=new mongoose.Schema({
  raisedBy: { type: String, enum: ["client", "freelancer"], required: true },
  email: { type: String, required: true },
  walletAddress: { type: String, required: true },
 disputeTitle: { type: String, required: true },
  description: { type: String, required: true },
  amountInvolved: { type: Number, required: true },
  cid :  {type: String , required : true},
  ipfs_url : {type: String , required : true},

     // CID of IPFS file (chat/images) DEEPAK 
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Dispute|| mongoose.model('Dispute',disputeSchema)