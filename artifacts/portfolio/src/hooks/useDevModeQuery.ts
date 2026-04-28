import { useDevMode } from "@/contexts/DevModeContext";

/**
 * Hook que sobrescreve o estado de loading quando Dev Mode está ativo
 * Use este hook para envolver os resultados de queries do React Query
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
