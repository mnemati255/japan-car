export type ListResult<T> = {
  items: T[];
  totalPage: number;
  totalCount?: number;
  empty: boolean;
  isLoading: boolean;
  error: boolean;
};