import { cn } from "@/utils/cn"

/**
 * Skeleton loading placeholder with shimmer animation.
 * Use for loading states to maintain layout stability.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl skeleton-shimmer",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

export { Skeleton }
