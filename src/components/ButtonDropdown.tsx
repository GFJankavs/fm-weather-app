import type { ReactNode } from "react";
import CheckmarkIcon from "./icons/CheckmarkIcon";

const ButtonDropdown = ({
  checked,
  children,
  onClick,
}: {
  checked?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) => (
  <button
    className="flex items-center justify-between text-neutral-0 gap-125 px-100 py-125 rounded-8 hover:bg-neutral-7 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-0 text-preset-7"
    onClick={onClick}
  >
    {children}
    {checked && <CheckmarkIcon />}
  </button>
);

export default ButtonDropdown;
