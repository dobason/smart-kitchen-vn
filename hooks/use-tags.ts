import { useQuery } from '@tanstack/react-query';
import tagServices from '@/services/tagServices';
import { queryKeys } from '@/lib/queryKeys';
import { Tag } from '@/types/tag';

// Hook to fetch all tags from GET /v1/tags/
export function useTags() {
  const query = useQuery<Tag[]>({
    queryKey: queryKeys.tag.list(),
    queryFn: () => tagServices.getAll(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    tags: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
