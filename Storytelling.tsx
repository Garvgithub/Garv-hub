import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { Story, Scene } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { SearchBar } from './SearchBar';
import { Plus, Trash2, Film, Camera } from 'lucide-react';

export function Storytelling() {
  const { stories, setStories, scenes, setScenes, notes, canvaIdeas } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [sceneDialog, setSceneDialog] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Partial<Story>>({
    title: '',
    type: '',
    genre: '',
    tone: '',
    status: 'Idea',
    mainTheme: '',
    summary: '',
    inspirationSource: '',
    linkedNotes: [],
    linkedCanvaIdeas: [],
  });

  const [sceneForm, setSceneForm] = useState<Partial<Scene>>({
    storyId: '',
    sceneNumber: 1,
    title: '',
    type: 'Real',
    summary: '',
    dialogueNotes: '',
    visualTone: '',
    location: '',
    emotionFocus: '',
    musicStyle: '',
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    if (editingStory) {
      setStories(stories.map(s => s.id === editingStory.id ? { 
        ...editingStory, 
        ...formData,
        lastUpdated: now,
      } : s));
    } else {
      const newStory: Story = {
        id: generateId('STY'),
        title: formData.title || '',
        type: formData.type || '',
        genre: formData.genre || '',
        tone: formData.tone || '',
        status: formData.status || 'Idea',
        mainTheme: formData.mainTheme || '',
        summary: formData.summary || '',
        inspirationSource: formData.inspirationSource || '',
        linkedNotes: formData.linkedNotes || [],
        linkedCanvaIdeas: formData.linkedCanvaIdeas || [],
        dateCreated: now,
        lastUpdated: now,
      };
      setStories([...stories, newStory]);
    }
    
    setIsOpen(false);
    setEditingStory(null);
    setFormData({
      title: '',
      type: '',
      genre: '',
      tone: '',
      status: 'Idea',
      mainTheme: '',
      summary: '',
      inspirationSource: '',
      linkedNotes: [],
      linkedCanvaIdeas: [],
    });
  };

  const handleSceneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newScene: Scene = {
      id: generateId('SCN'),
      storyId: sceneForm.storyId || selectedStoryId,
      sceneNumber: sceneForm.sceneNumber || 1,
      title: sceneForm.title || '',
      type: sceneForm.type || 'Real',
      summary: sceneForm.summary || '',
      dialogueNotes: sceneForm.dialogueNotes || '',
      visualTone: sceneForm.visualTone || '',
      location: sceneForm.location || '',
      emotionFocus: sceneForm.emotionFocus || '',
      musicStyle: sceneForm.musicStyle || '',
      completed: sceneForm.completed || false,
    };
    setScenes([...scenes, newScene]);
    
    setSceneDialog(false);
    setSceneForm({
      storyId: '',
      sceneNumber: 1,
      title: '',
      type: 'Real',
      summary: '',
      dialogueNotes: '',
      visualTone: '',
      location: '',
      emotionFocus: '',
      musicStyle: '',
      completed: false,
    });
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData(story);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setStories(stories.filter(s => s.id !== id));
      setScenes(scenes.filter(s => s.storyId !== id));
    }
  };

  const handleDeleteScene = (id: string) => {
    if (confirm('Delete this scene?')) {
      setScenes(scenes.filter(s => s.id !== id));
    }
  };

  const handleAddScene = (storyId: string) => {
    const storyScenes = scenes.filter(s => s.storyId === storyId);
    const nextSceneNumber = storyScenes.length > 0 
      ? Math.max(...storyScenes.map(s => s.sceneNumber)) + 1 
      : 1;
    
    setSelectedStoryId(storyId);
    setSceneForm({ ...sceneForm, storyId, sceneNumber: nextSceneNumber });
    setSceneDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'default';
      case 'Outlining': return 'secondary';
      case 'Idea': return 'outline';
      default: return 'outline';
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1>Storytelling</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              New Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? 'Edit Story' : 'New Story'}</DialogTitle>
              <DialogDescription>
                {editingStory ? 'Update the details of your existing story.' : 'Create a new story with the details below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Story Title</Label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Input
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Short Film, Script, Novel, etc"
                  />
                </div>
                <div>
                  <Label>Genre</Label>
                  <Input
                    value={formData.genre}
                    onChange={e => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Drama, Thriller, etc"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tone</Label>
                  <Input
                    value={formData.tone}
                    onChange={e => setFormData({ ...formData, tone: e.target.value })}
                    placeholder="Dark, Light, etc"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={value => setFormData({ ...formData, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Idea">Idea</SelectItem>
                      <SelectItem value="Outlining">Outlining</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Main Theme</Label>
                <Input
                  value={formData.mainTheme}
                  onChange={e => setFormData({ ...formData, mainTheme: e.target.value })}
                />
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Inspiration Source</Label>
                <Input
                  value={formData.inspirationSource}
                  onChange={e => setFormData({ ...formData, inspirationSource: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingStory ? 'Update Story' : 'Create Story'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scene Dialog */}
      <Dialog open={sceneDialog} onOpenChange={setSceneDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Scene</DialogTitle>
            <DialogDescription>
              Add a new scene to your story with the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSceneSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scene Number</Label>
                <Input
                  type="number"
                  value={sceneForm.sceneNumber}
                  onChange={e => setSceneForm({ ...sceneForm, sceneNumber: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <div>
                <Label>Scene Type</Label>
                <Select value={sceneForm.type} onValueChange={value => setSceneForm({ ...sceneForm, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real">Real</SelectItem>
                    <SelectItem value="Dream">Dream</SelectItem>
                    <SelectItem value="Flashback">Flashback</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Scene Title</Label>
              <Input
                value={sceneForm.title}
                onChange={e => setSceneForm({ ...sceneForm, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea
                value={sceneForm.summary}
                onChange={e => setSceneForm({ ...sceneForm, summary: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Dialogue Notes</Label>
              <Textarea
                value={sceneForm.dialogueNotes}
                onChange={e => setSceneForm({ ...sceneForm, dialogueNotes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Visual Tone</Label>
                <Input
                  value={sceneForm.visualTone}
                  onChange={e => setSceneForm({ ...sceneForm, visualTone: e.target.value })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={sceneForm.location}
                  onChange={e => setSceneForm({ ...sceneForm, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Emotion Focus</Label>
                <Input
                  value={sceneForm.emotionFocus}
                  onChange={e => setSceneForm({ ...sceneForm, emotionFocus: e.target.value })}
                />
              </div>
              <div>
                <Label>Music Style</Label>
                <Input
                  value={sceneForm.musicStyle}
                  onChange={e => setSceneForm({ ...sceneForm, musicStyle: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={sceneForm.completed}
                onCheckedChange={checked => setSceneForm({ ...sceneForm, completed: checked as boolean })}
              />
              <Label htmlFor="completed">Completed</Label>
            </div>
            <Button type="submit" className="w-full">Add Scene</Button>
          </form>
        </DialogContent>
      </Dialog>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search stories..."
      />

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStories.map(story => {
          const storyScenes = scenes.filter(s => s.storyId === story.id);
          const completedScenes = storyScenes.filter(s => s.completed).length;
          
          return (
            <Card key={story.id} className="hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => handleEdit(story)}>
                    <div className="flex items-center gap-2">
                      <Film className="h-5 w-5" />
                      <CardTitle>{story.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={getStatusColor(story.status)}>{story.status}</Badge>
                      {story.genre && <Badge variant="outline">{story.genre}</Badge>}
                      {story.type && <Badge variant="secondary">{story.type}</Badge>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(story.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {story.summary && (
                  <p className="text-sm line-clamp-3">{story.summary}</p>
                )}
                <div className="text-sm text-muted-foreground space-y-1">
                  {story.mainTheme && <div>Theme: {story.mainTheme}</div>}
                  {story.tone && <div>Tone: {story.tone}</div>}
                </div>
                
                {/* Scenes */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">
                        Scenes ({completedScenes}/{storyScenes.length})
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddScene(story.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Scene
                    </Button>
                  </div>
                  
                  {storyScenes.length > 0 && (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {storyScenes
                        .sort((a, b) => a.sceneNumber - b.sceneNumber)
                        .map(scene => (
                          <div key={scene.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded text-sm">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={scene.completed}
                                onCheckedChange={checked => {
                                  setScenes(scenes.map(s => 
                                    s.id === scene.id ? { ...s, completed: checked as boolean } : s
                                  ));
                                }}
                              />
                              <span className={scene.completed ? 'line-through' : ''}>
                                {scene.sceneNumber}. {scene.title}
                              </span>
                              <Badge variant="outline" className="text-xs">{scene.type}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteScene(scene.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground pt-2">
                  Created: {new Date(story.dateCreated).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No stories match your search.' : 'No stories yet. Click "New Story" to get started.'}
        </div>
      )}
    </div>
  );
}