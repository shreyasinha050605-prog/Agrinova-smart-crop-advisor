import { useCallback } from "react";
import { SupportedLanguage } from "@/context/LanguageContext";

const LOCALE_BY_LANG: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  bn: "bn-IN",
  mr: "mr-IN",
};

const LOCALE_FALLBACK_BY_LANG: Partial<Record<SupportedLanguage, string[]>> = {
  mr: ["hi-IN", "en-IN"],
  hi: ["mr-IN", "en-IN"],
  ta: ["en-IN"],
  te: ["en-IN"],
  kn: ["en-IN"],
  bn: ["en-IN"],
};

export const useSpeechSynthesis = () => {
  const speak = useCallback(
    (text: string, lang: SupportedLanguage): Promise<void> =>
      new Promise((resolve) => {
        if (!("speechSynthesis" in window) || !text) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const targetLocale = LOCALE_BY_LANG[lang];
        const voices = window.speechSynthesis.getVoices();
        const localeCandidates = [targetLocale, ...(LOCALE_FALLBACK_BY_LANG[lang] ?? [])];
        let matchedVoice: SpeechSynthesisVoice | undefined;

        for (const locale of localeCandidates) {
          matchedVoice =
            voices.find((voice) => voice.lang?.toLowerCase() === locale.toLowerCase()) ||
            voices.find((voice) => voice.lang?.toLowerCase().startsWith(locale.split("-")[0].toLowerCase()));
          if (matchedVoice) break;
        }
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang || targetLocale;
        } else {
          utterance.lang = targetLocale;
        }
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      }),
    [],
  );

  return { speak };
};
