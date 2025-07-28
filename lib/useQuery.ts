import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

export function useAdminQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData>({
    queryKey,
    queryFn,
    ...options,
  });
}
