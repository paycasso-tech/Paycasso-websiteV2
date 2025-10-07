"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { X, Phone, Video } from "lucide-react";

interface VideoCallModalProps {
  roomName: string;
  displayName: string;
  onClose: () => void;
  audioOnly?: boolean;
}

export default function VideoCallModal({
  roomName,
  displayName,
  onClose,
  audioOnly = false,
}: VideoCallModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[85vh] bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.02] backdrop-blur-2xl border border-white/20 rounded-[36px] shadow-2xl overflow-hidden relative">
        {/* Enhanced Glass Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px]">
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        <div className="absolute inset-0 rounded-[36px] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {audioOnly ? (
              <Phone className="w-5 h-5 text-green-400" />
            ) : (
              <Video className="w-5 h-5 text-blue-400" />
            )}
            <span className="text-white font-semibold">
              {audioOnly ? "Voice Call" : "Video Call"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Jitsi Meeting */}
        <div className="relative z-10 h-[calc(100%-64px)]">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: false,
              startWithVideoMuted: audioOnly,
              disableModeratorIndicator: true,
              enableEmailInStats: false,
              prejoinPageEnabled: false,
              disableInviteFunctions: true,
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              TOOLBAR_BUTTONS: [
                "microphone",
                "camera",
                "closedcaptions",
                "desktop",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "chat",
                "settings",
                "videoquality",
                "tileview",
              ],
            }}
            userInfo={{
              displayName: displayName,
            }}
            onApiReady={(externalApi) => {
              console.log("Jitsi Meet API Ready");
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
          />
        </div>
      </div>
    </div>
  );
}
