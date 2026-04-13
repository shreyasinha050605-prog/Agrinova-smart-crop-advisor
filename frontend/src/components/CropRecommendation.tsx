import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Thermometer, Droplets, CloudRain, FlaskConical, Sprout, Lightbulb } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { STATE_CITY_MAP } from "@/data/locationData";

const CropRecommendation = () => {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    region: "", city: "", nitrogen: "", phosphorus: "", potassium: "",
    temperature: "", humidity: "", rainfall: "",
  });
  const [result, setResult] = useState<null | {
    crop: string
    cropType: string
    tip: string
    fertilizer: string
    season: string
    weatherAdvice: string
    regionCrops: string[]
    aiCrops: string[]
  }>(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherNotice, setWeatherNotice] = useState("");
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const fetchWeather = async (city: string, state: string) => {
    setForm((prev) => ({
      ...prev,
      city,
      ...(city ? {} : { temperature: "", humidity: "", rainfall: "" }),
    }));
    setWeatherNotice("");

    if (!city) return;

    try {
      setWeatherLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/weather/${encodeURIComponent(city)}?state=${encodeURIComponent(state)}`);
      if (!res.ok) {
        throw new Error(`Weather request failed with status ${res.status}`);
      }

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        temperature: data.temperature !== null && data.temperature !== undefined ? String(data.temperature) : "",
        humidity: data.humidity !== null && data.humidity !== undefined ? String(data.humidity) : "",
        rainfall: data.rainfall !== null && data.rainfall !== undefined ? String(data.rainfall) : ""
      }));

      if (data.source === "fallback") {
        setWeatherNotice(t("usingEstimatedClimate"));
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeatherNotice(t("usingEstimatedClimate"));
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleStateChange = (region: string) => {
    setForm((prev) => ({
      ...prev,
      region,
      city: "",
      temperature: "",
      humidity: "",
      rainfall: "",
    }));
    setWeatherNotice("");
  };

  const handleCityChange = (city: string) => {
    void fetchWeather(city, form.region);
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(form.nitrogen),
          P: Number(form.phosphorus),
          K: Number(form.potassium),
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          rainfall: Number(form.rainfall),
          region: form.region,
          lang,
        }),
      });
      const data = await response.json();
      setResult({
        crop: String(data.recommended_crop ?? ""),
        cropType: String(data.crop_type ?? ""),
        tip: String(data.tip ?? data.farming_tip ?? ""),
        fertilizer: String(data.fertilizer ?? ""),
        season: String(data.season ?? ""),
        weatherAdvice: String(data.weather_advice ?? ""),
        regionCrops: Array.isArray(data.top_state_crops) ? data.top_state_crops : [],
        aiCrops: Array.isArray(data.top_ai_crops) ? data.top_ai_crops : [],
      });
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cityOptions = form.region ? STATE_CITY_MAP[form.region] ?? [] : [];
  const isValid = form.region && form.city && form.nitrogen && form.phosphorus && form.potassium && form.temperature && form.humidity && form.rainfall;

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
            {t("mainFeature")}
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {t("cropTool")}
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
              {t("state")}
            </label>
            <select
              value={form.region}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-muted text-foreground border border-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="">{t("selectState")}</option>
              {Object.keys(STATE_CITY_MAP).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {weatherLoading && (
              <p className="text-xs text-muted-foreground mt-2">{t("fetchingClimate")}</p>
            )}
            {weatherNotice && (
              <p className="text-xs text-amber-600 mt-2">{weatherNotice}</p>
            )}
          </div>

          {/* City */}
          <div className="mb-6">
            <label className="block text-sm font-heading font-medium text-foreground mb-2">
              {t("city")}
            </label>
            <select
              value={form.city}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!form.region}
              className="w-full bg-muted text-foreground border border-border rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{form.region ? t("selectCity") : t("selectStateFirst")}</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Soil NPK */}
          <div className="mb-2">
            <span className="flex items-center gap-2 text-sm font-heading font-medium text-foreground mb-3">
              <FlaskConical size={16} className="text-primary" /> {t("soilNutrients")}
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
              <CloudRain size={16} className="text-primary" /> {t("climateData")}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { key: "temperature", label: t("temperature"), icon: Thermometer, unit: "°C" },
              { key: "humidity", label: t("humidity"), icon: Droplets, unit: "%" },
              { key: "rainfall", label: t("rainfallMonthly"), icon: CloudRain, unit: "mm/month" },
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
                {t("predictBestCrop")}
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
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("recommendedCrop")}
                      </span>

                      <p className="text-2xl font-heading font-bold text-foreground">
                        {result.crop} ({result.cropType})
                      </p>
                    </div>
                  </div>

                  {/* Suggested Fertilizer */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FlaskConical className="text-primary" size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("suggestedFertilizer")}
                      </span>
                      <p className="text-foreground font-medium">{result.fertilizer}</p>
                    </div>
                  </div>

                  {/* Best Season */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sprout className="text-primary" size={20} />
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("bestSeason")}
                      </span>

                      <p className="text-foreground font-medium">
                        {result.season}
                      </p>
                    </div>
                  </div>

                  {/* Farming Advice */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="text-primary" size={20} />
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("farmingAdvice")}
                      </span>

                      <p className="text-foreground">
                        {result.tip}
                      </p>
                    </div>
                  </div>

                  {/* Weather Insight */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CloudRain className="text-primary" size={20} />
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("weatherInsight")}
                      </span>

                      <p className="text-foreground">
                        {result.weatherAdvice}
                      </p>
                    </div>
                  </div>

                  {/* Common Crops in Region */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Leaf className="text-primary" size={20} />
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("commonCropsIn")} {form.region}
                      </span>

                      <ul className="text-foreground font-medium list-disc ml-4 mt-1">
                        {result.regionCrops?.map((crop) => (
                          <li key={crop}>{crop}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Crop Suggestions */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sprout className="text-primary" size={20} />
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
                        {t("topAiCropSuggestions")}
                      </span>

                      <ul className="text-foreground font-medium list-disc ml-4 mt-1">
                        {result.aiCrops?.map((crop) => (
                          <li key={crop}>
                            {crop.charAt(0).toUpperCase() + crop.slice(1)}
                          </li>
                        ))}
                      </ul>
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
