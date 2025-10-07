export type Message = {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  created_at: string;
  type: "text" | "image" | "attachment" | "link";
  metadata?: {
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
  };
};

export type Presence = {
  user_id: string;
  last_seen_at: string;
  online: boolean;
};

export type ChatSidebarProps = {
  contractId?: string;
  counterpartyId: string;
  counterpartyName: string;
  contractStatus?: string;
  onClose?: () => void;
};
