import React, { CSSProperties, ReactNode, SyntheticEvent } from "react";
import { Button } from "@ya.praktikum/react-developer-burger-ui-components";

interface MenuButtonProps {
  style?: CSSProperties;
  children: ReactNode;
  type?: "secondary" | "primary";
  size?: "small" | "medium" | "large";
  onClick?: (() => void) | ((e: SyntheticEvent<Element, Event>) => void);
  extraClass?: string;
  htmlType?: "button" | "submit" | "reset";
  [key: string]: any;
}

function MenuButton({
  style,
  children,
  type = "secondary",
  size = "medium",
  htmlType = "button",
  ...props
}: MenuButtonProps) {
  const custom: CSSProperties = {
    gap: "8px",
    display: "flex",
    color: "#fff",
    padding: "16px 20px",
  };

  return (
    <Button
      htmlType={htmlType}
      type={type}
      size={size}
      style={{ ...custom, ...style }}
      {...props}
    >
      {children}
    </Button>
  );
}

export default MenuButton;
