import type { LoadingStore } from '@/types/stores';
import { create } from 'zustand';

const useLoadingStore = create<LoadingStore>((set) => ({
	loadingCount: 0,

	loading: (): boolean => useLoadingStore.getState().loadingCount > 0,

	setLoading: (loading) =>
		set((state) => ({
			loadingCount: loading
				? state.loadingCount + 1
				: Math.max(state.loadingCount - 1, 0),
		})),

	resetLoading: () => set({ loadingCount: 0 }),
}));

export default useLoadingStore;
