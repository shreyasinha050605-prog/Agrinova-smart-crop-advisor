import { Leaf, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-forest py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="text-accent" size={22} />
            <span className="font-heading font-bold text-primary-foreground text-lg">AgriNova</span>
            <span className="text-primary-foreground/50 text-sm ml-2">— AI for Sustainable Farming</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-primary-foreground/60 text-sm font-body">Hackathon Project</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/60 hover:text-accent transition-colors duration-200"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-primary-foreground/40 text-sm font-body">
            © 2026 AgriNova. Built with 🌱 for smarter farming.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
