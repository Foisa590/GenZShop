import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
        <input ref={ref} id={id} className={cn("w-full px-3 py-2.5 border rounded-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent transition-all", error ? "border-red-400 focus:ring-red-400" : "border-gray-300", className)} {...props} />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
