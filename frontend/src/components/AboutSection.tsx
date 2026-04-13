import { motion } from "framer-motion";
import { Brain, Sprout, BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { tr } from "@/i18n/translations";

const AboutSection = () => {
  const { lang } = useLanguage();
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-primary font-heading text-sm tracking-widest uppercase mb-4 block">
            {tr("about", lang)}
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {tr("aboutTitle", lang)}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            {tr("aboutSubtitle", lang)}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Brain, label: tr("mlPowered", lang), desc: tr("mlPoweredDesc", lang) },
            { icon: Sprout, label: tr("cropOptimized", lang), desc: tr("cropOptimizedDesc", lang) },
            { icon: BarChart3, label: tr("dataDriven", lang), desc: tr("dataDrivenDesc", lang) },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="gradient-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-accent-foreground" size={24} />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{item.label}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
