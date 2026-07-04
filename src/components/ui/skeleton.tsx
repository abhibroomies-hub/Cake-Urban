import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-[#26130F]/80 border border-[#DFB15B]/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
