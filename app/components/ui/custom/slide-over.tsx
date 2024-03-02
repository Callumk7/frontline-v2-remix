import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentPropsWithoutRef, ElementRef, HTMLAttributes, forwardRef } from "react";
import { cn } from "@/util/cn";
import { Cross2Icon } from "@radix-ui/react-icons";

const SlideOver = DialogPrimitive.Root;
const SlideOverPortal = DialogPrimitive.Portal;
const SlideOverTrigger = DialogPrimitive.Trigger;

const SlideOverOverlay = forwardRef<
	ElementRef<typeof DialogPrimitive.Overlay>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		{...props}
	/>
));
SlideOverOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SlideOverContent = forwardRef<
	ElementRef<typeof DialogPrimitive.Content>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<SlideOverPortal>
		<SlideOverOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed top-0 right-0 bottom-0 z-50 grid w-2/3 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2 sm:rounded-lg",
				className,
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
				<Cross2Icon />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</SlideOverPortal>
));
SlideOverContent.displayName = DialogPrimitive.Content.displayName;

const SlideOverHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
		{...props}
	/>
);
SlideOverHeader.displayName = "SlideOverHeader";

const SlideOverFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		{...props}
	/>
);
SlideOverFooter.displayName = "SlideOverFooter";

const SlideOverTitle = forwardRef<
	ElementRef<typeof DialogPrimitive.Title>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("text-lg font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
SlideOverTitle.displayName = DialogPrimitive.Title.displayName;

const SlideOverDescription = forwardRef<
	ElementRef<typeof DialogPrimitive.Description>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
SlideOverDescription.displayName = DialogPrimitive.Description.displayName;

export {
	SlideOver,
	SlideOverTrigger,
	SlideOverContent,
	SlideOverHeader,
	SlideOverFooter,
	SlideOverTitle,
	SlideOverDescription,
};
