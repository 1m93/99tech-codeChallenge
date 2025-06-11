/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Currency } from '@/types/currency';
import { twMerge } from 'tailwind-merge';

export const mergeClasses = (
	...classes: (
		| string
		| undefined
		| null
		| Record<string, string | number | null | undefined | boolean>
	)[]
) => {
	return twMerge(
		...classes.map((cls) => {
			if (typeof cls === 'string') {
				return cls;
			} else if (typeof cls === 'object' && cls != null) {
				return Object.entries(cls)
					.filter(([_, value]) => value)
					.map(([key, _]) => key)
					.join(' ');
			}

			return '';
		})
	);
};

export const uniqBy = <T, K extends keyof T>(arr: T[], key: K) => {
	const seen = new Set();

	return arr.filter((item) => {
		const value = item[key];

		if (seen.has(value)) {
			return false;
		}

		seen.add(value);

		return true;
	});
};

export const getCurrencyOptionValue = (data: Currency) =>
	`${data.currency}*|*${data.price}`;

export const getFullDate = (date: Date) =>
	date
		.toISOString()
		.replace('T', ' ')
		.replace(/\.\d{3}Z$/, '')
		.replace(/-/g, '/');
