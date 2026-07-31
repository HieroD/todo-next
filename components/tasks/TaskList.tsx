"use client";

import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskItem, type Task } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { EmptyState } from "./empty-state";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch<Task[]>("/api/tasks");
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function handleDelete(taskId: number) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handleTaskSaved() {
    setIsFormOpen(false);
    setEditingTask(null);
    fetchTasks();
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
        {error}
        <Button variant="link" onClick={fetchTasks}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
        >
          <Plus />
          Add Task
        </Button>
      </div>
      {tasks.length === 0 ? (
        <EmptyState
          icon={<Plus className="h-12 w-12" />}
          title="No tasks yet"
          description="Create your first task to get started."
          action={
            <Button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
            >
              <Plus />
              Add Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTask}
        onSaved={handleTaskSaved}
      />
    </div>
  );
}
