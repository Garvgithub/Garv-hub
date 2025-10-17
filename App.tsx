import { useState } from 'react';
import { DataProvider, useData } from './contexts/DataContext';
import { Dashboard } from './components/Dashboard';
import { Projects } from './components/Projects';
import { TasksEnhanced } from './components/TasksEnhanced';
import { Habits } from './components/Habits';
import { Notes } from './components/Notes';
import { Canva } from './components/Canva';
import { Finance } from './components/Finance';
import { Storytelling } from './components/Storytelling';
import { Shayari } from './components/Shayari';
import { MotivationalQuote } from './components/MotivationalQuote';
import { BottomDock } from './components/BottomDock';
import { SearchBar } from './components/SearchBar';
import { Footer } from './components/Footer';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  TrendingUp, 
  StickyNote, 
  Palette, 
  DollarSign, 
  Film,
  Heart,
  Menu,
  X
} from 'lucide-react';
import { Toaster } from './components/ui/sonner';

type View = 'home' | 'dashboard' | 'projects' | 'tasks' | 'habits' | 'notes' | 'canva' | 'finance' | 'storytelling' | 'shayari';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  const { tasks, notFixedBudget, fixedBudgets, fixedExpenses, habits, stories, shayaris } = useData();

  const navigation = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      view: 'dashboard' as View,
      stat: ''
    },
    { 
      name: 'Projects', 
      icon: FolderKanban, 
      view: 'projects' as View,
      stat: ''
    },
    { 
      name: 'Tasks', 
      icon: CheckSquare, 
      view: 'tasks' as View,
      stat: `${tasks.filter(t => t.status !== 'Done').length} Pending`
    },
    { 
      name: 'Habits', 
      icon: TrendingUp, 
      view: 'habits' as View,
      stat: `${habits.filter(h => h.isActive).length} Active`
    },
    { 
      name: 'Notes', 
      icon: StickyNote, 
      view: 'notes' as View,
      stat: ''
    },
    { 
      name: 'Canva', 
      icon: Palette, 
      view: 'canva' as View,
      stat: ''
    },
    { 
      name: 'Finance', 
      icon: DollarSign, 
      view: 'finance' as View,
      stat: (() => {
        const totalIncome = notFixedBudget.filter(n => n.type === 'Income').reduce((sum, n) => sum + n.amount, 0);
        const totalExpense = notFixedBudget.filter(n => n.type === 'Expense').reduce((sum, n) => sum + n.amount, 0);
        const latestFixedBudget = fixedBudgets[fixedBudgets.length - 1];
        const fixedSpent = latestFixedBudget 
          ? fixedExpenses.filter(fe => fe.fixedBudgetId === latestFixedBudget.id).reduce((sum, fe) => sum + fe.spentAmount, 0)
          : 0;
        const balance = totalIncome - totalExpense - fixedSpent;
        return `₹${balance.toFixed(0)} Left`;
      })()
    },
    { 
      name: 'Storytelling', 
      icon: Film, 
      view: 'storytelling' as View,
      stat: `${stories.filter(s => s.status === 'In Progress').length} Active`
    },
    { 
      name: 'Shayari', 
      icon: Heart, 
      view: 'shayari' as View,
      stat: `${shayaris.length} Written`
    },
  ];

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="p-4 md:p-6 space-y-6 pb-24">
            <MotivationalQuote />
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                value={globalSearch} 
                onChange={setGlobalSearch}
                placeholder="Search across all sections..."
              />
            </div>

            <div className="text-center space-y-2 pt-4">
              <h1 className="text-3xl md:text-4xl">Garv's Productivity Hub</h1>
              <p className="text-muted-foreground">
                Your all-in-one personal management system
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {navigation.map((item) => (
                <Card 
                  key={item.view}
                  className="calm-card cursor-pointer hover:border-primary/20"
                  onClick={() => handleNavClick(item.view)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center space-y-3 min-h-[140px]">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-primary/10 flex items-center justify-center icon-glow">
                      <item.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <div>{item.name}</div>
                      {item.stat && (
                        <Badge variant="secondary" className="text-xs">
                          {item.stat}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Footer />
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <TasksEnhanced />;
      case 'habits':
        return <Habits />;
      case 'notes':
        return <Notes />;
      case 'canva':
        return <Canva />;
      case 'finance':
        return <Finance />;
      case 'storytelling':
        return <Storytelling />;
      case 'shayari':
        return <Shayari />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b glass-dock">
        <div className="container flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden sm:inline-block">Garv's Hub</span>
          </div>
          <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
            {navigation.slice(0, 6).map((item) => (
              <Button
                key={item.view}
                variant={currentView === item.view ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleNavClick(item.view)}
                className="rounded-lg"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white p-4">
            <nav className="grid grid-cols-2 gap-2">
              {navigation.map((item) => (
                <Button
                  key={item.view}
                  variant={currentView === item.view ? 'default' : 'outline'}
                  className="justify-start rounded-lg"
                  onClick={() => handleNavClick(item.view)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto">
        {renderView()}
      </main>

      <BottomDock />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}