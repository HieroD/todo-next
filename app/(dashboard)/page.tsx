import { TaskList } from "@/components/tasks/TaskList";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight">My Tasks</h2>
      <TaskList />
    </div>
  );
}
