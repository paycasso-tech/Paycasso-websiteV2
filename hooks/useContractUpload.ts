import { useState } from "react";
import { toast } from "sonner";

import { createFileService } from "@/services/file.service";
import { createAgreementService } from "@/services/agreement.service";
import { CreateAgreementProps } from "@/types/agreements";
import { createClient } from "@/lib/utils/supabase/client";
import { parseAmount } from "@/lib/utils/amount";

interface Amount {
  amount: string;
  full_amount: string;
  payment_for: string;
  for: string;
  location: string;
}

interface Task {
  task_description: string;
  description: string;
  details: string[];
  due_date: string;
  responsible_party: string;
  additional_details: string;
}

export interface DocumentAnalysis {
  amounts: Amount[];
  tasks: Task[];
}

export const useContractUpload = (props: CreateAgreementProps) => {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClient();
  const fileService = createFileService(supabase);
  const agreementService = createAgreementService(supabase);

  const analyzeDocument = async (file: File): Promise<DocumentAnalysis> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/contracts/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to analyze document");
    }

    return response.json();
  };

  const handleFileUpload = async (file: File) => {
    setDone(false);

    if (!props.beneficiaryWalletId) {
      toast.error("Missing beneficiary", {
        description: "Please select a recipient before uploading a contract",
      });
      return;
    }

    let tempPath: string | null = null;
    setUploading(true);

    try {
      fileService.validateFile(file);

      // Upload to temp location
      tempPath = await fileService.uploadToTemp(file, props.userId);

      // Analyze document using the new API
      // const analysis = await analyzeDocument(file);

      // if (!analysis.amounts?.length) {
        // throw new Error("No amounts found in the document");
      // }

      const analysis={
  "amounts": [
    {
      "amount": "$10",
      "full_amount": "$10",
      "payment_for": "Full compensation for the services provided under this Agreement.",
      "for": "Services provided under this Agreement.",
      "location": "Section 2.1"
    }
  ],
  "tasks": [
    {
      "task_description": "Create one high-quality, professionally photographed image.",
      "description": "The image must feature SparkleFizz Co.'s flagship beverage, SparkleFizz Original Citrus, capturing its vibrant qualities as a premium summer beverage.",
      "details": [
        "The theme should evoke feelings of refreshment, summer, and enjoyment.",
        "The environment must be a sunny outdoor location or a bright, sunlit indoor setting.",
        "The bottle should be clean, condensation-covered, and the focal point.",
        "The SparkleFizz label must be clearly visible and positioned prominently."
      ],
      "due_date": "2025-08-18",
      "responsible_party": "Alex Thompson (Content Creator)",
      "additional_details": "A hand holding or pouring the drink is optional but encouraged."
    },
    {
      "task_description": "Deliver final image files.",
      "description": "The Content Creator is required to provide one primary image and two social media adaptations in specific file formats.",
      "details": [
        "One high-resolution, unfiltered primary photo.",
        "Two additional cropped versions optimized for Instagram (square) and Story (portrait) formats.",
        "All files must be provided in .jpeg and .png formats."
      ],
      "due_date": "2025-08-18",
      "responsible_party": "Alex Thompson (Content Creator)",
      "additional_details": "The resolution must be suitable for digital and print usage."
    },
    {
      "task_description": "Pay the Content Creator for their services.",
      "description": "The Brand shall pay the Content Creator $10 as full compensation for the services provided under the agreement.",
      "details": [],
      "due_date": "Within 30 days of submission and approval of the final image.",
      "responsible_party": "SparkleFizz Co. (Brand)",
      "additional_details": "Payment is contingent on the Brand's approval of the deliverables."
    },
    {
      "task_description": "Manage the content revision process.",
      "description": "The Brand must notify the Content Creator if revisions are needed, and one revision is included in the scope of work.",
      "details": [
        "The Brand must notify the Content Creator of any required revisions within 7 days of submission.",
        "One revision is included if the initial deliverable does not meet the specified standards."
      ],
      "due_date": "Within 7 days of submission for revision notification.",
      "responsible_party": "SparkleFizz Co. (Brand) for notification, Alex Thompson (Content Creator) for revision",
      "additional_details": ""
    },
    // {
    //   "task_description": "Grant usage license and provide photographer credit.",
    //   "description": "The Content Creator grants the Brand a license to use the image for marketing, and the Brand shall credit the Content Creator.",
    //   "details": [
    //     "The license granted is non-exclusive, perpetual, and worldwide.",
    //     "The Brand shall credit the Content Creator in any digital or print publication of the image where applicable."
    //   ],
    //   "due_date": "N/A",
    //   "responsible_party": "Alex Thompson (Content Creator) for granting license, SparkleFizz Co. (Brand) for providing credit",
    //   "additional_details": "The Content Creator retains ownership of the original image."
    // },
    // {
    //   "task_description": "Cover all production expenses.",
    //   "description": "The Content Creator is responsible for all expenses incurred during the production of the image.",
    //   "details": [],
    //   "due_date": "N/A",
    //   "responsible_party": "Alex Thompson (Content Creator)",
    //   "additional_details": "This condition applies unless otherwise agreed upon in writing by both parties."
    // },
    // {
    //   "task_description": "Maintain confidentiality.",
    //   "description": "Both parties are obligated to maintain the confidentiality of any proprietary information shared.",
    //   "details": [
    //     "Confidential information includes unreleased product details or marketing strategies."
    //   ],
    //   "due_date": "N/A",
    //   "responsible_party": "Both parties",
    //   "additional_details": ""
    // }
  ]
}

      // Create transaction with the new amount format
      const amount = parseAmount(analysis.amounts[0].amount);
      const transaction = await agreementService.createTransaction({
        walletId: props.depositorWalletId!,
        profileId: props.userProfileId!,
        amount,
        description:
          analysis.amounts[0]?.payment_for || "Escrow agreement deposit",
      });

      // Create agreement
      const agreement = await agreementService.createAgreement({
        beneficiaryWalletId: props.beneficiaryWalletId,
        depositorWalletId: props.depositorWalletId!,
        transactionId: transaction.id,
        terms: {
          ...analysis,
          originalFileName: file.name,
        },
      });

      // Move file to final location
      const finalPath = await fileService.downloadAndUploadToFinal(
        tempPath,
        file,
        agreement.id
      );

      // Cleanup temp file
      await fileService.deleteTempFile(tempPath);

      // Get public URL and update agreement
      const signedUrl = await fileService.getSignedUrl(finalPath);
      await agreementService.updateAgreementTerms(agreement.id, {
        ...analysis,
        documentUrl: signedUrl,
        originalFileName: file.name,
      });

      toast.success("Document processed successfully", {
        description: `Found ${analysis.amounts.length} amounts and ${
          analysis.tasks?.length || 0
        } tasks`,
      });

      props.onAnalysisComplete?.(analysis, {
        ...agreement,
        terms: {
          ...analysis,
          documentUrl: signedUrl,
          originalFileName: file.name,
        },
      });

      return { analysis, agreement };
    } catch (error) {
      console.error("Process error:", error);

      if (tempPath) {
        try {
          await fileService.deleteTempFile(tempPath);
        } catch (deleteError) {
          console.error("Failed to delete temporary file:", deleteError);
        }
      }

      toast.error("Process failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while processing the document. Please try again later.",
      });
    } finally {
      setUploading(false);
      setDone(true);
    }
  };

  return { handleFileUpload, analyzeDocument, uploading, done };
};
