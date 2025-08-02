"use client";
import FileUpload from "@/components/ui/file-upload";
import React, { useState } from "react";
import axios  from "axios"
import { NextResponse } from "next/server";
const initialState = {
  raisedBy: "client",
  email: "",
  walletAddress: "",
  disputeTitle: "",
  description: "",
  amountInvolved: "",
  cid: "",
  ipfs_url: "",
};

export default function RaiseDisputePage() {
  const [form, setForm] = useState(initialState);
  const [loading , setloading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setloading(true);
    try{
    const res = await axios.post("/api/initiate",form)
    alert("Dispute submitted!");
    }
    catch(e){
        console.log(e)
    }
    finally{
         setloading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
        const formdata = new FormData()
        formdata.append("file",file)
        try {
            const res = await axios.post("/api/upload-ipfs",formdata,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            console.log(res.data)
            const { cid, url } = res.data;

            //  Update the form state
            setForm((prev) => ({
            ...prev,
            cid: cid,
            ipfs_url: url,
            }));

        }
        catch(err){
            console.log("error",err)

        }

  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Raise a Dispute</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Raised By</label>
          <select
            name="raisedBy"
            value={form.raisedBy}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 "
          >
           
            <option value="client" className="text-black">Client</option>
            <option value="freelancer" className="text-black">Freelancer</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Wallet Address</label>
          <input
            type="text"
            name="walletAddress"
            value={form.walletAddress}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Dispute Title</label>
          <input
            type="text"
            name="disputeTitle"
            value={form.disputeTitle}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Amount Involved</label>
          <input
            type="number"
            name="amountInvolved"
            value={form.amountInvolved}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            min="0"
            step="any"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">CID</label>
          <input
            type="text"
            name="cid"
            value={form.cid}
            placeholder="Autofill"
            onChange={handleChange}
            disabled
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">IPFS URL</label>
          <input
            type="text"
            name="ipfs_url"
            placeholder="Autofill"
            value={form.ipfs_url}
            onChange={handleChange}
            disabled
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <FileUpload onSubmit={handleFileUpload} label="Upload Evidence"/>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting...." : "Submit Dispute"}
        </button>
      </form>
    </div>
  );
}