import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { Task } from "@shared/schema";

export function Navigation() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });

  const activeTasks = tasks?.filter((task) => !task.completed) || [];
  const completedTasks = tasks?.filter((task) => task.completed) || [];
  const totalTasks = tasks?.length || 0;

  const getInitials = (username: string) => {
    if (!username) return "??";
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" data-testid="icon-app-logo" />
            <h1 className="text-2xl font-bold" data-testid="text-app-title">Motivodo</h1>
          </div>

          {user && totalTasks > 0 && (
            <div className="hidden items-center gap-2 md:flex">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground" data-testid="text-header-completed-count">
                  {completedTasks.length}
                </span>
                {" / "}
                <span data-testid="text-header-total-count">{totalTasks}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden items-center gap-2 md:flex">
              <Avatar className="h-8 w-8">
                <AvatarFallback 
                  className="bg-primary text-primary-foreground text-xs font-medium"
                  data-testid="avatar-user"
                >
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium" data-testid="text-username">{user.username}</span>
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="h-9 w-9"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && (
            <Button
              variant="outline"
              onClick={logout}
              data-testid="button-logout"
              className="h-9"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
