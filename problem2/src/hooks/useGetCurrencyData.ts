import { API_ENDPOINT } from '@/constants/endpoints';
import useCurrencyStore from '@/stores/currency';
import type { Currency } from '@/types/currency';
import { uniqBy } from '@/utils/common';
import { fetcher } from '@/utils/fetcher';
import axios from 'axios';
import { useEffect } from 'react';

export const useGetCurrencyData = () => {
	const { setCurrencyData, setLastUpdate } = useCurrencyStore();

	const fetchCurrencyData = async (showSuccessToast: boolean = false) =>
		fetcher({
			callback: async () => {
				// Simulate a delay to mimic real-world API call
				await new Promise(resolve => setTimeout(resolve, 1500));

				return axios.get<Currency[]>(API_ENDPOINT.GET_CURRENCY);
			},
			successCallback: ({ data }) => {
				// Sort data by currency ascending and then by date in descending order
				const sortedData = data.sort((a, b) => {
					if (a.currency < b.currency) return -1;

					if (a.currency > b.currency) return 1;

					const dateA = new Date(a.date).getTime();
					const dateB = new Date(b.date).getTime();

					return dateB - dateA;
				});

				setCurrencyData(uniqBy(sortedData, 'currency'));
				setLastUpdate(new Date());
			},
			showToast: {
				failed: true,
				success: showSuccessToast,
			},
		});

	useEffect(() => {
		fetchCurrencyData();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- Just run once
	}, []);

	return {
		fetchCurrencyData,
	};
};
