"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAgreementProps } from "@/types/agreements";
import { useContractUpload } from "@/hooks/useContractUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Task {
  description: string;
}

interface Amount {
  amount: string;
  for: string;
}

export const UploadContractButton = (props: CreateAgreementProps) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [analyzingDocument, setAnalyzingDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [contractAmounts, setContractAmounts] = useState<Amount[]>([]);
  const [contractTerms, setContractTerms] = useState<string[]>([]);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const { handleFileUpload, analyzeDocument, uploading } = useContractUpload({
    ...props
  });

  const openFilePicker = () => {
    hiddenFileInput.current?.click();
  };

  const closeAlertDialog = () => setConfirmationDialogOpen(false);

  const uploadDocument = async () => {
    try {
      if (!selectedFile) {
        throw new Error("No file selected");
      }

      await handleFileUpload(selectedFile);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Error uploading document", {
        description: error instanceof Error
          ? error.message
          : "An error occurred while uploading the document. Please try again later.",
      });
    }

    closeAlertDialog();
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      setSelectedFile(files[0]);

      setAnalyzingDocument(true);

      // const document = await analyzeDocument(files[0]) as unknown as { amounts: Amount[], tasks: Task[] };
      const document = {
  amounts: [
    {
      "amount": "$10",
      "currency": "USD",
      "for": "Full compensation for the services provided under this Agreement. [cite: 24]",
      "location": "Section 2.1 [cite: 24]"
    }
  ],
  tasks: [
    "Content Creator agrees to create and deliver one high-quality, professionally photographed image of SparkleFizz Original Citrus. [cite: 4]",
    "The image must be captured in a setting that emphasizes its vibrant, refreshing qualities as a premium summer beverage. [cite: 5]",
    "The image should evoke feelings of refreshment, summer, and enjoyment. [cite: 8]",
    "The Product must be photographed in a sunny outdoor location or near a bright, sunlit window indoors. [cite: 8, 9]",
    "The SparkleFizz bottle should be clean, condensation-covered, and be the focal point. [cite: 10]",
    "The SparkleFizz label must be clearly visible without obstructions. [cite: 14]",
    "Content Creator shall deliver one high-resolution, unfiltered photo. [cite: 17]",
  ]
}
      setContractAmounts(document.amounts);

      setAnalyzingDocument(false);

      const contractTasks = document.tasks.map(task => task);
      setContractTerms(contractTasks);
      setConfirmationDialogOpen(true);
      console.log("Document analyzed successfully:", contractTerms, contractAmounts);

      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={hiddenFileInput}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        hidden
      />
      <Button
        disabled={analyzingDocument || !props.beneficiaryWalletId}
        onClick={openFilePicker}
      >
        {analyzingDocument ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing document...
          </>
        ) : (
          <>
            <FileUp className="mr-2 h-4 w-4" />
            Upload contract
          </>
        )}
      </Button>
      <AlertDialog open={confirmationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review contract terms</AlertDialogTitle>
            <AlertDialogDescription>
              Before proceeding, check the uploaded contract terms below to ensure everything is correct.
            </AlertDialogDescription>
            <span className="text-sm text-muted-foreground font-bold">Amounts:</span>
            <ul className="my-6 ml-6 list-disc text-sm text-muted-foreground [&>li]:mt-2 [&>li:first-child]:mt-0">
              {contractAmounts.map((contractAmount, index) => (
                <li key={index}>
                  <b>{contractAmount.amount}</b>: {contractAmount.for}
                </li>
              ))}
            </ul>
            <span className="text-sm text-muted-foreground font-bold">Tasks:</span>
            <ul className="my-6 ml-6 list-disc text-sm text-muted-foreground [&>li]:mt-2 [&>li:first-child]:mt-0">
              {contractTerms.map((contractTerm, index) => (
                <li key={index}>
                  {contractTerm}
                </li>
              ))}
            </ul>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeAlertDialog} className="text-black">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={uploading} onClick={uploadDocument}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading document...
                </>
              ) : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
