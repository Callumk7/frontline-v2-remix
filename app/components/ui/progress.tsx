import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "callum-util";

const Progress = forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			"relative h-4 w-full overflow-hidden rounded-full bg-background-3",
			className,
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className="flex-1 w-full h-full transition-all bg-primary"
			style={{
				transform: `translateX(-${100 - ((value || 0) / (max || 100)) * 100}%)`,
			}}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
