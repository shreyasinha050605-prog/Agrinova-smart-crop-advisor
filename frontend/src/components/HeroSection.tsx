import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/context/LanguageContext";
import { tr } from "@/i18n/translations";

const HeroSection = () => {
  const { lang } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Smart farming landscape" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-6"
          >
            <Leaf className="text-primary-foreground" size={20} />
            <span className="text-primary-foreground/80 font-heading text-sm tracking-widest uppercase">
              AgriNova
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl font-heading font-bold text-primary-foreground leading-tight mb-6"
          >
            {tr("heroTitle", lang)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mb-10 font-body leading-relaxed"
          >
            {tr("heroSubtitle", lang)}
          </motion.p>

          <motion.a
            href="#recommend"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary font-heading font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            {tr("getRecommendation", lang)}
            <Leaf size={18} />
          </motion.a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
