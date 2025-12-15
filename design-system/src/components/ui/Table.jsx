import React from 'react';

const Table = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-neutral-light ${className}`}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children }) => {
  return (
    <thead className="text-xs text-secondary uppercase bg-neutral-light font-secondary">
      {children}
    </thead>
  );
};

const TableBody = ({ children }) => {
  return (
    <tbody className="font-secondary divide-y divide-neutral-light">
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className = '' }) => {
  return (
    <tr className={`hover:bg-neutral-light/30 transition-colors ${className}`}>
      {children}
    </tr>
  );
};

const TableHead = ({ children, className = '' }) => {
  return (
    <th className={`px-4 py-3 font-bold tracking-wider ${className}`}>
      {children}
    </th>
  );
};

const TableCell = ({ children, className = '' }) => {
  return (
    <td className={`px-4 py-3 text-primary ${className}`}>
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
