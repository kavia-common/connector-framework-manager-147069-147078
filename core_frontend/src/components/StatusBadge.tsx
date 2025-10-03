/** Accessible status badge with themed colors */
import React from "react";

export type Status = "active" | "inactive" | "error" | "pending";

export function statusColor(status: Status): string {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "inactive":
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "error":
    default:
      return "bg-red-50 text-red-700 ring-red-600/20";
  }
}

// PUBLIC_INTERFACE
export const StatusBadge: React.FC<{ status: Status; className?: string }> = ({
  status,
  className = "",
}) => {
  /** A small rounded badge reflecting a connection status. */
  const label = status[0].toUpperCase() + status.slice(1);
  return (
    <span
      role="status"
      aria-label={`Status: ${label}`}
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColor(
        status
      )} ${className}`}
    >
      {label}
    </span>
  );
};
