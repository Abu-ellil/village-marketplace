import React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  AccessibilityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends AccessibilityProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  className?: string;
  style?: ViewStyle;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-green-600",
  secondary: "bg-blue-600",
  ghost: "bg-transparent",
};

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  className = "",
  accessibilityLabel,
  style,
}) => {
  return (
    // keep simple wrapper so existing tailwind classes still work
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={`${variantClasses[variant]} px-4 py-2 rounded-lg flex-row items-center justify-center ${className}`}
      style={style}
    >
      {/* children may be text or icon+text */}
      {typeof children === "string" ? (
        <Text className="text-white font-bold">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
