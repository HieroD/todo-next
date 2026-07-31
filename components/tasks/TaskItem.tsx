"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PencilLine, Trash } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { TaskStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
};

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [isPending, setIsPending] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    setStatus(task.status);
  }, [task.status]);

  async function handleToggle() {
    const newStatus =
      status === TaskStatus.COMPLETED
        ? TaskStatus.NOT_COMPLETED
        : TaskStatus.COMPLETED;

    setStatus(newStatus);
    setIsPending(true);

    try {
      await apiFetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(
        newStatus === TaskStatus.COMPLETED
          ? "Task completed"
          : "Task reopened",
      );
    } catch {
      setStatus(task.status);
      toast.error("Failed to update task");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    setIsPending(true);
    try {
      await apiFetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      onDelete(task.id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsPending(false);
      setIsDeleteOpen(false);
    }
  }

  return (
    <>
      <div className="flex items-start gap-4 overflow-hidden rounded-lg border p-4 transition-colors hover:bg-muted/50">
        <Checkbox
          checked={status === TaskStatus.COMPLETED}
          onCheckedChange={handleToggle}
          disabled={isPending}
          className="mt-1"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h3
            className={
              status === TaskStatus.COMPLETED
                ? "font-medium text-muted-foreground line-through"
                : "font-medium"
            }
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-ellipsis break-all line-clamp-1 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
        <Badge
          className="mt-1"
          variant={status === TaskStatus.COMPLETED ? "secondary" : "default"}
        >
          {status === TaskStatus.COMPLETED ? "Done" : "Pending"}
        </Badge>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            disabled={isPending}
          >
            <PencilLine />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteOpen(true)}
            disabled={isPending}
          >
            <Trash className="text-destructive" />
          </Button>
        </div>
      </div>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{task.title}&quot;? This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
