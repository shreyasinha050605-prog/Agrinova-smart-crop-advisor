import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Thermometer, Droplets, CloudRain, FlaskConical, Sprout, Lightbulb } from "lucide-react";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const MOCK_RESULTS: Record<string, { crop: string; tip: string; fertilizer: string }> = {
  default: { crop: "Rice", tip: "Ensure proper water management and transplant seedlings at the right stage.", fertilizer: "DAP (Diammonium Phosphate) + Urea" },
  hot: { crop: "Millet", tip: "Millet thrives in hot, dry conditions. Minimal irrigation needed.", fertilizer: "Single Super Phosphate (SSP)" },
  wet: { crop: "Jute", tip: "Jute requires high humidity and heavy rainfall. Plant during monsoon.", fertilizer: "Muriate of Potash (MOP) + Urea" },
  cold: { crop: "Wheat", tip: "Sow wheat in early winter. Ensure 4-5 irrigations during the growth cycle.", fertilizer: "NPK 12:32:16" },
};

const CropRecommendation = () => {
  const [form, setForm] = useState({
    region: "", nitrogen: "", phosphorus: "", potassium: "",
    temperature: "", humidity: "", rainfall: "",
  });
  const [result, setResult] = useState<null | { crop: string; tip: string; fertilizer: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const temp = parseFloat(form.temperature) || 25;
      const humidity = parseFloat(form.humidity) || 60;
      let key = "default";
      if (temp > 35) key = "hot";
      else if (temp < 15) key = "cold";
      else if (humidity > 80 || parseFloat(form.rainfall) > 200) key = "wet";
      setResult(MOCK_RESULTS[key]);
      setLoading(false);
    }, 1500);
  };

  const isValid = form.region && form.nitrogen && form.phosphorus && form.potassium && form.temperature && form.humidity && form.rainfall;

  return (
    <section id="recommend" className="py-24 bg-cream">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-heading text-sm tracking-widest uppercase mb-4 block">
            Main Feature
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Crop Recommendation Tool
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter your soil and climate data below to get AI-powered crop suggestions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm"
        >
          {/* Region */}
          <div className="mb-6">
            <label className="block text-sm font-heading font-medium text-foreground mb-2">
              Region / State
            </label>
            <select
              value={form.region}
              onChange={(e) => handleChange("region", e.target.value)}
              className="w-full bg-muted text-foreground border border-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="">Select a state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Soil NPK */}
          <div className="mb-2">
            <span className="flex items-center gap-2 text-sm font-heading font-medium text-foreground mb-3">
              <FlaskConical size={16} className="text-primary" /> Soil Nutrients
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { key: "nitrogen", label: "N (Nitrogen)" },
              { key: "phosphorus", label: "P (Phosphorus)" },
              { key: "potassium", label: "K (Potassium)" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
                <input
                  type="number"
                  placeholder="mg/kg"
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full bg-muted text-foreground border border-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Climate */}
          <div className="mb-2">
            <span className="flex items-center gap-2 text-sm font-heading font-medium text-foreground mb-3">
              <CloudRain size={16} className="text-primary" /> Climate Data
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { key: "temperature", label: "Temperature", icon: Thermometer, unit: "°C" },
              { key: "humidity", label: "Humidity", icon: Droplets, unit: "%" },
              { key: "rainfall", label: "Rainfall", icon: CloudRain, unit: "mm" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
                <input
                  type="number"
                  placeholder={f.unit}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full bg-muted text-foreground border border-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handlePredict}
            disabled={!isValid || loading}
            className="w-full bg-primary text-primary-foreground font-heading font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                <Sprout size={20} />
                Predict Best Crop
              </>
            )}
          </button>

          {/* Result Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 gradient-result rounded-2xl p-6 border border-border overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Leaf className="text-primary" size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Recommended Crop</span>
                      <p className="text-2xl font-heading font-bold text-foreground">{result.crop}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="text-primary" size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Farming Tip</span>
                      <p className="text-foreground">{result.tip}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FlaskConical className="text-primary" size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Suggested Fertilizer</span>
                      <p className="text-foreground font-medium">{result.fertilizer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default CropRecommendation;
