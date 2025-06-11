import Select, {
	type SelectOption,
	type SelectProps,
} from '@/components/atoms/Select';
import useCurrencyStore from '@/stores/currency';
import { getCurrencyOptionValue } from '@/utils/common';
import { useMemo } from 'react';

const CurrencySelect: React.FC<Omit<SelectProps, 'options'>> = (props) => {
	const { currencyData } = useCurrencyStore();

	const currencyOptions = useMemo(
		(): SelectOption[] =>
			currencyData.map((item) => ({
				label: item.currency,
				value: getCurrencyOptionValue(item),
				icon: (
					<img
						src={`/src/assets/tokens/${item.currency}.svg`}
						alt={item.currency}
						width={20}
						height={20}
					/>
				),
			})),
		[currencyData]
	);

	return <Select {...props} options={currencyOptions} />;
};

export default CurrencySelect;
