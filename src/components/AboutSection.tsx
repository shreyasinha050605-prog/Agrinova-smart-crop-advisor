import { motion } from "framer-motion";
import { Brain, Sprout, BarChart3 } from "lucide-react";

const AboutSection = () => {
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
            About the Platform
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Smarter Farming with <span className="text-gradient">AI & Data</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            AgriNova uses machine learning and agricultural data to recommend the most suitable crops
            based on soil nutrients, climate, and regional conditions. It helps farmers make smarter
            and more sustainable farming decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Brain, label: "ML-Powered", desc: "Advanced algorithms analyze complex agricultural data" },
            { icon: Sprout, label: "Crop Optimized", desc: "Tailored recommendations for your specific soil" },
            { icon: BarChart3, label: "Data-Driven", desc: "Backed by real climate and nutrient datasets" },
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
