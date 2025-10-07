"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Check, ChevronsUpDown, Users, FileText, Wallet, AlertCircle, User, Plus, X, ArrowRight, Shield, ArrowUpRight, Zap, Lock, Globe } from "lucide-react";
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
        setError(null); // Reset error state

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

        // Handle case where beneficiaryProfiles might be null or empty
        const validBeneficiaries = beneficiaryProfiles 
          ? beneficiaryProfiles.filter(
              (profile) => profile.wallets && profile.wallets.length > 0
            )
          : [];
          
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
  }, [isOpen, supabase]);

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

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Full Screen Overlay with Enhanced Blur */}
      <div 
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-xl transition-all duration-500 animate-in fade-in-0"
        onClick={handleClose}
      />
      
      {/* Full Screen Modal Container */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 sm:p-4 animate-in zoom-in-95 fade-in-0 duration-500">
        
        {/* Modal Content - Full Screen with Professional Design */}
        <div className="relative w-full h-full sm:h-[95vh] sm:max-w-6xl bg-white sm:rounded-3xl overflow-hidden shadow-2xl sm:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border-0 sm:border border-gray-200/50">
          
          {/* Professional Header with Gradient & Animation */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2F%3E%3C%2F%3E%3C%2Fsvg%3E')]"></div>
            
            {/* Close Button - Enhanced */}
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 z-20 group w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110 hover:rotate-90 flex items-center justify-center"
            >
              <X className="h-5 w-5 text-white group-hover:text-white transition-colors" />
            </button>

            {/* Header Content */}
            <div className="relative px-8 py-12 sm:px-12 sm:py-16">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
                  
                  {/* Icon Container */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
                        <Shield className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-3">
                      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
                        Create Escrow Agreement
                      </h1>
                      <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl leading-relaxed">
                        Secure your transactions with blockchain-powered escrow protection and AI-driven contract analysis
                      </p>
                    </div>
                    
                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <Lock className="h-4 w-4 text-blue-200" />
                        <span className="text-sm font-medium text-blue-100">Blockchain Secured</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <Zap className="h-4 w-4 text-purple-200" />
                        <span className="text-sm font-medium text-purple-100">AI Powered</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <Globe className="h-4 w-4 text-green-200" />
                        <span className="text-sm font-medium text-green-100">Global Access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area with Professional Styling */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">

            {/* Error State - Enhanced */}
            {error ? (
              <div className="p-8 sm:p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center space-y-8 bg-white rounded-3xl p-12 shadow-xl border border-red-100">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">Unable to Load Data</h3>
                      <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                        We encountered an issue while loading your profile information. This could be a temporary network issue or connectivity problem.
                      </p>
                      <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                        Error: {error}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                      <Button
                        onClick={handleClose}
                        variant="outline"
                        className="px-8 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : !loading && (!currentUserProfile?.wallets || currentUserProfile.wallets.length === 0) ? (
              /* No Wallet State - Enhanced */
              <div className="p-8 sm:p-12">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center space-y-8 bg-white rounded-3xl p-12 shadow-xl border border-amber-100">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Wallet className="h-12 w-12 text-amber-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">Wallet Required</h3>
                      <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                        To create escrow agreements, you need to connect a cryptocurrency wallet first. This ensures secure blockchain transactions.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </Button>
                      <Button
                        onClick={handleClose}
                        variant="outline"
                        className="px-8 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Main Content - Enhanced Professional Design */
              <div className="p-8 sm:p-12 space-y-10">
                <div className="max-w-5xl mx-auto space-y-10">

                  {/* Enhanced Progress Steps */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 backdrop-blur-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                            1
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <span className="text-base font-semibold text-blue-700">Select Recipient</span>
                      </div>
                      <div className="w-16 h-px bg-gradient-to-r from-blue-300 to-gray-300"></div>
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300",
                          selectedBeneficiary
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : "bg-gray-200 text-gray-500"
                        )}>
                          2
                        </div>
                        <span className={cn(
                          "text-base font-semibold transition-colors",
                          selectedBeneficiary ? "text-blue-700" : "text-gray-500"
                        )}>
                          Upload Contract
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current User Section - Enhanced */}
                  {!loading && currentUserProfile && (
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 rounded-3xl p-8 border border-emerald-200/50 shadow-xl backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-6 sm:space-y-0">
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg">
                              <User className="h-8 w-8 text-emerald-700" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold text-gray-900">You (Depositor)</h3>
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 px-3 py-1 font-semibold">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified Account
                              </Badge>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">{currentUserProfile.name}</p>
                            <p className="text-gray-600">{currentUserProfile.email}</p>
                          </div>
                        </div>
                        <div className="text-right bg-white/50 rounded-2xl p-4 border border-white/50">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1 font-semibold mb-2">
                            <Wallet className="h-3 w-3 mr-1" />
                            Wallet Connected
                          </Badge>
                          <p className="text-sm text-gray-600 font-mono">
                            {currentUserProfile.wallets?.[0]?.wallet_address?.slice(0, 8)}...{currentUserProfile.wallets?.[0]?.wallet_address?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipient Selection Section - Enhanced */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200/50">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        {loading ? (
                          <Skeleton className="w-48 h-8 rounded-xl" />
                        ) : (
                          <div className="flex items-center space-x-4">
                            <h2 className="text-2xl font-bold text-gray-900">Select Recipient</h2>
                            {selectedBeneficiary && (
                              <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 font-semibold animate-pulse">
                                <Check className="h-3 w-3 mr-1" />
                                Selected
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {loading ? (
                        <Skeleton className="w-full h-24 rounded-2xl" />
                      ) : (
                        <div className="space-y-4">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                  "w-full justify-between h-auto p-8 text-left hover:shadow-lg transition-all duration-300 rounded-2xl border-2 group",
                                  selectedBeneficiary
                                    ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                                )}
                              >
                                <div className="flex items-center space-x-6 flex-1">
                                  <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                                    selectedBeneficiary
                                      ? "bg-gradient-to-br from-green-100 to-green-200"
                                      : "bg-gradient-to-br from-gray-100 to-gray-200"
                                  )}>
                                    <User className={cn(
                                      "h-8 w-8",
                                      selectedBeneficiary
                                        ? "text-green-700"
                                        : "text-gray-500"
                                    )} />
                                  </div>
                                  <div className="flex-1">
                                    {selectedBeneficiary ? (
                                      <div className="space-y-2">
                                        <p className="font-bold text-gray-900 text-lg">
                                          {selectedBeneficiary.name}
                                        </p>
                                        <p className="text-gray-600 font-medium">
                                          {selectedBeneficiary.email}
                                        </p>
                                        <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                          {selectedBeneficiary.wallets[0]?.wallet_address?.slice(0, 12)}...{selectedBeneficiary.wallets[0]?.wallet_address?.slice(-8)}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        <p className="text-gray-600 font-semibold text-lg">Choose a recipient...</p>
                                        <p className="text-gray-500">Select who will receive the escrowed funds</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ChevronsUpDown className="ml-6 h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-2 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
                              <Command>
                                <CommandInput
                                  className="border-0 text-base h-14 px-6"
                                  placeholder="Search recipients by name or email..."
                                />
                                <CommandList className="max-h-96">
                                  {beneficiaries.length > 0 ? (
                                    <CommandGroup className="p-3">
                                      {beneficiaries.map((beneficiary) => (
                                        <CommandItem
                                          key={beneficiary.id}
                                          value={beneficiary.name}
                                          onSelect={handleBeneficiarySelect}
                                          className="cursor-pointer p-6 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                                        >
                                          <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                                              <User className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                              <p className="font-semibold text-gray-900 text-base">
                                                {beneficiary.name}
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {beneficiary.email}
                                              </p>
                                              <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                                {beneficiary.wallets[0]?.wallet_address?.slice(0, 10)}...{beneficiary.wallets[0]?.wallet_address?.slice(-6)}
                                              </p>
                                            </div>
                                            <Check
                                              className={cn(
                                                "h-6 w-6 transition-all",
                                                selectedBeneficiary?.id === beneficiary.id
                                                  ? "opacity-100 text-green-600 scale-110"
                                                  : "opacity-0 scale-0"
                                              )}
                                            />
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  ) : (
                                    <CommandEmpty className="py-16 text-center">
                                      <div className="space-y-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                          <Users className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 text-lg">No recipients found</p>
                                          <p className="text-gray-500">No users with connected wallets available</p>
                                        </div>
                                      </div>
                                    </CommandEmpty>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {formError && (
                            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg">
                              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                              </div>
                              <p className="text-amber-800 font-semibold flex-1">{formError}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Section - Enhanced */}
                  {loading ? (
                    <div className="bg-white rounded-3xl p-8 shadow-xl space-y-6">
                      <Skeleton className="w-48 h-8 rounded-xl" />
                      <Skeleton className="w-full h-32 rounded-2xl" />
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200/50">
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                          <FileText className="h-7 w-7 text-blue-600" />
                          <span>Upload Contract</span>
                        </h2>

                        <div className="space-y-6">
                          {currentUserProfile && selectedBeneficiary && userId ? (
                            <UploadContractButton
                              beneficiaryWalletId={selectedBeneficiary.wallets[0]?.id}
                              depositorWalletId={currentUserProfile.wallets[0]?.id}
                              userId={userId}
                              userProfileId={currentUserProfile.id}
                              onAnalysisComplete={handleAnalysisComplete}
                            />
                          ) : (
                            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
                              <p className="text-gray-600 text-center">
                                Please select a recipient first to enable contract upload.
                              </p>
                            </div>
                          )}

                          {selectedBeneficiary && (
                            <div className="relative overflow-hidden p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200/50 shadow-lg">
                              
                              <div className="relative flex items-start space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FileText className="h-8 w-8 text-blue-700" />
                                  </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <h4 className="text-xl font-bold text-blue-900 mb-2">Ready to Process</h4>
                                    <p className="text-blue-800 leading-relaxed">
                                      Your contract will be analyzed using advanced AI technology and a secure escrow agreement will be created with{" "}
                                      <span className="font-bold bg-blue-200 px-2 py-1 rounded">{selectedBeneficiary.name}</span>
                                    </p>
                                  </div>
                                  
                                  {/* Feature Grid */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                    <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-200/50">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-blue-900">Blockchain</p>
                                        <p className="text-xs text-blue-700">Secured</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-200/50">
                                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-purple-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-purple-900">AI</p>
                                        <p className="text-xs text-purple-700">Analysis</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-green-200/50">
                                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Lock className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-green-900">Escrow</p>
                                        <p className="text-xs text-green-700">Protected</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced New Escrow Button Component with Professional Styling
export const NewEscrowButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/30 border border-blue-500/30" 
        onClick={() => setIsModalOpen(true)}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        {/* Button content */}
        <div className="relative flex items-center justify-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg">Create New Escrow</span>
          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
      </button>

      <CreateAgreementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreateAgreementModal;