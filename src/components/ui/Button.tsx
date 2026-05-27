import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[#2874f0] hover:bg-[#1a5dc8] text-white",
      secondary: "bg-[#fb641b] hover:bg-[#e85d19] text-white",
      outline: "border-2 border-[#2874f0] text-[#2874f0] hover:bg-blue-50",
      ghost: "text-gray-600 hover:bg-gray-100",
      danger: "bg-red-500 hover:bg-red-600 text-white",
    };
    const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-8 py-3 text-base" };
    return (
      <button ref={ref} disabled={disabled || loading} className={cn("font-semibold rounded-sm transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], sizes[size], className)} {...props}>
        {loading && (<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>)}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
