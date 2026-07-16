import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        `
        flex
        h-12
        w-full
        rounded-xl

        border
        border-border

        bg-background

        px-4

        text-sm
        text-foreground

        placeholder:text-muted-foreground

        transition-all
        duration-200

        outline-none

        focus:border-primary
        focus:ring-4
        focus:ring-primary/10

        disabled:cursor-not-allowed
        disabled:opacity-50

        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        `,
        className
      )}
      {...props}
    />
  );
}

export { Input };