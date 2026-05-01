import { cn } from "@/utils/cn"

/**
 * Marcador de carregamento Skeleton com animação shimmer.
 * Use para estados de carregamento para manter a estabilidade do layout.
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
