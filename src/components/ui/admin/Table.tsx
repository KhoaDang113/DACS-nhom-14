import React, { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
}) => {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = "",
}) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
}) => {
  return <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>;
};

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = "",
}) => {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  colSpan,
}) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
