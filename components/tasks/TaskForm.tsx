"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "./TaskItem";

type TaskFormData = {
  title: string;
  description?: string;
};

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Task | null;
  onSaved: () => void;
}

export function TaskForm({
  open,
  onOpenChange,
  initialData,
  onSaved,
}: TaskFormProps) {
  const isEditing = !!initialData;
  const formSchema = isEditing ? updateTaskSchema : createTaskSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(formSchema) as Resolver<TaskFormData>,
  });

  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
      });
    }
  }, [open, initialData, reset]);

  async function onSubmit(data: TaskFormData) {
    try {
      if (isEditing) {
        await apiFetch(`/api/tasks/${initialData!.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        toast.success("Task updated");
      } else {
        await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Task created");
      }
      onSaved();
    } catch {
      toast.error(isEditing ? "Failed to update task" : "Failed to create task");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your task."
              : "Add a new task to your list."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
