import type { ButtonHTMLAttributes, ReactNode } from "react";
import CheckmarkIcon from "./icons/CheckmarkIcon";

type ButtonDropdownProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
    children: ReactNode;
};

const ButtonDropdown = ({
    checked,
    children,
    type = "button",
    ...rest
}: ButtonDropdownProps) => (
    <button
        type={type}
        className="flex items-center w-full justify-between text-neutral-0 gap-125 px-100 py-125 rounded-8 bg-neutral-8 hover:bg-neutral-7 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0 text-preset-7"
        {...rest}
    >
        {children}
        {checked && <CheckmarkIcon />}
    </button>
);

export default ButtonDropdown;
