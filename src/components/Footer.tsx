
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold text-primary">PrepYatra</span>
            <p className="text-gray-400 mt-2">Turn Hustle Into Hires</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://instagram.com/theboringeducation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/company/theboringeducation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">
            Built with ♥ by <span className="text-primary font-semibold">The Boring Education</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
