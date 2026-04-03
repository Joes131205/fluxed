import type { MouseEventHandler } from "react";

type ButtonProps = {
    disabled: boolean;
    isSubmitting: boolean;
    label: string;
    loadingLabel?: string;
    type?: "button" | "submit" | "reset";
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
};

export const Button = ({
    disabled,
    isSubmitting,
    label,
    loadingLabel = "Loading...",
    type = "submit",
    onClick,
    className,
}: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`w-full cursor-pointer rounded-xl bg-primary py-3.5 font-bold text-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-primary/60 disabled:opacity-90 ${className ?? ""}`}
        >
            {isSubmitting ? loadingLabel : label}
        </button>
    );
};
