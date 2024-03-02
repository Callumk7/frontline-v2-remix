import { cn } from "@/util/cn";
import { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}
export function Container({ children, className, ...props }: ContainerProps) {
	return (
		<div className={cn("w-4/5 mx-auto", className)} {...props}>
			{children}
		</div>
	);
}
