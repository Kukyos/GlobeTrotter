import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-globe-500 text-white hover:bg-globe-600",
  secondary: "bg-white/10 hover:bg-white/20 text-white",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-white hover:bg-white/5",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-3",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, children, disabled, className, ...rest }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition";
    const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled || isLoading ? "opacity-60 pointer-events-none" : ""} ${className ?? ""}`;

    return (
      <button ref={ref} className={classes} disabled={disabled} {...rest}>
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        )}
        {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;