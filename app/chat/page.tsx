'use client'

import ChatSidebar from "./components/Chat-Sidebar"

export default function ChatPage() {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="w-[65%] h-full p-4">
        <div className="h-full w-full border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-lg">
          Contracts
        </div>
      </div>

      <div className="w-[35%] p-4 h-full flex flex-col">
        <div className="mt-auto mb-6 h-[480px] bg-white rounded-2xl shadow-lg overflow-y-auto ">
          <ChatSidebar />
        </div>
      </div>
    </div>
  )
}
