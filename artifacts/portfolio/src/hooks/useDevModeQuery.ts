import { useDevMode } from "@/contexts/DevModeContext";

/**
 * Hook that overrides the loading state while Dev Mode is active.
 * Use it to wrap React Query results.
 */
export function useDevModeQuery<T>(queryResult: {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}) {
  const { isDevMode } = useDevMode();

  return {
    ...queryResult,
    isLoading: isDevMode ? true : queryResult.isLoading,
  };
}
