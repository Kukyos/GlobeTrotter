import React from "react";

type Variant = "default" | "bordered" | "elevated";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ variant = "default", padding = "p-4", className, children, ...rest }) => {
  const base = "bg-black/40 backdrop-blur-md rounded-md";
  const variantMap: Record<Variant, string> = {
    default: `border border-white/10`,
    bordered: `border border-white/20`,
    elevated: `shadow-md border border-white/6`,
  };

  return (
    <div className={`${base} ${variantMap[variant]} ${padding} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;