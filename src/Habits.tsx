import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { Habit } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { SearchBar } from './SearchBar';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export function Habits() {
  const { habits, setHabits } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<Partial<Habit>>({
    name: '',
    frequency: 'Daily',
    startDate: '',
    streak: 0,
    isActive: true,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHabit) {
      setHabits(habits.map(h => h.id === editingHabit.id ? { ...editingHabit, ...formData } : h));
    } else {
      const newHabit: Habit = {
        id: generateId('HBT'),
        name: formData.name || '',
        frequency: formData.frequency || 'Daily',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        streak: formData.streak || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        notes: formData.notes || '',
      };
      setHabits([...habits, newHabit]);
    }
    
    setIsOpen(false);
    setEditingHabit(null);
    setFormData({
      name: '',
      frequency: 'Daily',
      startDate: '',
      streak: 0,
      isActive: true,
      notes: '',
    });
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData(habit);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const incrementStreak = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h));
  };

  const decrementStreak = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, streak: Math.max(0, h.streak - 1) } : h));
  };

  const resetStreak = (id: string) => {
    if (confirm('Reset streak to 0?')) {
      setHabits(habits.map(h => h.id === id ? { ...h, streak: 0 } : h));
    }
  };

  const filteredHabits = habits.filter(habit =>
    habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    habit.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1>Habits</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHabit ? 'Edit Habit' : 'New Habit'}</DialogTitle>
              <DialogDescription>
                {editingHabit ? 'Make changes to your existing habit.' : 'Create a new habit to track.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Habit Name</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={formData.frequency} onValueChange={value => setFormData({ ...formData, frequency: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Current Streak</Label>
                <Input
                  type="number"
                  value={formData.streak}
                  onChange={e => setFormData({ ...formData, streak: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
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
                {editingHabit ? 'Update Habit' : 'Create Habit'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search habits..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map(habit => (
          <Card key={habit.id} className={`${habit.isActive ? 'bg-white' : 'opacity-60 bg-white'} hover:shadow-lg transition-shadow`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="cursor-pointer flex-1" onClick={() => handleEdit(habit)}>
                  <CardTitle>{habit.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">{habit.frequency}</Badge>
                  {!habit.isActive && <Badge variant="secondary" className="mt-2 ml-2">Inactive</Badge>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(habit.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🔥</div>
                <div className="text-3xl">{habit.streak}</div>
                <div className="text-sm text-muted-foreground">day streak</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => incrementStreak(habit.id)} 
                  className="flex-1"
                  size="sm"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +1
                </Button>
                <Button 
                  onClick={() => decrementStreak(habit.id)} 
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -1
                </Button>
              </div>
              <Button 
                onClick={() => resetStreak(habit.id)} 
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Reset
              </Button>
              <div className="text-sm text-muted-foreground">
                Started: {habit.startDate}
              </div>
              {habit.notes && (
                <p className="text-sm">{habit.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHabits.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No habits match your search.' : 'No habits yet. Click "Add Habit" to get started.'}
        </div>
      )}
    </div>
  );
}