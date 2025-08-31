"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Check, ChevronsUpDown, Users, FileText, Wallet, AlertCircle, User, Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadContractButton } from "@/components/dashboard/agreements/createAgreement/upload-contract-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Wallet {
  id: string;
  wallet_address: string;
  profile_id: string;
}

interface Profile {
  id: string;
  name: string;
  auth_user_id: string;
  email: string;
  wallets: Wallet[];
}

interface DocumentAnalysis {
  amounts: Array<{
    full_amount: string;
    payment_for: string;
    location: string;
  }>;
  tasks: Array<{
    task_description: string;
    due_date: string | null;
    responsible_party: string;
    additional_details: string;
  }>;
}

interface EscrowAgreement {
  id: string;
  beneficiary_wallet_id: string;
  depositor_wallet_id: string;
  transaction_id: string;
  status: string;
  terms: any;
  created_at: string;
  updated_at: string;
}

interface CreateAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAgreementModal = ({ isOpen, onClose }: CreateAgreementModalProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Profile[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Profile | null>(null);
  const [formError, setFormError] = useState("Please select a recipient before uploading a contract");
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Not authenticated");

        setUserId(user.id);

        // Get current user's profile with wallet
        const { data: currentProfile, error: profileError } = await supabase
          .from("profiles")
          .select(
            `
            id,
            name,
            auth_user_id,
            email,
            wallets (
              id,
              wallet_address,
              profile_id
            )
          `
          )
          .eq("auth_user_id", user.id)
          .single();

        if (profileError) throw profileError;
        setCurrentUserProfile(currentProfile);

        // Get all other profiles with their wallets
        const { data: beneficiaryProfiles, error: beneficiariesError } =
          await supabase
            .from("profiles")
            .select(
              `
            id,
            name,
            auth_user_id,
            email,
            wallets (
              id,
              wallet_address,
              profile_id
            )
          `
            )
            .neq("auth_user_id", user.id);

        if (beneficiariesError) throw beneficiariesError;

        if (!beneficiaryProfiles) {
          throw new Error("No beneficiary profiles found.");
        }

        // Filter out profiles without wallets
        const validBeneficiaries = beneficiaryProfiles.filter(
          (profile) => profile.wallets && profile.wallets.length > 0
        );
        setBeneficiaries(validBeneficiaries);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load profiles"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  const handleBeneficiarySelect = (beneficiaryName: string) => {
    const beneficiary = beneficiaries.find((b) => b.name === beneficiaryName);
    setSelectedBeneficiary(beneficiary || null);
    setFormError(
      beneficiary
        ? ""
        : "Please select a recipient before uploading a contract"
    );
    setOpen(false);
  };

  const handleAnalysisComplete = (
    analysis: DocumentAnalysis,
    agreement: EscrowAgreement
  ) => {
    console.log("Document analysis completed:", analysis);
    console.log("Agreement created:", agreement);
    onClose(); // Close modal after successful creation
  };

  const handleClose = () => {
    setSelectedBeneficiary(null);
    setFormError("Please select a recipient before uploading a contract");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {error ? (
          <Card className="shadow-xl border-0 ring-1 ring-gray-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Error Loading Data</h3>
                  <p className="text-sm text-gray-500">
                    There was an error loading profiles. Please try again later.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleClose} 
                    variant="ghost"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !loading && !currentUserProfile?.wallets?.[0] ? (
          <Card className="shadow-xl border-0 ring-1 ring-gray-200 bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Wallet className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Wallet Required</h3>
                  <p className="text-sm text-gray-500">
                    You need to connect a wallet before creating agreements.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm">
                    Connect Wallet
                  </Button>
                  <Button 
                    onClick={handleClose} 
                    variant="ghost"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 ring-1 ring-gray-200 bg-white">
            {/* Close Button */}
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Create New Agreement</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Select a recipient and upload your contract to create an escrow agreement
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current User Info */}
              {!loading && currentUserProfile && (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">You (Depositor)</p>
                      <p className="text-xs text-gray-500">{currentUserProfile.name}</p>
                      <p className="text-xs text-gray-400">{currentUserProfile.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Wallet className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </div>
              )}

              {/* Recipient Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Skeleton className="w-[76px] h-[14px] rounded-full" />
                  ) : (
                    <Label className="text-sm font-medium text-gray-900">
                      Select Recipient
                    </Label>
                  )}
                  {selectedBeneficiary && (
                    <Badge variant="outline" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
                
                {loading ? (
                  <Skeleton className="w-full h-[56px] rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between h-14 px-4",
                            selectedBeneficiary 
                              ? "border-green-200 bg-green-50" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "rounded-full p-2",
                              selectedBeneficiary 
                                ? "bg-green-100" 
                                : "bg-gray-100"
                            )}>
                              <User className={cn(
                                "h-4 w-4",
                                selectedBeneficiary 
                                  ? "text-green-600" 
                                  : "text-gray-500"
                              )} />
                            </div>
                            <div className="text-left">
                              {selectedBeneficiary ? (
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {selectedBeneficiary.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {selectedBeneficiary.email}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-500">Choose a recipient...</p>
                              )}
                            </div>
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput
                            className="border-0"
                            placeholder="Search recipients..."
                          />
                          <CommandList>
                            {beneficiaries.length > 0 ? (
                              <CommandGroup>
                                {beneficiaries.map((beneficiary) => (
                                  <CommandItem
                                    key={beneficiary.id}
                                    value={beneficiary.name}
                                    onSelect={handleBeneficiarySelect}
                                    className="cursor-pointer py-3"
                                  >
                                    <div className="flex items-center space-x-3 flex-1">
                                      <div className="rounded-full bg-gray-100 p-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                          {beneficiary.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {beneficiary.email}
                                        </p>
                                      </div>
                                      <Check
                                        className={cn(
                                          "h-4 w-4",
                                          selectedBeneficiary?.id === beneficiary.id
                                            ? "opacity-100 text-green-600"
                                            : "opacity-0"
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ) : (
                              <CommandEmpty className="py-6 text-center">
                                <div className="space-y-2">
                                  <Users className="h-8 w-8 text-gray-400 mx-auto" />
                                  <p className="text-sm text-gray-500">No recipients found</p>
                                </div>
                              </CommandEmpty>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {formError && (
                      <div className="flex items-center space-x-2 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{formError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-6">
              {loading ? (
                <Skeleton className="w-full h-[48px] rounded-lg" />
              ) : (
                <div className="w-full">
                  <UploadContractButton
                    beneficiaryWalletId={selectedBeneficiary?.wallets[0]?.id}
                    depositorWalletId={currentUserProfile?.wallets[0].id}
                    userId={userId!}
                    userProfileId={currentUserProfile?.id}
                    onAnalysisComplete={handleAnalysisComplete}
                  />
                  
                  {selectedBeneficiary && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="text-xs text-blue-700">
                          <p className="font-medium">Ready to upload</p>
                          <p>Your contract will be analyzed and an escrow agreement created with {selectedBeneficiary.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

// New Escrow Button Component
export const NewEscrowButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 font-medium text-white transition-colors" 
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-4 h-4" />
        <span>New Escrow</span>
      </button>
      
      <CreateAgreementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default CreateAgreementModal;