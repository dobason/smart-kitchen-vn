// File: hooks/use-cookbook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cookbookApi from '@/services/cookbookServices';
import { queryKeys } from '@/lib/queryKeys';
import { CreateCookbookRequest, UpdateCookbookRequest } from '@/types/cookbook';

// 1. LẤY danh sách sổ tay (GET)
export function useCookbooks(userId: string) {
  return useQuery({
    queryKey: queryKeys.cookbook.detail(userId),
    queryFn: () => cookbookApi.getAll(userId),
    enabled: !!userId, 
  });
}

// 2. TẠO sổ tay mới (POST)
export function useCreateCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCookbookRequest) => cookbookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
    },
  });
}

// 3. SỬA tên sổ tay (PUT)
export function useUpdateCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCookbookRequest }) => cookbookApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
    },
  });
}

// 4. XÓA sổ tay (DELETE)
export function useDeleteCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cookbookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
    },
  });
}