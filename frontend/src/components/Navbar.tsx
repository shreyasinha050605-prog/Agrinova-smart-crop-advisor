import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-card/90 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <Leaf className={scrolled ? "text-primary" : "text-primary-foreground"} size={22} />
          <span className={`font-heading font-bold text-lg ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
            AgriNova
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {["About", "Recommend", "Features"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-heading transition-colors duration-200 ${
                scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="#recommend"
          className={`text-sm font-heading font-semibold px-5 py-2 rounded-full transition-all duration-200 ${
            scrolled
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30"
          }`}
        >
          Try Now
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
