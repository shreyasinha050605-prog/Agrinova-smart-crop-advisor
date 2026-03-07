import { motion } from "framer-motion";
import { Brain, CloudSun, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Crop Recommendation",
    desc: "Uses machine learning to analyze soil nutrients and environmental conditions for precise crop suggestions.",
  },
  {
    icon: CloudSun,
    title: "Climate-Aware Insights",
    desc: "Integrates rainfall and temperature data for region-aware suggestions tailored to your local climate.",
  },
  {
    icon: Users,
    title: "Farmer-Friendly Interface",
    desc: "Simple, intuitive design that allows farmers to quickly input data and get reliable crop guidance.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-heading text-sm tracking-widest uppercase mb-4 block">
            Why AgriNova
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            Key Features
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="text-accent-foreground" size={28} />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
