export type ListResult<T> = {
  items: T[];
  totalPage: number;
  empty: boolean;
  isLoading: boolean;
  error: boolean;
};