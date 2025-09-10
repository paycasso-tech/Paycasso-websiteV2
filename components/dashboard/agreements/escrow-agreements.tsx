"use client";

import type { PostgrestError, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import type { EscrowListProps, EscrowAgreementWithDetails } from "@/types/escrow";
import { useEffect, useCallback, useState } from "react";
import { RotateCw, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEscrowAgreements } from "@/hooks/useEscrowAgreements";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { createAgreementService } from "@/services/agreement.service";
import { parseAmount } from "@/lib/utils/amount";
import EscrowAgreementsTable from "@/components/dashboard/agreements/agreements-table";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";

const supabase = createSupabaseBrowserClient();

export const EscrowAgreements = () => {
  const agreementService = createAgreementService(supabase);
  const [walletId, setWalletID] = useState<any>(null);
  const [profileId,setProfileId] = useState<any> (null);
  const [userId,setUserId] = useState<any> (null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          router.push("/sign-in");
          return;
        }
        
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("auth_user_id", currentUser.id)
          .single();

        setProfileId(profile?.id);
        setUserId(currentUser.id);
        if (profile) {
          // Get wallet data
          const { data: walletData } = await supabase
            .schema("public")
            .from("wallets")
            .select()
            .eq("profile_id", profile.id)
            .single();
            
            setWalletID(walletData?.id); 
          }
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      };
      
      fetchData();
    }, [supabase, router]);
  
  const { agreements, loading, error, refresh } = useEscrowAgreements({userId, profileId, walletId});

  // Calculate stats
  const stats = {
    total: agreements.length,
    inProgress: agreements.filter(a => ['INITIATED', 'OPEN', 'LOCKED', 'PENDING'].includes(a.status)).length,
    completed: agreements.filter(a => a.status === 'CLOSED').length,
    disputed: agreements.filter(a => a.status === 'DISPUTED').length,
  };

  const depositFunds = async (agreement: EscrowAgreementWithDetails) => {
    try {
      const response = await fetch(`${baseUrl}/api/contracts/escrow/deposit`, {
        method: "POST",
        body: JSON.stringify({
          circleContractId: agreement.circle_contract_id
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const parsedResponse = await response.json();

      if (parsedResponse.error) {
        toast.error("Failed to deposit funds into smart contract", {
          description: parsedResponse.error
        });

        return;
      }

      if (!agreement.terms.amounts?.[0].amount) {
        toast.error("The contract does not specifies an amount to be paid");
        return;
      }

      refresh();

      const amount = parseAmount(agreement.terms.amounts?.[0].amount);
      await agreementService.createTransaction({
        walletId: agreement.depositor_wallet_id,
        circleTransactionId: parsedResponse.transactionId,
        escrowAgreementId: agreement.id,
        transactionType: "DEPOSIT_PAYMENT",
        profileId: profileId,
        amount,
        description: agreement.terms.amounts?.[0]?.for || "Funds deposited by depositor",
      });
    } catch (error) {
      console.error("Deposit operation failed:", error);
      toast.error("Failed to complete deposit operation");
    }
  }

  // Runs when there are changes to "RELEASE_PAYMENT" transactions
  const updateAgreementReleaseStatus = useCallback(async (payload: RealtimePostgresUpdatePayload<Record<string, string>>) => {
    if (!userId) return;
    
    const { data: agreementUser, error: agreementUserError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (agreementUserError) {
      console.error("Could not retrieve the currently logged in user id:", agreementUserError);
      toast.error("Could not retrieve the currently logged in user id", {
        description: agreementUserError.message
      });

      return;
    }

    const isBeneficiary = agreementUser.id === payload.new.profile_id;

    if (!isBeneficiary) return;

    const fundsReleaseStatus = payload.new.status;

    console.log("Funds release status update:", fundsReleaseStatus);
    toast.info(`Funds release status update: ${fundsReleaseStatus}`);

    if (fundsReleaseStatus === "FAILED") {
      refresh();
      return;
    }

    if (fundsReleaseStatus !== "CONFIRMED") return;

    refresh();
  }, [supabase, refresh]);

  // Runs when there are changes to "DEPOSIT_APPROVAL" transactions
  const updateAgreementDepositApprovalStatus = useCallback(async (payload: RealtimePostgresUpdatePayload<Record<string, string>>) => {
    if (!userId) return;
    
    const { data: agreementUser, error: agreementUserError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (agreementUserError) {
      console.error("Could not retrieve the currently logged in user id:", agreementUserError);
      toast.error("Could not retrieve the currently logged in user id", {
        description: agreementUserError.message
      });

      return;
    }

    const isDepositAuthor = agreementUser.id === payload.new.profile_id;

    if (!isDepositAuthor) return;

    const fundsDepositStatus = payload.new.status;

    console.log("Funds deposit approval status update:", fundsDepositStatus);
    toast.info(`Funds deposit approval status update: ${fundsDepositStatus}`);

    if (fundsDepositStatus === "FAILED") {
      refresh();
      return;
    }

    if (fundsDepositStatus !== "COMPLETE") return;

    const { data: agreement, error: agreementError } = await supabase
      .from("escrow_agreements")
      .select()
      .eq("id", payload.new.escrow_agreement_id)
      .single() as { data: EscrowAgreementWithDetails, error: PostgrestError | null };

    if (agreementError) {
      console.error("Error retrieving agreement details", agreementError);
      toast.error("Error retrieving agreement details", {
        description: agreementError.message
      });

      return;
    }

    await depositFunds(agreement);
  }, [supabase]);

  // Runs when there are changes to "DEPOSIT_PAYMENT" transactions
  const updateAgreementDepositStatus = useCallback(async (payload: RealtimePostgresUpdatePayload<Record<string, string>>) => {
    if (!userId) return;
    
    const { data: agreementUser, error: agreementUserError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (agreementUserError) {
      console.error("Could not retrieve the currently logged in user id:", agreementUserError);
      toast.error("Could not retrieve the currently logged in user id", {
        description: agreementUserError.message
      });

      return;
    }

    const isDepositAuthor = agreementUser.id === payload.new.profile_id;

    if (!isDepositAuthor) return;

    const fundsDepositStatus = payload.new.status;

    console.log("Funds deposit status update:", fundsDepositStatus);
    toast.info(`Funds deposit status update: ${fundsDepositStatus}`);

    if (fundsDepositStatus === "FAILED") {
      refresh();
      return;
    }

    if (fundsDepositStatus !== "CONFIRMED") return;

    refresh();
  }, [supabase, refresh]);

  // Runs when there are changes to "DEPLOY_CONTRACT" transactions
  const updateAgreementsDeploymentStatus = useCallback(async (payload: RealtimePostgresUpdatePayload<Record<string, string>>) => {
    if (!userId) return;
    
    // Get the id of users involved in the agreement from their wallets
    const { data: agreementUsers, error: agreementUsersError } = await supabase
      .from("escrow_agreements")
      .select(`
        beneficiary_wallet_id,
        depositor_wallet_id,
        depositor_wallet:wallets!depositor_wallet_id(
          profile_id,
          wallet_address,
          profiles:profiles!wallets_profile_id_fkey (
            name,
            auth_user_id
          )
        ),
        beneficiary_wallet:wallets!beneficiary_wallet_id(
          profile_id,
          wallet_address,
          profiles:profiles!wallets_profile_id_fkey (
            name,
            auth_user_id
          )
        )
      `)
      .eq("id", payload.old.id)
      .single() as { data: EscrowAgreementWithDetails, error: PostgrestError | null };

    if (agreementUsersError) {
      console.error("Could not find an agreement linked to the given transaction", agreementUsersError);
      return;
    }

    const userIds = [
      agreementUsers.depositor_wallet?.profiles?.auth_user_id,
      agreementUsers.beneficiary_wallet?.profiles?.auth_user_id
    ]

    const isUserInvolvedInAgreement = userIds.includes(userId);

    if (!isUserInvolvedInAgreement) return;

    const smartContractDeploymentStatus = payload.new.status;

    // This means that the smart contract has just been created
    if (payload.new.circle_contract_id && smartContractDeploymentStatus === "INITIATED") {
      toast.success("Smart contract created", {
        description: "Your smart contract is being processed",
      });

      return;
    };

    if (smartContractDeploymentStatus === "INITIATED") return;

    console.log("Smart contract status update:", smartContractDeploymentStatus);
    toast.info(`Smart contract status update: ${smartContractDeploymentStatus}`);

    const shouldRefresh = ["PENDING", "OPEN"].includes(smartContractDeploymentStatus);

    if (!shouldRefresh) return

    refresh();
  }, [supabase, refresh]);

  useEffect(() => {
    const agreementDeploymentSubscription = supabase
      .channel("agreement_deployment_transactions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "escrow_agreements"
        },
        updateAgreementsDeploymentStatus
      )
      .subscribe();

    const agreementApprovalSubscription = supabase
      .channel("agreement_approval_transactions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: "transaction_type=eq.DEPOSIT_APPROVAL"
        },
        updateAgreementDepositApprovalStatus
      )
      .subscribe();

    const agreementDepositSubscription = supabase
      .channel("agreement_deposit_transactions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: "transaction_type=eq.DEPOSIT_PAYMENT"
        },
        updateAgreementDepositStatus
      )
      .subscribe();

    const agreementReleaseSubscription = supabase
      .channel("agreement_release_transactions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: "transaction_type=eq.RELEASE_PAYMENT"
        },
        updateAgreementReleaseStatus
      )
      .subscribe();

    const escrowAgreementsSubscription = supabase
      .channel("refresh_agreement_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "escrow_agreements"
        },
        () => refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(agreementDeploymentSubscription);
      supabase.removeChannel(agreementApprovalSubscription);
      supabase.removeChannel(agreementDepositSubscription);
      supabase.removeChannel(agreementReleaseSubscription);
      supabase.removeChannel(escrowAgreementsSubscription);
    }
  }, [supabase, updateAgreementsDeploymentStatus, refresh, userId]);

  // Show loading state when profileId is not yet available
  if (!profileId) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-48 h-7 bg-slate-700/60 rounded-lg" />
            <Skeleton className="w-8 h-8 bg-slate-700/60 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-700/40 rounded-lg p-4">
                <Skeleton className="w-8 h-8 bg-slate-600/60 rounded-lg mx-auto mb-2" />
                <Skeleton className="w-16 h-4 bg-slate-600/60 rounded mx-auto" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-16 bg-slate-700/40 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Escrow Agreements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={refresh} 
            className="mt-4 border-slate-600 hover:bg-slate-700"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            Escrow Agreements
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refresh}
            className="hover:bg-slate-700/60 text-slate-400 hover:text-white"
            disabled={loading}
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            {loading ? (
              <Skeleton className="w-8 h-6 bg-slate-600/60 rounded mx-auto mb-1" />
            ) : (
              <div className="text-xl font-bold text-white mb-1">{stats.total}</div>
            )}
            <div className="text-xs text-slate-400">Total</div>
          </div>
          
          <div className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-amber-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            {loading ? (
              <Skeleton className="w-8 h-6 bg-slate-600/60 rounded mx-auto mb-1" />
            ) : (
              <div className="text-xl font-bold text-amber-400 mb-1">{stats.inProgress}</div>
            )}
            <div className="text-xs text-slate-400">In Progress</div>
          </div>
          
          <div className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-emerald-500/20 rounded-lg">
              <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
            </div>
            {loading ? (
              <Skeleton className="w-8 h-6 bg-slate-600/60 rounded mx-auto mb-1" />
            ) : (
              <div className="text-xl font-bold text-emerald-400 mb-1">{stats.completed}</div>
            )}
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          
          <div className="bg-slate-700/40 border border-slate-600/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            {loading ? (
              <Skeleton className="w-8 h-6 bg-slate-600/60 rounded mx-auto mb-1" />
            ) : (
              <div className="text-xl font-bold text-red-400 mb-1">{stats.disputed}</div>
            )}
            <div className="text-xs text-slate-400">Disputed</div>
          </div>
        </div>

        {/* Agreements Table */}
        {agreements.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/40 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg mb-2">No agreements found</p>
            <p className="text-slate-500 text-sm">Create your first escrow agreement to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            <EscrowAgreementsTable
              agreements={agreements}
              profileId={profileId}
              userId={userId}
              refresh={refresh}
              loading={loading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};