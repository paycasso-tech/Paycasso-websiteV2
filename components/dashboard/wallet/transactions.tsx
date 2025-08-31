"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WalletTransactionsResponse } from "@/app/(main)/api/wallet/transactions/route";
import type { Wallet } from "@/types/database.types";
import { useEffect, useMemo, useState, type FunctionComponent } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Skeleton } from "@/components/ui/skeleton";
import { json } from "zod";

interface Transaction {
  id: string;
  status: string;
  created_at: string;
  circle_transaction_id: string;
  transaction_type: string;
  amount: string;
}

interface CircleTransaction {
  id: string;
  transactionType: string;
  amount: string[];
  status: string;
  description?: string;
  circle_contract_address?: string;
}

interface Props {
  wallet: Wallet;
  profile: {
    id: any;
  } | null;
}

const ITEMS_PER_PAGE = 5;

async function syncTransactions(
  supabase: SupabaseClient,
  walletId: string,
  profileId: string,
  circleWalletId: string
) {
  // 1. Fetch transactions from Circle API
  console.log(JSON.stringify({circleWalletId}));
  const transactionsResponse = await fetch(
    `${baseUrl}/api/wallet/transactions`,
    {
      method: "POST",
      body: JSON.stringify({
        walletId: circleWalletId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const parsedTransactions: WalletTransactionsResponse =
    await transactionsResponse.json();

  if (parsedTransactions.error || !parsedTransactions.transactions) {
    return [];
  }

  // 2. Get existing transactions from database
  const { data: existingTransactions } = await supabase
    .from("transactions")
    .select("circle_transaction_id")
    .eq("wallet_id", walletId);

  const existingTransactionIds = new Set(
    existingTransactions?.map((t: any) => t.circle_transaction_id) || []
  );

  // 3. Filter out transactions that already exist
  const newTransactions = parsedTransactions.transactions.filter(
    (transaction: any) => !existingTransactionIds.has(transaction.id)
  );

  // 4. Insert new transactions into the database
  if (newTransactions.length > 0) {
    const transactionsToInsert = newTransactions.map(
      (transaction: CircleTransaction) => {
        if (
          !transaction.id ||
          !transaction.transactionType ||
          !transaction.amount
        ) {
          throw new Error(
            `Invalid transaction structure: ${JSON.stringify(transaction)}`
          );
        }

        return {
          wallet_id: walletId,
          profile_id: profileId,
          circle_transaction_id: transaction.id,
          transaction_type: transaction.transactionType,
          amount: parseFloat(transaction.amount[0]?.replace(/[$,]/g, "")) || 0,
          currency: "USDC",
          status: transaction.status,
        };
      }
    );

    const { error } = await supabase
      .from("transactions")
      .insert(transactionsToInsert);

    if (error) {
      console.error("Error inserting transactions:", error);
    }
  }

  // 5. Return all transactions from database
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false });

  // Filter out duplicates keeping only the latest transaction for each circle_transaction_id
  const uniqueTransactions =
    allTransactions?.reduce((acc, current) => {
      const existingTransaction = acc.find(
        (item: { circle_transaction_id: any }) =>
          item.circle_transaction_id === current.circle_transaction_id
      );
      if (!existingTransaction) {
        acc.push(current);
      }
      return acc;
    }, []) || [];

  return uniqueTransactions;
}

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";

const supabase = createSupabaseBrowserClient();

// Helper functions for status styling
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'success':
      return 'text-green-500';
    case 'pending':
      return 'text-yellow-500';
    case 'failed':
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'success':
      return '●';
    case 'pending':
      return '●';
    case 'failed':
    case 'error':
      return '●';
    default:
      return '●';
  }
};

export const Transactions = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  const router = useRouter();

  // First useEffect: Fetch user, profile, and wallet data
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

        setProfile(profile);
        
        if (profile) {
          // Get wallet data
          const { data: walletData } = await supabase
            .schema("public")
            .from("wallets")
            .select()
            .eq("profile_id", profile.id)
            .single();

          setWallet(walletData); 
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  const formattedData = useMemo(
    () =>
      data.map((transaction) => ({
        ...transaction,
        created_at: new Date(transaction.created_at).toLocaleString(),
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(transaction.amount)),
      })),
    [data]
  );

  // Calculate pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = formattedData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const updateTransactions = async () => {
    // Guard clause: Only proceed if we have all required data
    if (!wallet?.id || !profile?.id || !wallet?.circle_wallet_id) {
      console.log("Missing required data:", { 
        walletId: wallet?.id, 
        profileId: profile?.id, 
        circleWalletId: wallet?.circle_wallet_id 
      });
      return;
    }

    try {
      setLoading(true);

      // Sync and get transactions
      const transactions = await syncTransactions(
        supabase,
        wallet.id, 
        profile.id,
        wallet.circle_wallet_id
      );

      setData(transactions);
      setDataInitialized(true);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Second useEffect: Set up subscription and fetch transactions only when wallet and profile are ready
  useEffect(() => {
    // Don't proceed if we don't have the required data
    if (!wallet?.id || !profile?.id || !wallet?.circle_wallet_id) {
      return;
    }

    const transactionSubscription = supabase
      .channel("transactions")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `profile_id=eq.${profile.id}`,
        },
        () => updateTransactions()
      )
      .subscribe();

    // Only call updateTransactions if we haven't initialized data yet
    if (!dataInitialized) {
      updateTransactions();
    }

    return () => {
      supabase.removeChannel(transactionSubscription);
    };
  }, [wallet?.id, profile?.id, wallet?.circle_wallet_id, dataInitialized]);

  // Show loading state while fetching initial data or if we don't have required props
  if (loading || !wallet?.circle_wallet_id || !profile?.id) {
    return <Skeleton className="w-[206px] h-[28px] rounded-full" />;
  }

  if (data && data.length < 1) {
    return (
      <p className="text-xl text-muted-foreground cursor-pointer">
        No transactions found
      </p>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg mb-4">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-gray-400 text-sm font-medium">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-gray-400 text-sm font-medium">
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-gray-400 text-sm font-medium">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-gray-400 text-sm font-medium">
                  Type
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((transaction) => (
                <tr
                  onClick={() =>
                    router.push(
                      `/dashboard/transaction/${transaction.circle_transaction_id}`
                    )
                  }
                  className="border-b border-gray-700 hover:bg-gray-750 cursor-pointer"
                  key={transaction.id}
                >
                  <td className="py-4 px-6 text-sm">{transaction.created_at}</td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {transaction.transaction_type === "INBOUND" && (
                      <span className="text-green-600">+{transaction.amount}</span>
                    )}
                    {transaction.transaction_type === "DEPOSIT_PAYMENT" && (
                      <span className="text-red-600">-{transaction.amount}</span>
                    )}
                    {transaction.transaction_type !== "DEPOSIT_PAYMENT" &&
                      transaction.transaction_type !== "INBOUND" && (
                        <span>{transaction.amount}</span>
                      )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`${getStatusColor(
                          transaction.status
                        )} text-xs`}
                      >
                        {getStatusIcon(transaction.status)}
                      </span>
                      <span
                        className={`text-sm ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-300">
                    {transaction.transaction_type}
                  </td>
                  <td className="py-4 px-6">
                    <button className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700">
                      <span className="text-xs text-gray-400">i</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* First page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                  }}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis for skipped pages */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Previous page (if applicable) */}
            {currentPage > 1 && currentPage <= totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                  isActive={false}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Current page */}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(currentPage);
                }}
                isActive={true}
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {/* Next page (if applicable) */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                  isActive={false}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis for skipped pages */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages);
                  }}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};