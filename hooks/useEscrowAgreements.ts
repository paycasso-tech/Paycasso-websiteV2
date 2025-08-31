import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

import { createEscrowService } from "@/services/escrow.service";
import { EscrowAgreementWithDetails, EscrowListProps } from "@/types/escrow";
import { createClient } from "@/lib/utils/supabase/client";

export const useEscrowAgreements = ({ profileId }: EscrowListProps) => {
  const [agreements, setAgreements] = useState<EscrowAgreementWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);
  const escrowService = useMemo(
    () => createEscrowService(supabase),
    [supabase]
  );

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadAgreements = useCallback(async () => {
    // Don't proceed if profileId is not available
    if (!profileId) {
      setLoading(false);
      return;
    }

    let retries = 0;
    try {
      setLoading(true);
      while (retries < MAX_RETRIES) {
        try {
          const data = await escrowService.getAgreements(profileId);
          setAgreements(data);
          setError(null);
          break;
        } catch (err) {
          if (retries === MAX_RETRIES - 1) throw err;
          retries++;
          await sleep(RETRY_DELAY * retries);
        }
      }
    } catch (err) {
      console.error("Error loading agreements:", err);
      if (err instanceof TypeError) {
        setError("Network error. Please check your connection.");
      } else if (err instanceof Response) {
        setError(`Server error: ${err.statusText}`);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to load agreements"
        );
      }
      toast.error("Error loading agreements");
    } finally {
      setLoading(false);
    }
  }, [escrowService, profileId]);

  useEffect(() => {
    // Only load agreements when profileId is available
    if (profileId) {
      loadAgreements();
    } else {
      // Reset state when profileId is not available
      setAgreements([]);
      setError(null);
      setLoading(false);
    }
  }, [profileId, loadAgreements]);

  return {
    agreements,
    loading,
    error,
    refresh: loadAgreements,
  };
};
