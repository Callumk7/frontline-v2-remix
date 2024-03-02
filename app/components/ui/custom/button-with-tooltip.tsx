import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { Button, ButtonProps } from "../button";

interface ButtonWithTooltipProps extends ButtonProps {
	tooltip: string;
}

export function ButtonWithTooltip({
	children,
	tooltip,
	variant = "outline",
	size = "icon",
	...props
}: ButtonWithTooltipProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button {...props} variant={variant} size={size}>
					{children}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	);
}
