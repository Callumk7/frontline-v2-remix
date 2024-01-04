import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";

const tagVariants = cva("inline rounded-lg", {
  variants: {
    variant: {
      default: "bg-background border text-accent-foreground",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-foreground text-background",
    },
    size: {
      default: "text-[10px] px-2 py-1",
      lg: "text-sm px-3 py-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface TagProps extends VariantProps<typeof tagVariants> {
  children?: React.ReactNode;
  className?: string;
}

export function Tag({ children, className, variant, size }: TagProps) {
  return (
    <div className={clsx(tagVariants({ variant, size, className }))}>{children}</div>
  );
}
