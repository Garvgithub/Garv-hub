import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { Task } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SearchBar } from './SearchBar';
import { Plus, Trash2, FolderPlus } from 'lucide-react';

export function TasksEnhanced() {
  const { tasks, setTasks, projects } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Recurring task handler
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
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dailyTasks = filteredTasks.filter(t => t.recurrenceRule === 'DAILY' || !t.isRecurring);
  const weeklyTasks = filteredTasks.filter(t => t.recurrenceRule === 'WEEKLY');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const TaskList = ({ taskList }: { taskList: Task[] }) => (
    <div className="space-y-3">
      {taskList.map(task => {
        const project = projects.find(p => p.id === task.projectId);
        return (
          <Card key={task.id} className="calm-card group">
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
                    <div className="cursor-pointer flex-1" onClick={() => handleEdit(task)}>
                      <h4 className={task.status === 'Done' ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </h4>
                      {project && <p className="text-sm text-muted-foreground">{project.name}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="edit-button always-visible"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    {task.isRecurring && <Badge variant="outline">🔁 {task.recurrenceRule}</Badge>}
                    {task.dueDate && <Badge variant="secondary">{task.dueDate}</Badge>}
                  </div>
                  {task.notes && (
                    <p className="text-sm text-muted-foreground">{task.notes}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {taskList.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks found.
        </div>
      )}
    </div>
  );

  return (
    <div className="module-tasks min-h-screen p-4 md:p-6 space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1>Tasks</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
                <DialogDescription>
                  {editingTask ? 'Update task details below.' : 'Create a new task with details below.'}
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
                    <Label>Recurrence</Label>
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
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search tasks..."
      />

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-6">
          <TaskList taskList={dailyTasks} />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          <TaskList taskList={weeklyTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}