import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AppLink {
  name: string;
  url: string;
  emoji: string;
}

const defaultApps: AppLink[] = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', emoji: '🤖' },
  { name: 'Gemini', url: 'https://gemini.google.com', emoji: '✨' },
  { name: 'Perplexity', url: 'https://perplexity.ai', emoji: '🧠' },
];

export function BottomDock() {
  const [customApps, setCustomApps] = useState<AppLink[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', emoji: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApps([...customApps, formData]);
    setFormData({ name: '', url: '', emoji: '' });
    setIsOpen(false);
  };

  const handleDelete = (index: number) => {
    setCustomApps(customApps.filter((_, i) => i !== index));
  };

  const allApps = [...defaultApps, ...customApps];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-dock rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2">
          {allApps.map((app, index) => (
            <motion.div 
              key={index} 
              className="relative group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-12 w-12 rounded-xl hover:bg-primary/10 transition-all relative icon-glow"
                onClick={() => window.open(app.url, '_blank')}
              >
                <span className="text-2xl">{app.emoji}</span>
              </Button>
              {index >= defaultApps.length && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index - defaultApps.length);
                  }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              )}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {app.name}
              </div>
            </motion.div>
          ))}
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New App</DialogTitle>
                <DialogDescription>
                  Add a quick link to your favorite app or website.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>App Name</Label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Notion"
                    required
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <Label>Emoji</Label>
                  <Input
                    value={formData.emoji}
                    onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                    placeholder="📱"
                    maxLength={2}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Add App</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
}