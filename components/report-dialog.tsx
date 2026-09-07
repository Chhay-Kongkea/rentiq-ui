"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateReportMutation } from "@/redux/services/renterApi";

type ReportTarget =
  | { type: "USER"; id: string; label?: string }
  | { type: "ITEM"; id: string; label?: string }
  | { type: "REVIEW"; id: string; label?: string };

interface ReportDialogProps {
  target: ReportTarget;
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function ReportDialog({ target, triggerLabel = "Report", triggerClassName }: ReportDialogProps) {
  const router = useRouter();
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [createReport, { isLoading }] = useCreateReportMutation();

  function handleTriggerClick(event: React.MouseEvent) {
    if (status !== "authenticated") {
      event.preventDefault();
      router.push("/login");
    }
  }

  async function handleSubmit() {
    try {
      await createReport({
        reportType: target.type,
        description: description.trim() || undefined,
        reportedUserId: target.type === "USER" ? target.id : undefined,
        reportedItemId: target.type === "ITEM" ? target.id : undefined,
        reportedReviewId: target.type === "REVIEW" ? target.id : undefined,
      }).unwrap();
      toast.success("Report submitted. Our team will review it.");
      setOpen(false);
      setDescription("");
    } catch {
      toast.error("Unable to submit your report");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button type="button" onClick={handleTriggerClick} className={triggerClassName ?? "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-new-red"}>
            <Flag className="size-3.5" /> {triggerLabel}
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {target.label ?? target.type.toLowerCase()}</DialogTitle>
          <DialogDescription>Tell us what&apos;s wrong. Reports are reviewed by the Rentiq team.</DialogDescription>
        </DialogHeader>
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the issue (optional)..." rows={4} maxLength={5000} />
        <DialogFooter>
          <button type="button" onClick={handleSubmit} disabled={isLoading} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-new-red px-5 text-sm font-bold text-white disabled:opacity-60">
            {isLoading ? "Submitting..." : "Submit report"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
