import type { Currency } from './currency';

export type LoadingStore = {
	loadingCount: number;
	loading: () => boolean;
	setLoading: (loading: boolean) => void;
	resetLoading: () => void;
};

export type CurrencyStore = {
	currencyData: Currency[];
	lastUpdate: Date | null;
	setCurrencyData: (data: Currency[]) => void;
	setLastUpdate: (date: Date | null) => void;
};
