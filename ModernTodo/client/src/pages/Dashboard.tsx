import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { MotivationalQuoteCard } from "@/components/MotivationalQuoteCard";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { TaskFilters, type TaskFiltersState } from "@/components/TaskFilters";
import type { Task } from "@shared/schema";

export default function Dashboard() {
  const [filters, setFilters] = useState<TaskFiltersState>({
    search: "",
    priority: [],
    category: [],
    completed: "all",
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const availableCategories = useMemo(() => {
    if (!tasks) return [];
    const categories = new Set<string>();
    tasks.forEach(task => {
      if (task.category) {
        categories.add(task.category);
      }
    });
    return Array.from(categories).sort();
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-8">
          <MotivationalQuoteCard />
          <TaskInput />
          <TaskFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
            availableCategories={availableCategories}
          />
          <TaskList filters={filters} />
        </div>
      </main>
    </div>
  );
}
