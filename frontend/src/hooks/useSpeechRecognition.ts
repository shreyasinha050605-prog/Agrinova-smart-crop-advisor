import { useCallback, useMemo, useState } from "react";
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

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognitionImpl = useMemo(() => {
    const w = window as Window & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };
    return w.SpeechRecognition || w.webkitSpeechRecognition;
  }, []);

  const supported = Boolean(SpeechRecognitionImpl);

  const listenOnce = useCallback(
    (lang: SupportedLanguage): Promise<string> =>
      new Promise((resolve, reject) => {
        if (!SpeechRecognitionImpl) {
          reject(new Error("Speech recognition not supported"));
          return;
        }

        const rec = new SpeechRecognitionImpl();
        let settled = false;
        let hasResult = false;
        const timeoutId = window.setTimeout(() => {
          if (settled) return;
          settled = true;
          setIsListening(false);
          try {
            rec.stop();
          } catch {
            // ignore stop failures
          }
          reject(new Error("Speech recognition timeout"));
        }, 10000);

        const finish = (handler: () => void) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          setIsListening(false);
          handler();
        };

        rec.lang = LOCALE_BY_LANG[lang];
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        setIsListening(true);
        rec.onresult = (event: SpeechRecognitionEvent) => {
          hasResult = true;
          finish(() => resolve(event.results?.[0]?.[0]?.transcript?.trim() ?? ""));
        };
        rec.onerror = () => {
          finish(() => reject(new Error("Speech recognition failed")));
        };
        rec.onend = () => {
          if (hasResult) return;
          finish(() => reject(new Error("Speech recognition ended without result")));
        };
        rec.start();
      }),
    [SpeechRecognitionImpl],
  );

  return { supported, isListening, listenOnce };
};
