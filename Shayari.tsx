import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Shayari as ShayariType, RekhtaSavedShayari } from '../types';
import { generateId } from '../utils/idGenerator';
import { SearchBar } from './SearchBar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Plus, Pencil, Trash2, ArrowLeft, Heart, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Shayari({ onBack }: { onBack?: () => void }) {
  const { shayaris, setShayaris, rekhtaSavedShayaris, setRekhtaSavedShayaris } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShayari, setEditingShayari] = useState<ShayariType | null>(null);
  const [rekhtaDialogOpen, setRekhtaDialogOpen] = useState(false);
  const [editingRekhtaShayari, setEditingRekhtaShayari] = useState<RekhtaSavedShayari | null>(null);

  // Form state for Written Shayari
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Form state for Rekhta Shayari
  const [rekhtaTitle, setRekhtaTitle] = useState('');
  const [rekhtaPoet, setRekhtaPoet] = useState('');
  const [rekhtaContent, setRekhtaContent] = useState('');
  const [rekhtaUrl, setRekhtaUrl] = useState('');

  // Mock Shayari of the Day
  const [shayariOfTheDay] = useState({
    title: 'दिल की बात',
    poet: 'मिर्ज़ा ग़ालिब',
    content: 'हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले\nबहुत निकले मेरे अरमान, लेकिन फिर भी कम निकले',
    rekhtaUrl: 'https://www.rekhta.org'
  });

  useEffect(() => {
    if (editingShayari) {
      setTitle(editingShayari.title);
      setContent(editingShayari.content);
      setTags(editingShayari.tags);
      setImageUrl(editingShayari.imageUrl || '');
    } else {
      resetForm();
    }
  }, [editingShayari]);

  useEffect(() => {
    if (editingRekhtaShayari) {
      setRekhtaTitle(editingRekhtaShayari.title);
      setRekhtaPoet(editingRekhtaShayari.poet);
      setRekhtaContent(editingRekhtaShayari.content);
      setRekhtaUrl(editingRekhtaShayari.rekhtaUrl);
    } else {
      resetRekhtaForm();
    }
  }, [editingRekhtaShayari]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setImageUrl('');
  };

  const resetRekhtaForm = () => {
    setRekhtaTitle('');
    setRekhtaPoet('');
    setRekhtaContent('');
    setRekhtaUrl('');
  };

  const handleSaveShayari = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingShayari) {
      setShayaris(shayaris.map(s =>
        s.id === editingShayari.id
          ? { ...s, title, content, tags, imageUrl: imageUrl || undefined }
          : s
      ));
      toast.success('Shayari updated successfully');
    } else {
      const newShayari: ShayariType = {
        id: generateId('SHY'),
        title,
        content,
        tags,
        imageUrl: imageUrl || undefined,
        dateCreated: new Date().toISOString(),
      };
      setShayaris([...shayaris, newShayari]);
      toast.success('Shayari added successfully');
    }

    setDialogOpen(false);
    setEditingShayari(null);
    resetForm();
  };

  const handleSaveRekhtaShayari = () => {
    if (!rekhtaTitle.trim() || !rekhtaPoet.trim() || !rekhtaContent.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRekhtaShayari) {
      setRekhtaSavedShayaris(rekhtaSavedShayaris.map(s =>
        s.id === editingRekhtaShayari.id
          ? { ...s, title: rekhtaTitle, poet: rekhtaPoet, content: rekhtaContent, rekhtaUrl }
          : s
      ));
      toast.success('Rekhta Shayari updated successfully');
    } else {
      const newRekhtaShayari: RekhtaSavedShayari = {
        id: generateId('RKT'),
        title: rekhtaTitle,
        poet: rekhtaPoet,
        content: rekhtaContent,
        rekhtaUrl,
        dateSaved: new Date().toISOString(),
      };
      setRekhtaSavedShayaris([...rekhtaSavedShayaris, newRekhtaShayari]);
      toast.success('Rekhta Shayari saved successfully');
    }

    setRekhtaDialogOpen(false);
    setEditingRekhtaShayari(null);
    resetRekhtaForm();
  };

  const handleDeleteShayari = (id: string) => {
    setShayaris(shayaris.filter(s => s.id !== id));
    toast.success('Shayari deleted successfully');
  };

  const handleDeleteRekhtaShayari = (id: string) => {
    setRekhtaSavedShayaris(rekhtaSavedShayaris.filter(s => s.id !== id));
    toast.success('Rekhta Shayari removed successfully');
  };

  const openRekhtaApp = (url?: string) => {
    const rekhtaUrl = url || 'https://www.rekhta.org';
    // Try to detect if Rekhta app is installed
    // For web, we'll just open the URL
    window.open(rekhtaUrl, '_blank');
  };

  const openRekhtaDictionary = () => {
    window.open('https://www.rekhta.org/urdudictionary', '_blank');
  };

  const filteredShayaris = shayaris.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRekhtaShayaris = rekhtaSavedShayaris.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.poet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen shayari-theme-background pb-24">
      {/* Header with special styling */}
      <div className="shayari-header-gradient p-4 md:p-6 border-b border-violet-200/30">
        <div className="max-w-6xl mx-auto space-y-4">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-2 text-violet-700 hover:text-violet-900 hover:bg-violet-100/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <h1 className="text-3xl md:text-4xl shayari-title">शायरी</h1>
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <p className="text-muted-foreground italic">
              "शब्दों की महफ़िल, जज़्बातों का सफ़र"
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search shayari, poets, tags..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="written" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="written" className="shayari-tab">
              <Pencil className="h-4 w-4 mr-2" />
              Written Shayari
            </TabsTrigger>
            <TabsTrigger value="rekhta" className="shayari-tab">
              <BookOpen className="h-4 w-4 mr-2" />
              Rekhta
            </TabsTrigger>
          </TabsList>

          {/* Written Shayari Tab */}
          <TabsContent value="written" className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditingShayari(null);
                  setDialogOpen(true);
                }}
                className="shayari-button"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Shayari
              </Button>
            </div>

            {filteredShayaris.length === 0 ? (
              <Card className="shayari-card">
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-pink-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No shayari found' : 'Start writing your first shayari...'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredShayaris.map((shayari) => (
                  <Card key={shayari.id} className="shayari-card hover:shadow-2xl transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="shayari-card-title">{shayari.title}</CardTitle>
                          <CardDescription className="text-xs text-muted-foreground mt-1">
                            {new Date(shayari.dateCreated).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingShayari(shayari);
                              setDialogOpen(true);
                            }}
                            className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteShayari(shayari.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {shayari.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {shayari.tags.split(',').map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="shayari-badge">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {shayari.imageUrl && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={shayari.imageUrl}
                            alt={shayari.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      <div className="shayari-content whitespace-pre-wrap">
                        {shayari.content}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rekhta Tab */}
          <TabsContent value="rekhta" className="space-y-6">
            {/* Shayari of the Day */}
            <Card className="shayari-of-day-card border-2 border-violet-300/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-xl">Shayari of the Day</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="shayari-poet-name mb-2">{shayariOfTheDay.poet}</div>
                  <div className="shayari-content text-lg">
                    {shayariOfTheDay.content}
                  </div>
                </div>
                <Button
                  onClick={() => openRekhtaApp(shayariOfTheDay.rekhtaUrl)}
                  variant="outline"
                  className="w-full border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Read More on Rekhta
                </Button>
              </CardContent>
            </Card>

            {/* Rekhta Dictionary Button */}
            <Card className="shayari-card bg-gradient-to-br from-violet-50 to-pink-50">
              <CardContent className="p-6">
                <Button
                  onClick={openRekhtaDictionary}
                  className="w-full shayari-button"
                  size="lg"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Open Rekhta Dictionary
                </Button>
              </CardContent>
            </Card>

            {/* Saved Rekhta Shayaris */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl">Saved Favorites</h3>
                <Button
                  onClick={() => {
                    setEditingRekhtaShayari(null);
                    setRekhtaDialogOpen(true);
                  }}
                  className="shayari-button"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Save Shayari
                </Button>
              </div>

              {filteredRekhtaShayaris.length === 0 ? (
                <Card className="shayari-card">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-violet-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No saved shayari found' : 'Save your favorite shayaris from Rekhta...'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredRekhtaShayaris.map((shayari) => (
                    <Card key={shayari.id} className="shayari-card hover:shadow-2xl transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="shayari-card-title">{shayari.title}</CardTitle>
                            <div className="shayari-poet-name mt-1">{shayari.poet}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingRekhtaShayari(shayari);
                                setRekhtaDialogOpen(true);
                              }}
                              className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRekhtaShayari(shayari.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="shayari-content">
                          {shayari.content}
                        </div>
                        {shayari.rekhtaUrl && (
                          <Button
                            onClick={() => openRekhtaApp(shayari.rekhtaUrl)}
                            variant="outline"
                            size="sm"
                            className="w-full border-violet-300 text-violet-700 hover:bg-violet-50"
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View on Rekhta
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Written Shayari Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingShayari ? 'Edit Shayari' : 'Add New Shayari'}</DialogTitle>
            <DialogDescription>
              Express your feelings through the art of words
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter shayari title..."
              />
            </div>
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your shayari here..."
                rows={8}
                className="resize-none shayari-textarea"
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Romantic, Sad, Motivational (comma separated)"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Background Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveShayari} className="shayari-button">
              {editingShayari ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rekhta Shayari Dialog */}
      <Dialog open={rekhtaDialogOpen} onOpenChange={setRekhtaDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRekhtaShayari ? 'Edit Saved Shayari' : 'Save Rekhta Shayari'}</DialogTitle>
            <DialogDescription>
              Save your favorite shayaris from Rekhta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rekhtaTitle">Title *</Label>
              <Input
                id="rekhtaTitle"
                value={rekhtaTitle}
                onChange={(e) => setRekhtaTitle(e.target.value)}
                placeholder="Enter shayari title..."
              />
            </div>
            <div>
              <Label htmlFor="rekhtaPoet">Poet *</Label>
              <Input
                id="rekhtaPoet"
                value={rekhtaPoet}
                onChange={(e) => setRekhtaPoet(e.target.value)}
                placeholder="Enter poet name..."
              />
            </div>
            <div>
              <Label htmlFor="rekhtaContent">Content *</Label>
              <Textarea
                id="rekhtaContent"
                value={rekhtaContent}
                onChange={(e) => setRekhtaContent(e.target.value)}
                placeholder="Paste the shayari here..."
                rows={8}
                className="resize-none shayari-textarea"
              />
            </div>
            <div>
              <Label htmlFor="rekhtaUrl">Rekhta URL (optional)</Label>
              <Input
                id="rekhtaUrl"
                value={rekhtaUrl}
                onChange={(e) => setRekhtaUrl(e.target.value)}
                placeholder="https://www.rekhta.org/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRekhtaDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRekhtaShayari} className="shayari-button">
              {editingRekhtaShayari ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
