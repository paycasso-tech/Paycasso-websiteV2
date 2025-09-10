import { useRef, useState } from "react";
import { 
  FileText, 
  ExternalLink, 
  CircleDollarSign, 
  Loader2, 
  ImageUp, 
  Trash2,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AgreementStatus, EscrowAgreementWithDetails } from "@/types/escrow";
import { getStatusColor } from "@/lib/utils/escrow";
import { CreateSmartContractButton } from "@/components/dashboard/agreements/deploy-smart-contract-button";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import Confetti from "react-confetti";
import { AgreementDeleteDialog } from "./agreement-delete-dialog";
import { ValidationFailedDialog } from "./validation-failed-dialog";
import { ValidationSucceededDialog } from "./validation-succeeded-dialog";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EscrowAgreementCardProps {
  agreement: EscrowAgreementWithDetails;
  profileId: string;
  userId: string;
  depositing?: string;
  refresh: () => Promise<void>;
  preApproveCallback: () => void;
}

interface Task {
  description: string;
  due_date: string;
  responsible_party: string;
  details: string[];
}

interface Amount {
  for: string;
  amount: string;
  location: string;
}

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";

const supabase = createSupabaseBrowserClient();

const getStatusConfig = (status: string) => {
  const configs = {
    INITIATED: { 
      color: "bg-slate-600/20 text-slate-300 border-slate-500/30", 
      icon: Clock,
      description: "Agreement created, pending smart contract deployment"
    },
    OPEN: { 
      color: "bg-blue-600/20 text-blue-300 border-blue-500/30", 
      icon: CircleDollarSign,
      description: "Smart contract deployed, ready for fund deposit"
    },
    LOCKED: { 
      color: "bg-amber-600/20 text-amber-300 border-amber-500/30", 
      icon: AlertTriangle,
      description: "Funds deposited, awaiting work submission"
    },
    PENDING: { 
      color: "bg-purple-600/20 text-purple-300 border-purple-500/30", 
      icon: Clock,
      description: "Work submitted, under review"
    },
    CLOSED: { 
      color: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30", 
      icon: CheckCircle2,
      description: "Agreement completed successfully"
    },
    DISPUTED: { 
      color: "bg-red-600/20 text-red-300 border-red-500/30", 
      icon: AlertTriangle,
      description: "Agreement in dispute, requires resolution"
    },
  };
  
  return configs[status] || configs.INITIATED;
};

