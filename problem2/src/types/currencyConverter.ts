export type CurrencyConverterFormItem = {
	currency?: string;
	amount?: number;
};

export type CurrencyConverterForm = {
	convertItems: CurrencyConverterFormItem[];
};
