import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const quotes = [
  "Every great design starts with a spark.",
  "Be consistent more than you are intense.",
  "Small steps every day lead to big changes.",
  "Your future is created by what you do today.",
  "Progress, not perfection.",
  "The secret of getting ahead is getting started.",
  "Dream big. Start small. Act now.",
  "Your only limit is your mind.",
  "Make today so awesome, yesterday gets jealous.",
  "Believe you can and you're halfway there.",
];

export function MotivationalQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Get a random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-8 px-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground">Daily Motivation</span>
      </div>
      <p className="text-lg text-foreground/90 max-w-2xl mx-auto italic">
        "{quote}"
      </p>
    </motion.div>
  );
}
