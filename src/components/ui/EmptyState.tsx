import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";

interface EmptyStateProps { icon?: React.ReactNode; title: string; description: string; actionLabel?: string; actionHref?: string; }

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-gray-300 mb-4">{icon || <ShoppingBag size={80} />}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-md">{description}</p>
      {actionLabel && actionHref && <Link href={actionHref}><Button>{actionLabel}</Button></Link>}
    </div>
  );
}
