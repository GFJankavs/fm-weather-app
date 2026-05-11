import type { FC } from "react";

const ButtonPrimary: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...rest
}) => (
  <button
    className="py-200 px-300 flex-center bg-blue-5 text-neutral-0 rounded-12 text-preset-5--medium cursor-pointer hover:bg-blue-7 focus:outline-2 focus:outline-offset-1 focus:outline-blue-5"
    {...rest}
  >
    {children}
  </button>
);

export default ButtonPrimary;
