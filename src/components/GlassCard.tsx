import React from "react";
import { Card } from "antd";
import type { CardProps } from "antd";

interface GlassCardProps extends CardProps {
  className?: string;
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <Card
      className={`backdrop-blur-md bg-white/30 border border-white/30 shadow-lg rounded-xl ${className}`}
      style={{
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.36)",
        background: "rgba(255, 255, 255, 0.24);",
        backdropFilter: "blur(16.4px)",
        WebkitBackdropFilter: "blur(16.4px)",
      }}
      {...rest}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
