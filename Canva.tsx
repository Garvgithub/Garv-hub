import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { CanvaFont, CanvaApp, CanvaIdea, CanvaLink } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Type, AppWindow, Lightbulb, Link as LinkIcon, ExternalLink } from 'lucide-react';

export function Canva() {
  const { canvaFonts, setCanvaFonts, canvaApps, setCanvaApps, canvaIdeas, setCanvaIdeas, canvaLinks, setCanvaLinks } = useData();
  
  const [fontDialog, setFontDialog] = useState(false);
  const [appDialog, setAppDialog] = useState(false);
  const [ideaDialog, setIdeaDialog] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);

  // Font management
  const [fontForm, setFontForm] = useState<Partial<CanvaFont>>({ name: '', useCaseNotes: '' });
  const [editingFont, setEditingFont] = useState<CanvaFont | null>(null);

  const handleFontSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFont) {
      setCanvaFonts(canvaFonts.map(f => f.id === editingFont.id ? { ...editingFont, ...fontForm } : f));
    } else {
      setCanvaFonts([...canvaFonts, {
        id: generateId('CNF'),
        name: fontForm.name || '',
        useCaseNotes: fontForm.useCaseNotes || '',
      }]);
    }
    setFontDialog(false);
    setEditingFont(null);
    setFontForm({ name: '', useCaseNotes: '' });
  };

  // App management
  const [appForm, setAppForm] = useState<Partial<CanvaApp>>({ name: '', purpose: '', quickTip: '' });
  const [editingApp, setEditingApp] = useState<CanvaApp | null>(null);

  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApp) {
      setCanvaApps(canvaApps.map(a => a.id === editingApp.id ? { ...editingApp, ...appForm } : a));
    } else {
      setCanvaApps([...canvaApps, {
        id: generateId('CNA'),
        name: appForm.name || '',
        purpose: appForm.purpose || '',
        quickTip: appForm.quickTip || '',
      }]);
    }
    setAppDialog(false);
    setEditingApp(null);
    setAppForm({ name: '', purpose: '', quickTip: '' });
  };

  // Idea management
  const [ideaForm, setIdeaForm] = useState<Partial<CanvaIdea>>({ title: '', description: '', tag: '' });
  const [editingIdea, setEditingIdea] = useState<CanvaIdea | null>(null);

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdea) {
      setCanvaIdeas(canvaIdeas.map(i => i.id === editingIdea.id ? { ...editingIdea, ...ideaForm } : i));
    } else {
      setCanvaIdeas([...canvaIdeas, {
        id: generateId('CNI'),
        title: ideaForm.title || '',
        description: ideaForm.description || '',
        tag: ideaForm.tag || '',
      }]);
    }
    setIdeaDialog(false);
    setEditingIdea(null);
    setIdeaForm({ title: '', description: '', tag: '' });
  };

  // Link management
  const [linkForm, setLinkForm] = useState<Partial<CanvaLink>>({ title: '', url: '', notes: '' });
  const [editingLink, setEditingLink] = useState<CanvaLink | null>(null);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      setCanvaLinks(canvaLinks.map(l => l.id === editingLink.id ? { ...editingLink, ...linkForm } : l));
    } else {
      setCanvaLinks([...canvaLinks, {
        id: generateId('CNL'),
        title: linkForm.title || '',
        url: linkForm.url || '',
        notes: linkForm.notes || '',
      }]);
    }
    setLinkDialog(false);
    setEditingLink(null);
    setLinkForm({ title: '', url: '', notes: '' });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1>Canva Resources</h1>

      <Tabs defaultValue="fonts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="fonts" className="text-xs sm:text-sm">Fonts</TabsTrigger>
          <TabsTrigger value="apps" className="text-xs sm:text-sm">Apps</TabsTrigger>
          <TabsTrigger value="ideas" className="text-xs sm:text-sm">Ideas</TabsTrigger>
          <TabsTrigger value="links" className="text-xs sm:text-sm">Links</TabsTrigger>
        </TabsList>

        {/* Fonts Tab */}
        <TabsContent value="fonts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2>Fonts</h2>
            <Dialog open={fontDialog} onOpenChange={setFontDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Font
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingFont ? 'Edit Font' : 'New Font'}</DialogTitle>
                  <DialogDescription>
                    {editingFont ? 'Edit the font details below.' : 'Add a new font to your collection.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFontSubmit} className="space-y-4">
                  <div>
                    <Label>Font Name</Label>
                    <Input
                      value={fontForm.name}
                      onChange={e => setFontForm({ ...fontForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Use Case Notes</Label>
                    <Textarea
                      value={fontForm.useCaseNotes}
                      onChange={e => setFontForm({ ...fontForm, useCaseNotes: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingFont ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvaFonts.map(font => (
              <Card key={font.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1">
                      <Type className="h-4 w-4" />
                      <CardTitle className="cursor-pointer" onClick={() => {
                        setEditingFont(font);
                        setFontForm(font);
                        setFontDialog(true);
                      }}>
                        {font.name}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this font?')) {
                          setCanvaFonts(canvaFonts.filter(f => f.id !== font.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{font.useCaseNotes}</p>
                </CardContent>
              </Card>
            ))}
            {canvaFonts.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No fonts yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Apps Tab */}
        <TabsContent value="apps" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2>Apps</h2>
            <Dialog open={appDialog} onOpenChange={setAppDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add App
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingApp ? 'Edit App' : 'New App'}</DialogTitle>
                  <DialogDescription>
                    {editingApp ? 'Edit the app details below.' : 'Add a new app to your collection.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAppSubmit} className="space-y-4">
                  <div>
                    <Label>App Name</Label>
                    <Input
                      value={appForm.name}
                      onChange={e => setAppForm({ ...appForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Textarea
                      value={appForm.purpose}
                      onChange={e => setAppForm({ ...appForm, purpose: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Quick Tip</Label>
                    <Textarea
                      value={appForm.quickTip}
                      onChange={e => setAppForm({ ...appForm, quickTip: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingApp ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvaApps.map(app => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1">
                      <AppWindow className="h-4 w-4" />
                      <CardTitle className="cursor-pointer" onClick={() => {
                        setEditingApp(app);
                        setAppForm(app);
                        setAppDialog(true);
                      }}>
                        {app.name}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this app?')) {
                          setCanvaApps(canvaApps.filter(a => a.id !== app.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-sm">Purpose:</div>
                    <p className="text-sm text-muted-foreground">{app.purpose}</p>
                  </div>
                  {app.quickTip && (
                    <div>
                      <div className="text-sm">Quick Tip:</div>
                      <p className="text-sm text-muted-foreground">{app.quickTip}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {canvaApps.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No apps yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2>Ideas</h2>
            <Dialog open={ideaDialog} onOpenChange={setIdeaDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Idea
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingIdea ? 'Edit Idea' : 'New Idea'}</DialogTitle>
                  <DialogDescription>
                    {editingIdea ? 'Edit the idea details below.' : 'Add a new idea to your collection.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleIdeaSubmit} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={ideaForm.title}
                      onChange={e => setIdeaForm({ ...ideaForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={ideaForm.description}
                      onChange={e => setIdeaForm({ ...ideaForm, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Tag</Label>
                    <Input
                      value={ideaForm.tag}
                      onChange={e => setIdeaForm({ ...ideaForm, tag: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingIdea ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvaIdeas.map(idea => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1">
                      <Lightbulb className="h-4 w-4" />
                      <CardTitle className="cursor-pointer" onClick={() => {
                        setEditingIdea(idea);
                        setIdeaForm(idea);
                        setIdeaDialog(true);
                      }}>
                        {idea.title}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this idea?')) {
                          setCanvaIdeas(canvaIdeas.filter(i => i.id !== idea.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{idea.description}</p>
                  {idea.tag && (
                    <div className="text-xs text-muted-foreground">Tag: {idea.tag}</div>
                  )}
                </CardContent>
              </Card>
            ))}
            {canvaIdeas.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No ideas yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2>Links</h2>
            <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingLink ? 'Edit Link' : 'New Link'}</DialogTitle>
                  <DialogDescription>
                    {editingLink ? 'Edit the link details below.' : 'Add a new link to your collection.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLinkSubmit} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={linkForm.title}
                      onChange={e => setLinkForm({ ...linkForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      type="url"
                      value={linkForm.url}
                      onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={linkForm.notes}
                      onChange={e => setLinkForm({ ...linkForm, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingLink ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvaLinks.map(link => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1">
                      <LinkIcon className="h-4 w-4" />
                      <CardTitle className="cursor-pointer" onClick={() => {
                        setEditingLink(link);
                        setLinkForm(link);
                        setLinkDialog(true);
                      }}>
                        {link.title}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this link?')) {
                          setCanvaLinks(canvaLinks.filter(l => l.id !== link.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {link.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {link.notes && (
                    <p className="text-sm text-muted-foreground">{link.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {canvaLinks.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No links yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}