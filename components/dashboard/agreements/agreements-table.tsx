import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EscrowAgreementItem } from "./escrow-agreements-item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EscrowAgreementWithDetails } from "@/types/escrow";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { ChevronDown, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 5;

interface EscrowAgreementsTableProps {
  agreements: EscrowAgreementWithDetails[];
  loading?: boolean;
  error?: string | null;
  profileId: string;
  userId: string;
  refresh: () => void;
}

interface TabData {
  value: string;
  label: string;
  statuses: string[];
  count: number;
}

const supabase = createSupabaseBrowserClient();

const getStatusBadge = (status: string) => {
  const statusConfig = {
    INITIATED: { variant: "secondary", className: "bg-slate-600/50 text-slate-300 border-slate-500" },
    OPEN: { variant: "secondary", className: "bg-blue-600/20 text-blue-300 border-blue-500/30" },
    LOCKED: { variant: "secondary", className: "bg-amber-600/20 text-amber-300 border-amber-500/30" },
    PENDING: { variant: "secondary", className: "bg-purple-600/20 text-purple-300 border-purple-500/30" },
    CLOSED: { variant: "secondary", className: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30" },
    DISPUTED: { variant: "destructive", className: "bg-red-600/20 text-red-300 border-red-500/30" },
  };

  const config = statusConfig[status]  || statusConfig.INITIATED;
  
  return (
    <Badge 
      variant={config.variant as any} 
      className={`${config.className} font-medium px-2.5 py-1 text-xs`}
    >
      {status}
    </Badge>
  );
};

export const EscrowAgreementsTable = (props: EscrowAgreementsTableProps) => {
  const { agreements, loading, error, refresh } = props;
  const [activeTab, setActiveTab] = useState("inProgress");
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [depositing, setDepositing] = useState<string | undefined>(undefined);
  const [hasOpenedAgreement, setHasOpenedAgreement] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate tab data with counts
  const tabs: TabData[] = [
    {
      value: "inProgress",
      label: "In Progress",
      statuses: ["INITIATED", "OPEN", "LOCKED", "PENDING"],
      count: agreements.filter(a => ["INITIATED", "OPEN", "LOCKED", "PENDING"].includes(a.status)).length,
    },
    {
      value: "closed",
      label: "Completed",
      statuses: ["CLOSED"],
      count: agreements.filter(a => a.status === "CLOSED").length,
    },
    {
      value: "disputed",
      label: "Disputed", 
      statuses: ["DISPUTED"],
      count: agreements.filter(a => a.status === "DISPUTED").length,
    },
  ];

  const filteredAgreements = agreements.filter((agreement: EscrowAgreementWithDetails) => {
    const currentTabData = tabs.find((tab) => tab.value === activeTab);
    const matchesStatus = currentTabData?.statuses.includes(agreement.status) || false;
    
    if (!searchQuery) return matchesStatus;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      agreement.depositor_wallet.profiles.name?.toLowerCase().includes(searchLower) ||
      agreement.beneficiary_wallet?.profiles?.name?.toLowerCase().includes(searchLower) ||
      agreement.terms?.tasks?.[0]?.description?.toLowerCase().includes(searchLower) ||
      agreement.terms?.amounts?.[0]?.amount?.toLowerCase().includes(searchLower);
    
    return matchesStatus && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAgreements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAgreements = filteredAgreements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleRowClick = (agreement: EscrowAgreementWithDetails) => {
    setSelectedAgreementId(selectedAgreementId === agreement.id ? null : agreement.id);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSelectedAgreementId(null);
    setSearchQuery("");
  };

  useEffect(() => {
    const agreementsSubscription = supabase
      .channel("agreements")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "escrow_agreements"
        },
        async payload => {
          setSelectedAgreementId(payload.new.id)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(agreementsSubscription)
    }
  }, []);

  useEffect(() => {
    const shouldOpenCreatedAgreement = agreements.length !== 1 || selectedAgreementId !== null || hasOpenedAgreement;

    if (shouldOpenCreatedAgreement) return;

    setSelectedAgreementId(agreements[0].id);
    setHasOpenedAgreement(true);
  }, [agreements]);

  if (error) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 text-center">
        <div className="text-red-400 mb-2">Error loading agreements</div>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={refresh} 
          className="border-slate-600 hover:bg-slate-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Enhanced Tab List with Counts */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-slate-800/60 border border-slate-700/50">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 relative"
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-slate-600/50 text-slate-300 text-xs h-5 w-auto min-w-[1.25rem] px-1.5"
                  >
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search agreements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/60 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
            />
          </div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 bg-slate-700/60 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="w-32 h-4 bg-slate-700/60 rounded" />
                          <Skeleton className="w-24 h-3 bg-slate-700/60 rounded" />
                        </div>
                      </div>
                      <Skeleton className="w-20 h-6 bg-slate-700/60 rounded-full" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="w-full h-4 bg-slate-700/60 rounded" />
                      <Skeleton className="w-full h-4 bg-slate-700/60 rounded" />
                      <Skeleton className="w-full h-4 bg-slate-700/60 rounded" />
                      <Skeleton className="w-full h-4 bg-slate-700/60 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedAgreements.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/40 rounded-full flex items-center justify-center">
                  {searchQuery ? (
                    <Search className="w-8 h-8 text-slate-500" />
                  ) : (
                    <Filter className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <p className="text-slate-400 text-lg mb-2">
                  {searchQuery ? "No matching agreements found" : `No ${tab.label.toLowerCase()} agreements`}
                </p>
                <p className="text-slate-500 text-sm">
                  {searchQuery ? "Try adjusting your search terms" : `Create an agreement to see it here`}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 border-slate-600 hover:bg-slate-700"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Enhanced Table */}
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/30 hover:bg-slate-800/40">
                        <TableHead className="text-slate-300 font-medium">Parties</TableHead>
                        <TableHead className="text-slate-300 font-medium">Status</TableHead>
                        <TableHead className="text-slate-300 font-medium">Amount</TableHead>
                        <TableHead className="text-slate-300 font-medium">Deliverables</TableHead>
                        <TableHead className="text-slate-300 font-medium">Created</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAgreements.map((agreement) => (
                        <React.Fragment key={agreement.id}>
                          <TableRow
                            className="border-slate-700/30 hover:bg-slate-800/40 cursor-pointer transition-colors duration-200"
                            onClick={() => handleRowClick(agreement)}
                          >
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  </div>
                                  {agreement.depositor_wallet.profiles.name ?? "Unknown"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                  </div>
                                  {agreement.beneficiary_wallet?.profiles?.name ?? agreement.beneficiary_wallet.profiles.email ?? "Unknown"}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              {getStatusBadge(agreement.status)}
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="text-sm font-medium text-white">
                                {agreement.terms?.amounts?.[0]?.amount ?? "N/A"}
                              </div>
                            </TableCell>

                            <TableCell className="py-4 max-w-md">
                              <div className="text-sm text-slate-300 truncate">
                                {agreement.terms?.tasks?.[0]?.description ?? "N/A"}
                              </div>
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="text-sm text-slate-400">
                                {new Date(agreement.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(agreement.created_at).toLocaleTimeString()}
                              </div>
                            </TableCell>

                            <TableCell className="py-4 text-right">
                              {selectedAgreementId === agreement.id ? (
                                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                              )}
                            </TableCell>
                          </TableRow>

                          {selectedAgreementId === agreement.id && (
                            <TableRow className="border-slate-700/30">
                              <TableCell colSpan={6} className="py-0">
                                <div className="bg-slate-800/60 border-t border-slate-700/30 p-6 rounded-b-lg">
                                  <EscrowAgreementItem
                                    agreement={agreement}
                                    profileId={props.profileId}
                                    userId={props.userId}
                                    depositing={depositing}
                                    refresh={async () => refresh()}
                                    preApproveCallback={() => setDepositing(agreement.id)}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-slate-400">
                      Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredAgreements.length)} of {filteredAgreements.length} agreements
                    </div>
                    
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage((prev) => Math.max(1, prev - 1));
                            }}
                            className={`${
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-slate-700"
                            } border-slate-600`}
                          />
                        </PaginationItem>

                        {/* Smart pagination logic */}
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                          
                          if (!showPage) {
                            if (page === currentPage - 2 || page === currentPage + 2) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationEllipsis className="text-slate-400" />
                                </PaginationItem>
                              );
                            }
                            return null;
                          }

                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }}
                                isActive={currentPage === page}
                                className={`${
                                  currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "hover:bg-slate-700 border-slate-600"
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                            }}
                            className={`${
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-slate-700"
                            } border-slate-600`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EscrowAgreementsTable;