import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface TaskFiltersState {
  search: string;
  priority: string[];
  category: string[];
  completed: string;
}

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onFiltersChange: (filters: TaskFiltersState) => void;
  availableCategories: string[];
}

export function TaskFilters({ filters, onFiltersChange, availableCategories }: TaskFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const togglePriority = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    onFiltersChange({ ...filters, category: newCategories });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      priority: [],
      category: [],
      completed: "all",
    });
  };

  const hasActiveFilters = filters.search || filters.priority.length > 0 || 
    filters.category.length > 0 || filters.completed !== "all";

  const activeFilterCount = 
    (filters.search ? 1 : 0) + 
    filters.priority.length + 
    filters.category.length + 
    (filters.completed !== "all" ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9"
            data-testid="input-search-tasks"
          />
        </div>

        <Select value={filters.completed} onValueChange={(value) => onFiltersChange({ ...filters, completed: value })}>
          <SelectTrigger className="h-9 w-[140px]" data-testid="select-completion-filter">
            <SelectValue placeholder="All tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tasks</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 gap-2" data-testid="button-filter-menu">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">Priority</h4>
                <div className="space-y-2">
                  {["high", "medium", "low"].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={filters.priority.includes(priority)}
                        onCheckedChange={() => togglePriority(priority)}
                        data-testid={`checkbox-priority-${priority}`}
                      />
                      <Label htmlFor={`priority-${priority}`} className="text-sm capitalize cursor-pointer">
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {availableCategories.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Category</h4>
                  <div className="space-y-2">
                    {availableCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.category.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                          data-testid={`checkbox-category-${category}`}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9"
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1" data-testid="badge-filter-search">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}
          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1 capitalize" data-testid={`badge-filter-priority-${priority}`}>
              {priority}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => togglePriority(priority)}
              />
            </Badge>
          ))}
          {filters.category.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1" data-testid={`badge-filter-category-${category}`}>
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleCategory(category)}
              />
            </Badge>
          ))}
          {filters.completed !== "all" && (
            <Badge variant="secondary" className="gap-1 capitalize" data-testid="badge-filter-completed">
              {filters.completed}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFiltersChange({ ...filters, completed: "all" })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}