import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { Task } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

export function Tasks() {
  const { tasks, setTasks, projects } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [formData, setFormData] = useState<Partial<Task>>({
    projectId: '',
    title: '',
    assignee: '',
    dueDate: '',
    status: 'To Do',
    priority: 'Medium',
    isRecurring: false,
    recurrenceRule: undefined,
    reminderMinutes: undefined,
    notes: '',
  });

  // Handle recurring task creation
  useEffect(() => {
    const checkRecurringTasks = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.isRecurring && task.status === 'Done' && task.recurrenceRule) {
          const taskDueDate = new Date(task.dueDate);
          let nextDueDate = new Date(taskDueDate);
          
          switch (task.recurrenceRule) {
            case 'DAILY':
              nextDueDate.setDate(nextDueDate.getDate() + 1);
              break;
            case 'WEEKLY':
              nextDueDate.setDate(nextDueDate.getDate() + 7);
              break;
            case 'MONTHLY':
              nextDueDate.setMonth(nextDueDate.getMonth() + 1);
              break;
          }
          
          // Check if we need to create the next occurrence
          const existingNextTask = tasks.find(
            t => t.title === task.title && 
            t.dueDate === nextDueDate.toISOString().split('T')[0] &&
            t.status !== 'Done'
          );
          
          if (!existingNextTask && nextDueDate <= now) {
            const newTask: Task = {
              ...task,
              id: generateId('TSK'),
              dueDate: nextDueDate.toISOString().split('T')[0],
              status: 'To Do',
            };
            setTasks([...tasks, newTask]);
          }
        }
      });
    };
    
    // Check every minute
    const interval = setInterval(checkRecurringTasks, 60000);
    return () => clearInterval(interval);
  }, [tasks, setTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...formData } : t));
    } else {
      const newTask: Task = {
        id: generateId('TSK'),
        projectId: formData.projectId || '',
        title: formData.title || '',
        assignee: formData.assignee || '',
        dueDate: formData.dueDate || '',
        status: formData.status || 'To Do',
        priority: formData.priority || 'Medium',
        isRecurring: formData.isRecurring || false,
        recurrenceRule: formData.recurrenceRule,
        reminderMinutes: formData.reminderMinutes,
        notes: formData.notes || '',
      };
      setTasks([...tasks, newTask]);
    }
    
    setIsOpen(false);
    setEditingTask(null);
    setFormData({
      projectId: '',
      title: '',
      assignee: '',
      dueDate: '',
      status: 'To Do',
      priority: 'Medium',
      isRecurring: false,
      recurrenceRule: undefined,
      reminderMinutes: undefined,
      notes: '',
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'default';
      case 'In Progress': return 'default';
      case 'To Do': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1>Tasks</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
              <DialogDescription>
                Add or edit a task to manage your project effectively.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Project</Label>
                <Select value={formData.projectId} onValueChange={value => setFormData({ ...formData, projectId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Task Title</Label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Assignee</Label>
                <Input
                  value={formData.assignee}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={value => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={value => setFormData({ ...formData, priority: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={checked => setFormData({ ...formData, isRecurring: checked as boolean })}
                />
                <Label htmlFor="recurring">Recurring Task</Label>
              </div>
              {formData.isRecurring && (
                <div>
                  <Label>Recurrence Rule</Label>
                  <Select value={formData.recurrenceRule} onValueChange={value => setFormData({ ...formData, recurrenceRule: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>Reminder (minutes before)</Label>
                <Input
                  type="number"
                  value={formData.reminderMinutes || ''}
                  onChange={e => setFormData({ ...formData, reminderMinutes: parseInt(e.target.value) || undefined })}
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          return (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.status === 'Done'}
                    onCheckedChange={checked => 
                      handleStatusChange(task.id, checked ? 'Done' : 'To Do')
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="cursor-pointer" onClick={() => handleEdit(task)}>
                        <h3 className={task.status === 'Done' ? 'line-through' : ''}>{task.title}</h3>
                        {project && <p className="text-sm text-muted-foreground">{project.name}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                      {task.isRecurring && <Badge variant="outline">🔁 {task.recurrenceRule}</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {task.assignee && <div>Assignee: {task.assignee}</div>}
                      {task.dueDate && <div>Due: {task.dueDate}</div>}
                      {task.notes && <div className="mt-2">{task.notes}</div>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks yet. Click "Add Task" to get started.
        </div>
      )}
    </div>
  );
}