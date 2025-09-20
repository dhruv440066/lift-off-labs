import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-medium hover:-translate-y-0.5",
        destructive: "bg-error text-white shadow-sm hover:bg-error/90 hover:shadow-medium hover:-translate-y-0.5",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-medium hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-medium hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // WasteWise specific variants
        eco: "bg-gradient-eco text-white shadow-glow hover:shadow-strong hover:-translate-y-1 transform transition-all duration-300",
        hero: "bg-gradient-hero text-white shadow-strong hover:shadow-glow hover:-translate-y-1 transform transition-all duration-300 border border-white/20",
        accent: "bg-gradient-accent text-white shadow-medium hover:shadow-strong hover:-translate-y-0.5 transform",
        success: "bg-success text-white shadow-soft hover:bg-success/90 hover:shadow-medium hover:-translate-y-0.5",
        warning: "bg-warning text-white shadow-soft hover:bg-warning/90 hover:shadow-medium hover:-translate-y-0.5",
        glass: "bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 hover:shadow-medium",
        floating: "bg-white shadow-strong hover:shadow-glow hover:-translate-y-2 transform transition-all duration-300 border border-muted",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };