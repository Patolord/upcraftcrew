"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

import enMessages from "@/app/landing/messages/en.json";
import ptBRMessages from "@/app/landing/messages/pt-BR.json";

const messagesMap = {
	en: enMessages,
	"pt-BR": ptBRMessages,
} as const;

export type LandingLocale = keyof typeof messagesMap;
export type LandingMessages = (typeof messagesMap)[LandingLocale];

type LandingI18nContextValue = {
	locale: LandingLocale;
	messages: LandingMessages;
	switchLocale: (nextLocale: LandingLocale) => void;
};

const LandingI18nContext = createContext<LandingI18nContextValue | null>(null);

const STORAGE_KEY = "landing-locale";
const DEFAULT_LOCALE: LandingLocale = "pt-BR";

export const LandingI18nProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocale] = useState<LandingLocale>(DEFAULT_LOCALE);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const storedLocale = window.localStorage.getItem(STORAGE_KEY);
		if (storedLocale && storedLocale in messagesMap) {
			setLocale(storedLocale as LandingLocale);
		}
	}, []);

	const switchLocale = useCallback((nextLocale: LandingLocale) => {
		setLocale(nextLocale);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(STORAGE_KEY, nextLocale);
		}
	}, []);

	const value = useMemo<LandingI18nContextValue>(
		() => ({
			locale,
			messages: messagesMap[locale],
			switchLocale,
		}),
		[locale, switchLocale],
	);

	return (
		<LandingI18nContext.Provider value={value}>
			{children}
		</LandingI18nContext.Provider>
	);
};

export const useLandingI18n = () => {
	const context = useContext(LandingI18nContext);
	if (!context) {
		throw new Error("useLandingI18n must be used within LandingI18nProvider");
	}
	return context;
};

export const SUPPORTED_LANDING_LOCALES = Object.keys(
	messagesMap,
) as LandingLocale[];

