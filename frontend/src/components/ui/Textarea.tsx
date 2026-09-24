import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`textarea ${error ? "input-error" : ""} ${className}`.trim()}
          {...props}
        />
        {error && <span className="form-error-msg">{error}</span>}
        {!error && helperText && <span className="text-muted xs">{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
