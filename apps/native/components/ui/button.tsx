import { Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";

interface ButtonProps extends Omit<PressableProps, "children"> {
	title: string;
	variant?: "default" | "outline" | "secondary" | "destructive";
	size?: "default" | "sm" | "lg";
}

export function Button({
	title,
	variant = "default",
	size = "default",
	className,
	...props
}: ButtonProps) {
	const baseClasses = "items-center justify-center rounded-md font-medium active:opacity-70";
	
	const variantClasses = {
		default: "bg-primary text-primary-foreground",
		outline: "border border-input bg-background",
		secondary: "bg-secondary text-secondary-foreground",
		destructive: "bg-destructive text-destructive-foreground",
	};

	const sizeClasses = {
		default: "h-9 px-4 py-2",
		sm: "h-8 px-3 py-1.5 text-sm",
		lg: "h-10 px-6 py-2.5",
	};

	return (
		<Pressable
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
			{...props}
		>
			<Text className={`text-foreground ${size === "sm" ? "text-sm" : ""}`}>
				{title}
			</Text>
		</Pressable>
	);
}

