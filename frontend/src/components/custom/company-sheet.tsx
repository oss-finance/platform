import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type * as React from "react";

interface CompanySheetProps {
  children: React.ReactNode;
}

export const CompanySheet = ({ children }: CompanySheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="w-full min-w-5xl">
        <SheetHeader>
          <SheetTitle>Company Sheet</SheetTitle>
          <SheetDescription>TBD...</SheetDescription>
        </SheetHeader>

        <div>TBD...</div>
      </SheetContent>
    </Sheet>
  );
};
