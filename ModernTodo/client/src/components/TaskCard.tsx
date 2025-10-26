import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";
import { EditTaskModal } from "./EditTaskModal";

function getPriorityStyles(priority: string): { variant: string; className: string } {
  switch (priority) {
    case "high":
      return { variant: "destructive", className: "" }; // Red
    case "medium":
      return { variant: "default", className: "bg-yellow-500 text-white border-yellow-600" }; // Yellow
    case "low":
      return { variant: "default", className: "bg-blue-500 text-white border-blue-600" }; // Blue
    default:
      return { variant: "default", className: "" };
  }
}

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest<Task>("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/tasks/${task.id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="group flex items-start gap-4 border-b py-4 last:border-0"
        data-testid={`task-card-${task.id}`}
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleMutation.mutate()}
          disabled={toggleMutation.isPending}
          className="mt-1 h-6 w-6 rounded-md"
          data-testid={`checkbox-task-${task.id}`}
        />

        <div className="flex-1 space-y-1">
          <h3
            className={`font-medium leading-tight transition-all ${
              task.completed ? "text-muted-foreground line-through" : "text-foreground"
            }`}
            data-testid={`text-task-title-${task.id}`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm leading-relaxed ${
                task.completed ? "text-muted-foreground/70" : "text-muted-foreground"
              }`}
              data-testid={`text-task-description-${task.id}`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {task.category && (
              <Badge 
                variant="outline"
                className="text-xs font-medium"
                data-testid={`badge-task-category-${task.id}`}
              >
                {task.category}
              </Badge>
            )}
            {task.priority && (() => {
              const { variant, className } = getPriorityStyles(task.priority);
              return (
                <Badge 
                  variant={variant as any}
                  className={`text-xs font-medium ${className}`}
                  data-testid={`badge-task-priority-${task.id}`}
                >
                  {task.priority}
                </Badge>
              );
            })()}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span data-testid={`text-task-due-date-${task.id}`}>
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditOpen(true)}
            disabled={task.completed}
            data-testid={`button-edit-task-${task.id}`}
            className="h-9 w-9"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            data-testid={`button-delete-task-${task.id}`}
            className="h-9 w-9 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <EditTaskModal
        task={task}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
