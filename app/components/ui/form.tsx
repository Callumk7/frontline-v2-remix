import { cn } from "@/util/cn";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({ className, ...props }, ref) => (
		<input
			className={cn(
				className,
				"w-full rounded-md border bg-inherit px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
			)}
			{...props}
			ref={ref}
		/>
	),
);
Input.displayName = "Input";

const TextArea = forwardRef<
	HTMLTextAreaElement,
	TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
	<textarea
		className={cn(
			className,
			"w-full rounded-md border bg-inherit px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		)}
		{...props}
		ref={ref}
	/>
));
TextArea.displayName = "TextArea";

export { Input, TextArea };
