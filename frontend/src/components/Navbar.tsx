import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, SupportedLanguage } from "@/context/LanguageContext";
import { tr } from "@/i18n/translations";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();
  const location = useLocation();

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
        <Link to="/" className="flex items-center gap-2">
          <Leaf className={scrolled ? "text-primary" : "text-primary-foreground"} size={22} />
          <span className={`font-heading font-bold text-lg ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
            AgriNova
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[tr("about", lang), tr("recommend", lang), tr("features", lang)].map((item, idx) => (
            <a
              key={item}
              href={`#${["about", "recommend", "features"][idx]}`}
              className={`text-sm font-heading transition-colors duration-200 ${
                scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {item}
            </a>
          ))}
          <Link
            to={location.pathname === "/voice" ? "/" : "/voice"}
            className={`text-sm font-heading transition-colors duration-200 ${
              scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
            }`}
          >
            {tr("voiceAssistant", lang)}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as SupportedLanguage)}
            className={`text-xs rounded-full px-3 py-2 border ${
              scrolled
                ? "bg-background text-foreground border-border"
                : "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
            }`}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="ta">TA</option>
            <option value="te">TE</option>
            <option value="kn">KN</option>
            <option value="bn">BN</option>
            <option value="mr">MR</option>
          </select>
          <a
            href="#recommend"
            className={`text-sm font-heading font-semibold px-5 py-2 rounded-full transition-all duration-200 ${
              scrolled
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30"
            }`}
          >
            {tr("tryNow", lang)}
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
