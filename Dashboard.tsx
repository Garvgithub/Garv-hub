import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckSquare, DollarSign, TrendingUp, Lightbulb, Wallet, CreditCard, Film, Heart } from 'lucide-react';

export function Dashboard() {
  const { tasks, expenses, habits, notes, notFixedBudget, fixedBudgets, fixedExpenses, stories, shayaris } = useData();

  // Calculate metrics
  const openTasks = tasks.filter(t => t.status !== 'Done').length;
  
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = expenses
    .filter(e => e.date.startsWith(thisMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const topHabitStreak = Math.max(...habits.map(h => h.streak), 0);
  
  const latestThought = notes
    .filter(n => n.tags.includes('thought'))
    .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())[0];

  const totalIncome = notFixedBudget.filter(n => n.type === 'Income').reduce((sum, n) => sum + n.amount, 0);
  const totalExpense = notFixedBudget.filter(n => n.type === 'Expense').reduce((sum, n) => sum + n.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const latestFixedBudget = fixedBudgets[fixedBudgets.length - 1];
  const fixedBudgetRemaining = latestFixedBudget 
    ? latestFixedBudget.totalBudget - fixedExpenses
        .filter(fe => fe.fixedBudgetId === latestFixedBudget.id)
        .reduce((sum, fe) => sum + fe.spentAmount, 0)
    : 0;

  const storiesInProgress = stories.filter(s => s.status === 'In Progress').length;
  const storiesCompleted = stories.filter(s => s.status === 'Completed').length;

  const totalShayaris = shayaris.length;

  // Budget Pie Chart Data
  const budgetData = [
    { name: 'Food', value: notFixedBudget.filter(n => n.category === 'Food' && n.type === 'Expense').reduce((s, n) => s + n.amount, 0) },
    { name: 'Academic', value: notFixedBudget.filter(n => n.category === 'Academic' && n.type === 'Expense').reduce((s, n) => s + n.amount, 0) },
    { name: 'Fuel', value: notFixedBudget.filter(n => n.category === 'Fuel' && n.type === 'Expense').reduce((s, n) => s + n.amount, 0) },
    { name: 'Personal Growth', value: notFixedBudget.filter(n => n.category === 'Personal Growth' && n.type === 'Expense').reduce((s, n) => s + n.amount, 0) },
    { name: 'Misc', value: notFixedBudget.filter(n => n.category === 'Misc' && n.type === 'Expense').reduce((s, n) => s + n.amount, 0) },
  ].filter(item => item.value > 0);

  // Income vs Expense Bar Chart
  const incomeExpenseData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
  ];

  // Stories by Genre
  const genreData = stories.reduce((acc, story) => {
    const existing = acc.find(item => item.name === story.genre);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: story.genre, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Habit Streak Data
  const habitStreakData = habits.filter(h => h.isActive).map(h => ({
    name: h.name,
    streak: h.streak,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="module-dashboard min-h-screen p-4 md:p-6 space-y-6 pb-24">
      <h1>Dashboard</h1>
      
      {/* Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Open Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{openTasks}</div>
          </CardContent>
        </Card>

        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Month Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{thisMonthExpenses.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Top Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{topHabitStreak} days</div>
          </CardContent>
        </Card>

        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Balance</CardTitle>
            <Wallet className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{currentBalance.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Fixed Budget</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₹{fixedBudgetRemaining.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Stories</CardTitle>
            <Film className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{storiesInProgress}/{storiesCompleted}</div>
          </CardContent>
        </Card>

        <Card className="calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Shayari</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalShayaris}</div>
          </CardContent>
        </Card>

        <Card className="col-span-2 calm-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Latest Thought</CardTitle>
            <Lightbulb className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-sm truncate">{latestThought?.title || 'No thoughts yet'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetData.length > 0 && (
          <Card className="calm-card">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={entry => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {incomeExpenseData.some(d => d.value > 0) && (
          <Card className="calm-card">
            <CardHeader>
              <CardTitle>Income vs Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#5A67FF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {genreData.length > 0 && (
          <Card className="calm-card">
            <CardHeader>
              <CardTitle>Stories by Genre</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={entry => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {habitStreakData.length > 0 && (
          <Card className="calm-card">
            <CardHeader>
              <CardTitle>Habit Streaks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={habitStreakData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="streak" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}