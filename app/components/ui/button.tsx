import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/util/cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/80",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "border bg-background hover:bg-foreground/5",
				secondary: "bg-foreground text-background hover:bg-foreground/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				"ghost-destructive": "hover:bg-destructive hover:text-destructive-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				muted: "text-foreground bg-muted hover:bg-background-90",
				navigation: "bg-accent rounded-xl",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				xs: "h-8 rounded-md px-2",
				lg: "h-11 rounded-md px-8",
				icon: "h-8 w-8",
				link: "px-2 py-1",
				bubble: "text-[11px] py-1 px-2 rounded-full",
				navigation: "h-8 rounded-xl px-4 py-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
export { Button, buttonVariants };
