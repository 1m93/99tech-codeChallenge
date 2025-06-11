import type { CurrencyStore } from '@/types/stores';
import { create } from 'zustand';

const useCurrencyStore = create<CurrencyStore>((set) => ({
	currencyData: [],
	lastUpdate: null,

	setCurrencyData: (data) => set({ currencyData: data }),
	setLastUpdate: (date) => set({ lastUpdate: date }),
}));

export default useCurrencyStore;
