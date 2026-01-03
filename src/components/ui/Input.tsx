import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, wrapperClassName, className, ...inputProps }) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="input-label block mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">{leftIcon}</div>}
        <input
          {...inputProps}
          className={`input-field w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className ?? ""}`}
        />
        {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">{rightIcon}</div>}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default Input;