import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { Note } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SearchBar } from './SearchBar';
import { Plus, Trash2, Lightbulb } from 'lucide-react';

export function Notes() {
  const { notes, setNotes, projects } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<Partial<Note>>({
    projectId: '',
    title: '',
    content: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanProjectId = formData.projectId === 'none' ? '' : formData.projectId;
    
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { 
        ...editingNote, 
        ...formData,
        projectId: cleanProjectId 
      } : n));
    } else {
      const newNote: Note = {
        id: generateId('NTE'),
        projectId: cleanProjectId,
        createdOn: new Date().toISOString(),
        title: formData.title || '',
        content: formData.content || '',
        tags: formData.tags || '',
      };
      setNotes([...notes, newNote]);
    }
    
    setIsOpen(false);
    setEditingNote(null);
    setFormData({
      projectId: '',
      title: '',
      content: '',
      tags: '',
    });
  };

  const handleNewThought = () => {
    setFormData({
      projectId: '',
      title: '',
      content: '',
      tags: 'thought',
    });
    setIsOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      ...note,
      projectId: note.projectId || 'none'
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const allNotes = notes;
  const thoughts = notes.filter(n => n.tags.includes('thought'));

  const filteredAllNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThoughts = thoughts.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NotesList = ({ notesList }: { notesList: Note[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notesList.map(note => {
        const project = projects.find(p => p.id === note.projectId);
        return (
          <Card key={note.id} className="hover:shadow-lg transition-shadow bg-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="cursor-pointer flex-1" onClick={() => handleEdit(note)}>
                  <CardTitle>{note.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(note.createdOn).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {project && (
                <Badge variant="outline">{project.name}</Badge>
              )}
              {note.tags && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.split(',').map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm line-clamp-3 mt-2">{note.content}</p>
            </CardContent>
          </Card>
        );
      })}
      {notesList.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No notes found.
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1>Notes & Thoughts</h1>
        <div className="flex gap-2">
          <Button onClick={handleNewThought} variant="outline" className="rounded-xl">
            <Lightbulb className="h-4 w-4 mr-2" />
            New Thought
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'New Note'}</DialogTitle>
                <DialogDescription>
                  {editingNote ? 'Edit your note here.' : 'Add a new note here.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Project (Optional)</Label>
                  <Select value={formData.projectId} onValueChange={value => setFormData({ ...formData, projectId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., thought, important, idea"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingNote ? 'Update Note' : 'Create Note'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search notes and thoughts..."
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="all">All Notes ({filteredAllNotes.length})</TabsTrigger>
          <TabsTrigger value="thoughts">Thoughts ({filteredThoughts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <NotesList notesList={filteredAllNotes} />
        </TabsContent>
        <TabsContent value="thoughts" className="mt-6">
          <NotesList notesList={filteredThoughts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}