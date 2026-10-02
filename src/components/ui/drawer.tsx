import { Drawer as Vaul } from "vaul";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Vaul.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <Vaul.Portal>
        <Vaul.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Vaul.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[78dvh] flex-col rounded-t-xl bg-surface",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
          )}
        >
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border" />
          <Vaul.Title className="px-5 pb-2 pt-3 text-sm font-medium text-fg">{title}</Vaul.Title>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {children}
          </div>
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  );
}
