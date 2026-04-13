import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage, SupportedLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { CITY_ALIASES, STATE_ALIASES, STATE_CITY_MAP } from "@/data/locationData";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tr } from "@/i18n/translations";

type ChatMessage = {
  role: "system" | "user";
  text: string;
};
type VoiceStep = "language" | "state" | "city" | "nitrogen" | "phosphorus" | "potassium" | "done";

const LANGUAGE_NAMES: Record<SupportedLanguage, string[]> = {
  en: ["english"],
  hi: ["hindi", "हिंदी", "हिन्दी"],
  ta: ["tamil", "தமிழ்", "தமிழ் மொழி"],
  te: ["telugu", "తెలుగు", "తెలుగు భాష"],
  kn: ["kannada", "ಕನ್ನಡ", "ಕನ್ನಡ ಭಾಷೆ"],
  bn: ["bengali", "বাংলা", "বাংলা ভাষা"],
  mr: ["marathi", "मराठी"],
};

const VoiceAssistantPage = () => {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const { supported, isListening, listenOnce } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [form, setForm] = useState({
    region: "",
    city: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });
  const [result, setResult] = useState<null | {
    crop: string;
    cropType: string;
    tip: string;
    fertilizer: string;
    season: string;
    weatherAdvice: string;
    regionCrops: string[];
    aiCrops: string[];
    confidence: number;
    explanation: string;
    riskAlerts: string[];
    estimatedYield: number;
    marketSuggestion: { best_market_crop: string; reason: string } | null;
    schemes: string[];
  }>(null);
  const [running, setRunning] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [currentStep, setCurrentStep] = useState<VoiceStep>("language");
  const [retryTick, setRetryTick] = useState(0);
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(lang);
  const activeLangRef = useRef<SupportedLanguage>(lang);
  const stepInFlightRef = useRef(false);
  const isListeningRef = useRef(false);
  const askedStepRef = useRef<VoiceStep | null>(null);

  const pushMessage = (role: ChatMessage["role"], text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const detectLanguage = (spoken: string): SupportedLanguage | null => {
    const normalized = spoken.toLowerCase();
    if (normalized.includes("hindi") || normalized.includes("हिंदी") || normalized.includes("हिन्दी")) return "hi";
    if (normalized.includes("english")) return "en";
    if (normalized.includes("tamil") || normalized.includes("தமிழ்")) return "ta";
    if (normalized.includes("telugu") || normalized.includes("తెలుగు")) return "te";
    if (normalized.includes("kannada") || normalized.includes("ಕನ್ನಡ")) return "kn";
    if (normalized.includes("bengali") || normalized.includes("বাংলা")) return "bn";
    if (normalized.includes("marathi") || normalized.includes("मराठी")) return "mr";
    const langs = Object.keys(LANGUAGE_NAMES) as SupportedLanguage[];
    for (const code of langs) {
      if (LANGUAGE_NAMES[code].some((name) => normalized.includes(name.toLowerCase()))) return code;
    }
    return null;
  };

  const normalizeState = (spoken: string): string | null => {
    const clean = spoken.trim();
    if (STATE_ALIASES[clean]) return STATE_ALIASES[clean];
    const normalizedMap: Record<string, string> = {
      "राजस्थान": "Rajasthan",
      "बिहार": "Bihar",
      "महाराष्ट्र": "Maharashtra",
      "तमिल नाडु": "Tamil Nadu",
      "तमिलनाडु": "Tamil Nadu",
      "अरुणाचल प्रदेश": "Arunachal Pradesh",
      "उत्तर प्रदेश": "Uttar Pradesh",
      "पश्चिम बंगाल": "West Bengal",
    };
    if (normalizedMap[clean]) return normalizedMap[clean];
    const lower = clean.toLowerCase();
    return Object.keys(STATE_CITY_MAP).find((state) => state.toLowerCase() === lower || state.toLowerCase().includes(lower)) ?? null;
  };

  const normalizeCity = (spoken: string, state: string): string | null => {
    const cleaned = spoken.trim().replace(/[.,!?]/g, "");
    const cleanedLower = cleaned.toLowerCase();

    const directAlias = CITY_ALIASES[cleaned] ?? CITY_ALIASES[cleanedLower];
    if (directAlias) {
      const mapped = directAlias;
      return (STATE_CITY_MAP[state] ?? []).includes(mapped) ? mapped : null;
    }

    const lower = cleanedLower;
    return (STATE_CITY_MAP[state] ?? []).find((city) => {
      const cityLower = city.toLowerCase();
      return cityLower === lower || cityLower.includes(lower) || lower.includes(cityLower);
    }) ?? null;
  };

  const getNumber = (spoken: string): string => {
    const match = spoken.match(/-?\d+(\.\d+)?/);
    return match ? match[0] : "";
  };

  const askAndListen = async (prompt: string, speechLang: SupportedLanguage): Promise<string> => {
    if (stepInFlightRef.current || isListeningRef.current) {
      throw new Error("Voice step already in progress");
    }
    stepInFlightRef.current = true;
    pushMessage("system", prompt);
    await speak(prompt, speechLang);
    isListeningRef.current = true;
    try {
      const spoken = await listenOnce(speechLang);
      if (!spoken.trim()) {
        throw new Error("No speech detected");
      }
      pushMessage("user", spoken);
      return spoken;
    } finally {
      isListeningRef.current = false;
      stepInFlightRef.current = false;
    }
  };

  const retryCurrentStep = async (message: string, speechLang: SupportedLanguage) => {
    pushMessage("system", message);
    await speak(message, speechLang);
    askedStepRef.current = null;
    setRetryTick((prev) => prev + 1);
  };

  const fetchWeather = async (city: string, state: string) => {
    const response = await fetch(`http://127.0.0.1:8000/weather/${encodeURIComponent(city)}?state=${encodeURIComponent(state)}`);
    const data = await response.json();
    return {
      temperature: String(data.temperature ?? ""),
      humidity: String(data.humidity ?? ""),
      rainfall: String(data.rainfall ?? ""),
    };
  };

  const handleSpeechResult = async (step: VoiceStep, transcript: string) => {
    if (step === "language") {
      const selectedLanguage = detectLanguage(transcript);
      if (!selectedLanguage) {
        await retryCurrentStep(tr("didntUnderstandRepeat", activeLangRef.current), activeLangRef.current);
        return;
      }
      setLang(selectedLanguage);
      setActiveLang(selectedLanguage);
      activeLangRef.current = selectedLanguage;
      setCurrentStep("state");
      askedStepRef.current = null;
      return;
    }

    if (step === "state") {
      const state = normalizeState(transcript);
      if (!state) {
        await retryCurrentStep(tr("stateNotRecognized", activeLangRef.current), activeLangRef.current);
        return;
      }
      setForm((prev) => ({ ...prev, region: state, city: "", temperature: "", humidity: "", rainfall: "" }));
      setCurrentStep("city");
      askedStepRef.current = null;
      return;
    }

    if (step === "city") {
      const city = normalizeCity(transcript, form.region);
      if (!city) {
        await retryCurrentStep(tr("didntUnderstandRepeat", activeLangRef.current), activeLangRef.current);
        return;
      }
      const climate = await fetchWeather(city, form.region);
      setForm((prev) => ({ ...prev, city, temperature: climate.temperature, humidity: climate.humidity, rainfall: climate.rainfall }));
      setCurrentStep("nitrogen");
      askedStepRef.current = null;
      return;
    }

    if (step === "nitrogen") {
      const value = getNumber(transcript);
      if (!value) {
        await retryCurrentStep(tr("didntUnderstandRepeat", activeLangRef.current), activeLangRef.current);
        return;
      }
      setForm((prev) => ({ ...prev, nitrogen: value }));
      setCurrentStep("phosphorus");
      askedStepRef.current = null;
      return;
    }

    if (step === "phosphorus") {
      const value = getNumber(transcript);
      if (!value) {
        await retryCurrentStep(tr("didntUnderstandRepeat", activeLangRef.current), activeLangRef.current);
        return;
      }
      setForm((prev) => ({ ...prev, phosphorus: value }));
      setCurrentStep("potassium");
      askedStepRef.current = null;
      return;
    }

    if (step === "potassium") {
      const value = getNumber(transcript);
      if (!value) {
        await retryCurrentStep(tr("didntUnderstandRepeat", activeLangRef.current), activeLangRef.current);
        return;
      }
      setForm((prev) => ({ ...prev, potassium: value }));
      setCurrentStep("done");
      askedStepRef.current = null;
    }
  };

  const startVoiceFlow = async () => {
    setRunning(true);
    setErrorText("");
    setMessages([]);
    setResult(null);
    setCurrentStep("language");
    setActiveLang(lang);
    activeLangRef.current = lang;
    askedStepRef.current = null;
    setRetryTick(0);
    stepInFlightRef.current = false;
    isListeningRef.current = false;
    setForm({
      region: "",
      city: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      temperature: "",
      humidity: "",
      rainfall: "",
    });
  };

  useEffect(() => {
    if (!running) return;
    if (askedStepRef.current === currentStep) return;
    askedStepRef.current = currentStep;
    if (!isListeningRef.current) {
      stepInFlightRef.current = false;
    }
    console.log("Current Step:", currentStep);

    let cancelled = false;

    const runStep = async () => {
      try {
        const currentLang = activeLangRef.current;

        if (currentStep === "done") {
          const predictRes = await fetch("http://127.0.0.1:8000/predict", {
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
              lang: currentLang,
            }),
          });
          const prediction = await predictRes.json();
          if (cancelled) return;
          const nextResult = {
            crop: String(prediction.recommended_crop ?? ""),
            cropType: String(prediction.crop_type ?? ""),
            tip: String(prediction.tip ?? prediction.farming_tip ?? ""),
            fertilizer: String(prediction.fertilizer ?? ""),
            season: String(prediction.season ?? ""),
            weatherAdvice: String(prediction.weather_advice ?? ""),
            regionCrops: Array.isArray(prediction.top_state_crops) ? prediction.top_state_crops : [],
            aiCrops: Array.isArray(prediction.top_ai_crops) ? prediction.top_ai_crops : [],
            confidence: Number(prediction.confidence ?? 0),
            explanation: String(prediction.explanation ?? ""),
            riskAlerts: Array.isArray(prediction.risk_alerts) ? prediction.risk_alerts : [],
            estimatedYield: Number(prediction.estimated_yield ?? 0),
            marketSuggestion: prediction.market_suggestion ?? null,
            schemes: Array.isArray(prediction.schemes) ? prediction.schemes : [],
          };
          setResult(nextResult);
          pushMessage("system", `${tr("resultReadPrefix", currentLang)} ${nextResult.crop}`);
          await speak(`${tr("resultReadPrefix", currentLang)} ${nextResult.crop}`, currentLang);
          if (!cancelled) setRunning(false);
          return;
        }

        const prompts: Record<Exclude<VoiceStep, "done">, string> = {
          language: t("askPreferredLanguage"),
          state: tr("askState", currentLang),
          city: tr("askCity", currentLang),
          nitrogen: tr("askNitrogen", currentLang),
          phosphorus: tr("askPhosphorus", currentLang),
          potassium: tr("askPotassium", currentLang),
        };

        const prompt = prompts[currentStep as Exclude<VoiceStep, "done">];
        if (!prompt) return;
        const spoken = await askAndListen(prompt, currentLang);
        if (cancelled) return;
        await handleSpeechResult(currentStep, spoken);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Voice flow failed";
        if (
          message.includes("timeout") ||
          message.includes("ended without result") ||
          message.includes("Speech recognition failed")
        ) {
          await retryCurrentStep(tr("didntUnderstandRepeat", activeLangRef.current), activeLangRef.current);
          return;
        }
        setErrorText(message);
        pushMessage("system", message);
        setRunning(false);
      }
    };

    void runStep();
    return () => {
      cancelled = true;
    };
  }, [running, currentStep, form.region, retryTick, t]);

  const readAloud = () => {
    if (!result) return;
    const script = [
      `${t("recommendedCrop")}: ${result.crop}${result.cropType ? ` (${result.cropType})` : ""}.`,
      `${t("suggestedFertilizer")}: ${result.fertilizer}.`,
      `${t("bestSeason")}: ${result.season}.`,
      `${t("farmingAdvice")}: ${result.tip}.`,
      `${t("weatherInsight")}: ${result.weatherAdvice}.`,
      `${t("commonCropsIn")} ${form.region}: ${result.regionCrops.join(", ")}.`,
      `${t("topAiCropSuggestions")}: ${result.aiCrops.join(", ")}.`,
      `Confidence: ${result.confidence} percent.`,
      `Explanation: ${result.explanation}.`,
      `Risk Alerts: ${result.riskAlerts.length ? result.riskAlerts.join(", ") : "None"}.`,
      `Estimated Yield: ${result.estimatedYield}.`,
      `Market Suggestion: ${result.marketSuggestion ? `${result.marketSuggestion.best_market_crop} ${result.marketSuggestion.reason}` : "Not available"}.`,
      `Schemes: ${result.schemes.length ? result.schemes.join(", ") : "Not available"}.`,
    ].join(" ");
    void speak(script, lang);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-24 bg-cream">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">{t("voicePageTitle")}</h1>
            <p className="text-muted-foreground">{t("voicePageSubtitle")}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <button
              onClick={startVoiceFlow}
              disabled={!supported || running}
              className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl disabled:opacity-40"
            >
              {running ? t("interviewInProgress") : t("startVoiceInterview")}
            </button>

            {!supported && <p className="text-sm text-amber-600">{t("voiceNotSupported")}</p>}
            {isListening && <p className="text-sm text-primary">🎤 {t("listening")}</p>}
            <p className="text-xs text-muted-foreground">Step: {currentStep}</p>
            {errorText && <p className="text-sm text-red-500">{errorText}</p>}

            <div className="max-h-80 overflow-auto space-y-2 bg-muted rounded-xl p-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`text-sm p-3 rounded-lg ${
                      message.role === "system" ? "bg-background border border-border" : "bg-primary/10"
                    }`}
                  >
                    {message.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold">{t("state")}:</span> {form.region || "-"}</div>
              <div><span className="font-semibold">{t("city")}:</span> {form.city || "-"}</div>
              <div><span className="font-semibold">N:</span> {form.nitrogen || "-"}</div>
              <div><span className="font-semibold">P:</span> {form.phosphorus || "-"}</div>
              <div><span className="font-semibold">K:</span> {form.potassium || "-"}</div>
              <div><span className="font-semibold">{t("temperature")}:</span> {form.temperature || "-"}</div>
            </div>

            {result && (
              <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                <p><span className="font-semibold">{t("recommendedCrop")}:</span> {result.crop}{result.cropType ? ` (${result.cropType})` : ""}</p>
                <p><span className="font-semibold">{t("suggestedFertilizer")}:</span> {result.fertilizer}</p>
                <p><span className="font-semibold">{t("bestSeason")}:</span> {result.season}</p>
                <p><span className="font-semibold">{t("farmingAdvice")}:</span> {result.tip}</p>
                <p><span className="font-semibold">{t("weatherInsight")}:</span> {result.weatherAdvice}</p>
                <p><span className="font-semibold">{t("commonCropsIn")} {form.region}:</span> {result.regionCrops.join(", ")}</p>
                <p><span className="font-semibold">{t("topAiCropSuggestions")}:</span> {result.aiCrops.join(", ")}</p>
                <p><span className="font-semibold">Confidence:</span> {result.confidence}%</p>
                <p><span className="font-semibold">Explanation:</span> {result.explanation}</p>
                <p><span className="font-semibold">Risk Alerts:</span> {result.riskAlerts.length ? result.riskAlerts.join(", ") : "None"}</p>
                <p><span className="font-semibold">Estimated Yield:</span> {result.estimatedYield}</p>
                <p><span className="font-semibold">Market Suggestion:</span> {result.marketSuggestion ? `${result.marketSuggestion.best_market_crop} (${result.marketSuggestion.reason})` : "N/A"}</p>
                <p><span className="font-semibold">Schemes:</span> {result.schemes.length ? result.schemes.join(", ") : "N/A"}</p>
                <button
                  onClick={readAloud}
                  className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-xl"
                >
                  {t("readAloud")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default VoiceAssistantPage;
