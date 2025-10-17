import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { generateId } from '../utils/idGenerator';
import { NotFixedBudget, FixedBudget, FixedExpense } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { SearchBar } from './SearchBar';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export function Finance() {
  const { notFixedBudget, setNotFixedBudget, fixedBudgets, setFixedBudgets, fixedExpenses, setFixedExpenses } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Not Fixed Budget
  const [nfbDialog, setNfbDialog] = useState(false);
  const [nfbForm, setNfbForm] = useState<Partial<NotFixedBudget>>({
    date: '',
    source: '',
    type: 'Expense',
    category: 'Misc',
    amount: 0,
    notes: '',
  });
  const [editingNfb, setEditingNfb] = useState<NotFixedBudget | null>(null);

  const handleNfbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNfb) {
      setNotFixedBudget(notFixedBudget.map(n => n.id === editingNfb.id ? { ...editingNfb, ...nfbForm } : n));
    } else {
      setNotFixedBudget([...notFixedBudget, {
        id: generateId('NFB'),
        date: nfbForm.date || new Date().toISOString().split('T')[0],
        source: nfbForm.source || '',
        type: nfbForm.type || 'Expense',
        category: nfbForm.category || 'Misc',
        amount: nfbForm.amount || 0,
        notes: nfbForm.notes || '',
      }]);
    }
    setNfbDialog(false);
    setEditingNfb(null);
    setNfbForm({
      date: '',
      source: '',
      type: 'Expense',
      category: 'Misc',
      amount: 0,
      notes: '',
    });
  };

  // Fixed Budget
  const [fbDialog, setFbDialog] = useState(false);
  const [fbForm, setFbForm] = useState<Partial<FixedBudget>>({
    month: '',
    totalBudget: 0,
    notes: '',
  });
  const [editingFb, setEditingFb] = useState<FixedBudget | null>(null);

  const handleFbSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFb) {
      setFixedBudgets(fixedBudgets.map(f => f.id === editingFb.id ? { ...editingFb, ...fbForm } : f));
    } else {
      setFixedBudgets([...fixedBudgets, {
        id: generateId('FBD'),
        month: fbForm.month || '',
        totalBudget: fbForm.totalBudget || 0,
        notes: fbForm.notes || '',
      }]);
    }
    setFbDialog(false);
    setEditingFb(null);
    setFbForm({
      month: '',
      totalBudget: 0,
      notes: '',
    });
  };

  // Fixed Expense
  const [feDialog, setFeDialog] = useState(false);
  const [feForm, setFeForm] = useState<Partial<FixedExpense>>({
    fixedBudgetId: '',
    category: '',
    allocatedAmount: 0,
    spentAmount: 0,
    notes: '',
  });
  const [editingFe, setEditingFe] = useState<FixedExpense | null>(null);

  const handleFeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFe) {
      setFixedExpenses(fixedExpenses.map(f => f.id === editingFe.id ? { ...editingFe, ...feForm } : f));
    } else {
      setFixedExpenses([...fixedExpenses, {
        id: generateId('FEX'),
        fixedBudgetId: feForm.fixedBudgetId || '',
        category: feForm.category || '',
        allocatedAmount: feForm.allocatedAmount || 0,
        spentAmount: feForm.spentAmount || 0,
        notes: feForm.notes || '',
      }]);
    }
    setFeDialog(false);
    setEditingFe(null);
    setFeForm({
      fixedBudgetId: '',
      category: '',
      allocatedAmount: 0,
      spentAmount: 0,
      notes: '',
    });
  };

  // Calculations
  const totalIncome = notFixedBudget.filter(n => n.type === 'Income').reduce((sum, n) => sum + n.amount, 0);
  const totalExpense = notFixedBudget.filter(n => n.type === 'Expense').reduce((sum, n) => sum + n.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const COLORS = ['#5A67FF', '#00B8D9', '#FF6B9D', '#FFA94D', '#20E3B2'];

  const filteredTransactions = notFixedBudget.filter(t =>
    t.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="module-finance min-h-screen p-4 md:p-6 space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1>Finance Management</h1>
      </div>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery}
        placeholder="Search transactions..."
      />

      <Tabs defaultValue="variable" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="variable">Variable Budget</TabsTrigger>
          <TabsTrigger value="fixed">Fixed Budget</TabsTrigger>
        </TabsList>

        {/* Not Fixed Budget Tab */}
        <TabsContent value="variable" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2>Variable Budget</h2>
            <Dialog open={nfbDialog} onOpenChange={setNfbDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingNfb ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
                  <DialogDescription>
                    {editingNfb ? 'Update transaction details.' : 'Add a new income or expense.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNfbSubmit} className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={nfbForm.date}
                      onChange={e => setNfbForm({ ...nfbForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={nfbForm.type} onValueChange={value => setNfbForm({ ...nfbForm, type: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Input
                      value={nfbForm.source}
                      onChange={e => setNfbForm({ ...nfbForm, source: e.target.value })}
                      placeholder="Parents/Freelance/Gift"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={nfbForm.category} onValueChange={value => setNfbForm({ ...nfbForm, category: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Fuel">Fuel</SelectItem>
                        <SelectItem value="Personal Growth">Personal Growth</SelectItem>
                        <SelectItem value="Misc">Misc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={nfbForm.amount}
                      onChange={e => setNfbForm({ ...nfbForm, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={nfbForm.notes}
                      onChange={e => setNfbForm({ ...nfbForm, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingNfb ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">₹{totalIncome.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Expense</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">₹{totalExpense.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">₹{currentBalance.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions List */}
          <div className="space-y-2">
            <h3>Transactions</h3>
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(transaction => (
                <Card key={transaction.id} className="bg-white hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={transaction.type === 'Income' ? 'default' : 'destructive'}>
                            {transaction.type}
                          </Badge>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </div>
                        <div className="mt-2 text-sm">
                          <div>Source: {transaction.source}</div>
                          <div>Date: {transaction.date}</div>
                          {transaction.notes && <div className="text-muted-foreground">{transaction.notes}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-xl ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'Income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this transaction?')) {
                              setNotFixedBudget(notFixedBudget.filter(n => n.id !== transaction.id));
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Fixed Budget Tab */}
        <TabsContent value="fixed" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2>Fixed Budget</h2>
            <Dialog open={fbDialog} onOpenChange={setFbDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingFb ? 'Edit Budget' : 'New Budget'}</DialogTitle>
                  <DialogDescription>
                    {editingFb ? 'Update your fixed budget.' : 'Set up a new monthly fixed budget.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFbSubmit} className="space-y-4">
                  <div>
                    <Label>Month</Label>
                    <Input
                      type="month"
                      value={fbForm.month}
                      onChange={e => setFbForm({ ...fbForm, month: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Total Budget (₹)</Label>
                    <Input
                      type="number"
                      value={fbForm.totalBudget}
                      onChange={e => setFbForm({ ...fbForm, totalBudget: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={fbForm.notes}
                      onChange={e => setFbForm({ ...fbForm, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingFb ? 'Update' : 'Create'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Budgets */}
          <div className="space-y-4">
            {fixedBudgets.map(budget => {
              const expenses = fixedExpenses.filter(fe => fe.fixedBudgetId === budget.id);
              const totalAllocated = expenses.reduce((sum, e) => sum + e.allocatedAmount, 0);
              const totalSpent = expenses.reduce((sum, e) => sum + e.spentAmount, 0);
              const remaining = budget.totalBudget - totalSpent;

              return (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{budget.month}</CardTitle>
                        <p className="text-sm text-muted-foreground">Total Budget: ₹{budget.totalBudget.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">Add Expense</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Fixed Expense</DialogTitle>
                              <DialogDescription>
                                Add an expense category to this fixed budget.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleFeSubmit} className="space-y-4">
                              <input type="hidden" value={budget.id} onChange={e => setFeForm({ ...feForm, fixedBudgetId: budget.id })} />
                              <div>
                                <Label>Category</Label>
                                <Input
                                  value={feForm.category}
                                  onChange={e => setFeForm({ ...feForm, category: e.target.value, fixedBudgetId: budget.id })}
                                  required
                                />
                              </div>
                              <div>
                                <Label>Allocated Amount (₹)</Label>
                                <Input
                                  type="number"
                                  value={feForm.allocatedAmount}
                                  onChange={e => setFeForm({ ...feForm, allocatedAmount: parseFloat(e.target.value) || 0 })}
                                  required
                                />
                              </div>
                              <div>
                                <Label>Spent Amount (₹)</Label>
                                <Input
                                  type="number"
                                  value={feForm.spentAmount}
                                  onChange={e => setFeForm({ ...feForm, spentAmount: parseFloat(e.target.value) || 0 })}
                                />
                              </div>
                              <div>
                                <Label>Notes</Label>
                                <Textarea
                                  value={feForm.notes}
                                  onChange={e => setFeForm({ ...feForm, notes: e.target.value })}
                                  rows={2}
                                />
                              </div>
                              <Button type="submit" className="w-full">Add Expense</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Delete this budget?')) {
                              setFixedBudgets(fixedBudgets.filter(f => f.id !== budget.id));
                              setFixedExpenses(fixedExpenses.filter(fe => fe.fixedBudgetId !== budget.id));
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-lg">₹{budget.totalBudget.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Spent</div>
                        <div className="text-lg text-red-600">₹{totalSpent.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Remaining</div>
                        <div className="text-lg text-green-600">₹{remaining.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Expense breakdown */}
                    {expenses.length > 0 && (
                      <div className="space-y-2">
                        <h4>Expenses</h4>
                        {expenses.map(expense => {
                          const expenseRemaining = expense.allocatedAmount - expense.spentAmount;
                          return (
                            <div key={expense.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                              <div className="flex-1">
                                <div>{expense.category}</div>
                                <div className="text-sm text-muted-foreground">
                                  Allocated: ₹{expense.allocatedAmount.toFixed(2)} | 
                                  Spent: ₹{expense.spentAmount.toFixed(2)} | 
                                  Remaining: ₹{expenseRemaining.toFixed(2)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Delete this expense?')) {
                                    setFixedExpenses(fixedExpenses.filter(fe => fe.id !== expense.id));
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {fixedBudgets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No fixed budgets yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}