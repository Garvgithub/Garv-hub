import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer-credit mt-12 mb-20">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span>Built with</span>
        <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
        <span>by</span>
        <span className="font-medium text-foreground">Garv Jain</span>
      </div>
      <div>
        <a 
          href="https://linktr.ee/gaarrvvaa" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1"
        >
          linktr.ee/gaarrvvaa
        </a>
      </div>
    </footer>
  );
}
