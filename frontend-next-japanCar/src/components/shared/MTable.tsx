import { ReactNode } from 'react';
import {
  Table as UiTable,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '../ui/button';

type Column<T> = {
  header: string | ReactNode;
  accessor: string | ((row: T) => ReactNode);
  width?: string;
};

type Action<T> = {
  icon: ReactNode;
  label: string;
  onClick: (row: T) => void;
};

type Props<T> = {
  data: T[] | undefined;
  columns: Column<T>[];
  actions?: Action<T>[];
  emptyMessage?: string;
  className?: string;
};

export function MTable<T>({
  data,
  columns,
  actions,
  emptyMessage = 'No data found',
  className,
}: Props<T>) {
  if (!data || data.length === 0) return <p className="text-gray-500">{emptyMessage}</p>;

  return (
    <UiTable className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead key={idx} style={{ width: col.width }}>
              {col.header}
            </TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((col, idx) => {
              const value =
                typeof col.accessor === 'function'
                  ? col.accessor(row)
                  : (row[col.accessor as keyof T] as ReactNode);
              return <TableCell key={idx}>{value ?? ''}</TableCell>;
            })}

            {actions && (
              <TableCell className="flex gap-2">
                {actions.map((action, idx) => (
                  <Button
                    variant={'outline'}
                    key={idx}
                    onClick={() => action.onClick(row)}
                    title={action.label}
                  >
                    {action.icon}
                  </Button>
                ))}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </UiTable>
  );
}
