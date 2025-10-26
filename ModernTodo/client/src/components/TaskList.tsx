import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { motion } from "framer-motion";
import type { Task } from "@shared/schema";
import type { TaskFiltersState } from "./TaskFilters";

interface TaskListProps {
  filters: TaskFiltersState;
}

export function TaskList({ filters }: TaskListProps) {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const applyFilters = (tasks: Task[]): Task[] => {
    return tasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filters.priority.length > 0) {
        if (!task.priority || !filters.priority.includes(task.priority)) {
          return false;
        }
      }

      // Category filter
      if (filters.category.length > 0) {
        if (!task.category || !filters.category.includes(task.category)) {
          return false;
        }
      }

      // Completion status filter
      if (filters.completed === "active" && task.completed) return false;
      if (filters.completed === "completed" && !task.completed) return false;

      return true;
    });
  };

  const filteredTasks = tasks ? applyFilters(tasks) : [];
  const activeTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  const completionPercentage =
    tasks && tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-6 w-6 animate-pulse rounded bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      {tasks && tasks.length > 0 && (
        <div className="space-y-2" data-testid="container-progress">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid="text-completion-percentage">
              {completionPercentage}% Complete
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-primary"
              data-testid="bar-progress"
            />
          </div>
        </div>
      )}

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Circle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Active Tasks</h2>
          <span className="ml-auto text-sm text-muted-foreground" data-testid="text-active-count">
            {activeTasks.length}
          </span>
        </div>

        {activeTasks.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground" data-testid="text-no-active-tasks">No active tasks</p>
            <p className="text-sm text-muted-foreground">
              Create a new task to get started
            </p>
          </div>
        ) : (
          <div className="space-y-0" data-testid="list-active-tasks">
            {activeTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        )}
      </Card>

      {completedTasks.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Completed Tasks</h2>
            <span className="ml-auto text-sm text-muted-foreground" data-testid="text-completed-count">
              {completedTasks.length}
            </span>
          </div>

          <div className="space-y-0" data-testid="list-completed-tasks">
            {completedTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        </Card>
      )}

      {tasks && tasks.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="mb-2 text-lg font-medium">No tasks yet</h3>
            <p className="text-muted-foreground" data-testid="text-no-tasks">
              Start by creating your first task above
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