export const EscrowAgreementItem: React.FC<EscrowAgreementCardProps> = ({
  agreement,
  profileId,
  userId,
  depositing,
  refresh,
  preApproveCallback
}) => {
  const [submittingWork, setSubmittingWork] = useState<string>();
  const [validationResult, setValidationResult] = useState([]);
  const [workAccepted, setWorkAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusConfig = getStatusConfig(agreement.status);
  const StatusIcon = statusConfig.icon;

  const isDepositor = userId === agreement.depositor_wallet?.profiles?.auth_user_id;
  const isBeneficiary = userId === agreement.beneficiary_wallet?.profiles?.auth_user_id;

  const handleSubmitWork = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const submitWork = async (
    event: React.ChangeEvent<HTMLInputElement>,
    circleContractId: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSubmittingWork(circleContractId);
      try {
        const formData = new FormData();
        formData.append("circleContractId", circleContractId)
        formData.append("file", file);

        const response = await fetch(
          `${baseUrl}/api/contracts/validate-work`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        const parsedResponse = await response.json();

        if (parsedResponse.error) {
          setValidationResult(parsedResponse.reasons);
          return;
        }
        if (response.ok && !parsedResponse.error) {
          setWorkAccepted(true);
        } else {
          toast.error("Unexpected error occurred during work submission");
        }

        toast.success(parsedResponse.message || "Work submitted successfully");
        refresh();
      } catch (error) {
        console.error("Error submitting work:", error);
        toast.error("An error occurred while submitting the work");
      } finally {
        setSubmittingWork(undefined);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const approveDeposit = async (agreement: EscrowAgreementWithDetails) => {
    preApproveCallback();

    const approveResponse = await fetch(`${baseUrl}/api/contracts/escrow/deposit/approve`, {
      method: "POST",
      body: JSON.stringify({
        circleContractId: agreement.circle_contract_id
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const parsedApproveResponse = await approveResponse.json();

    if (parsedApproveResponse.error) {
      console.error("Failed to approve funds deposit:", parsedApproveResponse.error);
      toast.error("Failed to approve funds deposit", {
        description: parsedApproveResponse.error
      })
    }

    refresh();
    toast.info(parsedApproveResponse.message);
  }

  const handleDeleteEscrow = async (id: string) => {
    const { error } = await supabase
      .from("escrow_agreements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete escrow agreement:", error);
      toast.error("An error occurred while deleting the escrow agreement");
    }

    refresh();
  };

  const handleCongratulate = () => {
    setWorkAccepted(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }

  return (
    <>
      <div className="space-y-6">
        {/* Agreement Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${statusConfig.color.split(' ')[0]}`}>
                <StatusIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Agreement with{" "}
                  {isDepositor
                    ? agreement.beneficiary_wallet?.profiles.name || "Unknown Beneficiary"
                    : agreement.depositor_wallet?.profiles.name || "Unknown Depositor"}
                </h3>
                <p className="text-sm text-slate-400">
                  {statusConfig.description}
                </p>
              </div>
            </div>
            
            <Badge className={`${statusConfig.color} font-medium px-3 py-1`}>
              {agreement.status}
            </Badge>
            
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {new Date(agreement.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(agreement.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {(isDepositor && agreement.status === "INITIATED") && (
              <AgreementDeleteDialog
                agreement={agreement}
                profileId={profileId}
                handleDeleteEscrow={handleDeleteEscrow}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AgreementDeleteDialog>
            )}
          </div>
        </div>

        <Separator className="border-slate-700/50" />

        {/* Action Buttons Section */}
        <div className="space-y-4">
          {(isDepositor && agreement.status === "INITIATED") && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white mb-1">Deploy Smart Contract</h4>
                  <p className="text-sm text-slate-400">Create the smart contract for this agreement</p>
                </div>
                <CreateSmartContractButton agreement={agreement} />
              </div>
            </div>
          )}

          {(isDepositor && agreement.status === "OPEN") && (
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-300 mb-1">Deposit Funds</h4>
                  <p className="text-sm text-blue-200/70">
                    Deposit {agreement.terms?.amounts?.[0]?.amount} to start the escrow
                  </p>
                </div>
                <Button 
                  disabled={depositing === agreement.id} 
                  onClick={() => approveDeposit(agreement)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {depositing === agreement.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CircleDollarSign className="mr-2 h-4 w-4" />
                      Deposit Funds
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {(isBeneficiary && agreement.status === "LOCKED") && (
            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-emerald-300 mb-1">Submit Work</h4>
                  <p className="text-sm text-emerald-200/70">
                    Upload proof of completed work for validation
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={event => submitWork(event, agreement.circle_contract_id)}
                  />
                  <Button 
                    disabled={submittingWork !== undefined} 
                    onClick={handleSubmitWork}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submittingWork === agreement.circle_contract_id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImageUp className="mr-2 h-4 w-4" />
                        Submit Work
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contract Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Information */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Contract Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agreement.transactions?.circle_contract_address && (
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Contract Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Input 
                      disabled 
                      value={agreement.transactions.circle_contract_address} 
                      className="bg-slate-700/40 border-slate-600/50 text-slate-300 text-sm font-mono"
                    />
                    <CopyButton 
                      text={agreement.transactions.circle_contract_address}
                      className="shrink-0"
                    />
                  </div>
                </div>
              )}

              {agreement.terms.documentUrl && (
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Agreement Document
                  </label>
                  <a
                    href={agreement.terms.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700/40 border border-slate-600/50 rounded-lg text-sm text-blue-300 hover:text-blue-200 hover:bg-slate-700/60 transition-all duration-200"
                  >
                    <FileText className="h-4 w-4" />
                    {agreement.terms.originalFileName || "View Document"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Financial Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agreement.terms.amounts && agreement.terms.amounts.length > 0 ? (
                <div className="space-y-3">
                  {agreement.terms.amounts.map((amount: Amount, index: number) => (
                    <div key={index} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">
                          {amount.for}
                        </span>
                        <Badge variant="outline" className="border-slate-500 text-slate-300">
                          {amount.amount}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {amount.location}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">
                  No payment amounts specified
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tasks and Deliverables */}
        {agreement.terms.tasks && agreement.terms.tasks.length > 0 && (
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Tasks & Deliverables ({agreement.terms.tasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agreement.terms.tasks.map((task: Task, index: number) => (
                  <div key={index} className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-white">
                        {task.description}
                      </h4>
                      {task.due_date && (
                        <Badge variant="outline" className="border-amber-500/50 text-amber-300 text-xs">
                          Due: {task.due_date}
                        </Badge>
                      )}
                    </div>
                    
                    {task.responsible_party && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <User className="w-3 h-3" />
                        Responsible: {task.responsible_party}
                      </div>
                    )}
                    
                    {task.details && task.details.length > 0 && (
                      <div className="space-y-1">
                        {task.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="text-xs text-slate-400 flex items-start gap-2">
                            <div className="w-1 h-1 bg-slate-500 rounded-full mt-2 shrink-0"></div>
                            {detail}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {showConfetti && <Confetti width={window.innerWidth - 14} />}
      </div>

      <ValidationFailedDialog
        validationResult={validationResult}
        handleClose={() => setValidationResult([])}
      />
      <ValidationSucceededDialog
        workAccepted={workAccepted}
        handleCongratulate={handleCongratulate}
      />
    </>
  );
};