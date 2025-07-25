import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: Date;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const { toast } = useToast();

  const addTodo = () => {
    if (!newTodo.trim()) {
      toast({
        title: "Empty Task",
        description: "Please enter a task before adding.",
        variant: "destructive",
      });
      return;
    }

    const todo: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      priority: newPriority,
      completed: false,
      createdAt: new Date(),
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
    setNewPriority('medium');
    
    toast({
      title: "Task Added",
      description: "Your task has been added successfully!",
    });
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task removed successfully.",
    });
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) {
      toast({
        title: "Empty Task",
        description: "Task cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setTodos(todos.map(todo => 
      todo.id === editingId 
        ? { ...todo, text: editText.trim() }
        : todo
    ));
    setEditingId(null);
    setEditText('');
    
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully!",
    });
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.priority === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-priority-high text-white';
      case 'medium': return 'bg-priority-medium text-foreground';
      case 'low': return 'bg-priority-low text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Todo List Manager</h1>
          <p className="text-lg opacity-90">Organize your tasks efficiently</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Todo Creation Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter your task here..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Select value={newPriority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewPriority(value)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addTodo} className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Your Tasks ({filteredTodos.length})</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={filter} onValueChange={(value: 'all' | 'high' | 'medium' | 'low') => setFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-lg">
                {filter === 'all' 
                  ? "No tasks yet. Add your first task above!" 
                  : `No ${filter} priority tasks found.`
                }
              </p>
            </Card>
          ) : (
            filteredTodos.map((todo) => (
              <Card key={todo.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="w-5 h-5 rounded border-2 border-primary"
                    />
                    
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          onBlur={saveEdit}
                          className="mb-2"
                          autoFocus
                        />
                      ) : (
                        <p className={`text-lg ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.text}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(todo.priority)}>
                          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {todo.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingId === todo.id ? (
                        <Button onClick={saveEdit} size="sm" variant="outline">
                          Save
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => startEdit(todo)} 
                          size="sm" 
                          variant="outline"
                          disabled={todo.completed}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => deleteTodo(todo.id)} 
                        size="sm" 
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built with React & TypeScript | © 2024 Todo List Manager
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Stay organized, stay productive
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TodoApp;