import { useGetCurrencyData } from '@/hooks/useGetCurrencyData';
import { useFieldArray, useForm } from 'react-hook-form';
import type { CurrencyConverterForm } from '@/types/currencyConverter';
import useCurrencyStore from '@/stores/currency';
import CurrencyFormItem from '@/components/molecules/CurrencyFormItem';
import { useEffect } from 'react';
import { getCurrencyOptionValue, getFullDate } from '@/utils/common';
import Button from '@/components/atoms/Button';
import AddIcon from '@/assets/icons/add.svg?react';
import RefreshIcon from '@/assets/icons/refresh.svg?react';
import Logo from '@/assets/logo.svg?react';

const CurrencyForm: React.FC = () => {
	const { fetchCurrencyData } = useGetCurrencyData();
	const { currencyData, lastUpdate } = useCurrencyStore();

	const form = useForm<CurrencyConverterForm>({
		defaultValues: {
			convertItems: [{ currency: '' }, { currency: '' }],
		},
		mode: 'onChange',
	});

	useEffect(() => {
		if (currencyData.length > 2) {
			form.reset({
				convertItems: [
					{ currency: getCurrencyOptionValue(currencyData[0]) },
					{ currency: getCurrencyOptionValue(currencyData[1]) },
				],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currencyData]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'convertItems',
	});

	return (
		<div className="flex flex-col gap-y-2 bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-2xl">
			<Logo className="w-48 h-48 mx-auto" />
			<h1 className="text-center text-2xl font-bold text-gray-700 mb-4">
				Token Converter
			</h1>

			{fields.map((field, index) => (
				<CurrencyFormItem
					index={index}
					key={field.id}
					form={form}
					removable={fields.length > 2}
					onRemove={remove}
				/>
			))}

			<div className="flex flex-col gap-y-2 mt-4">
				<Button
					className="w-full"
					onClick={() => append({})}
					disabled={fields.length > 4}
					icon={<AddIcon className="w-5 h-5" />}
				>
					Add
				</Button>

				<div>
					<Button
						className="w-full"
						variant="secondary"
						onClick={() => fetchCurrencyData(true)}
						icon={<RefreshIcon className="w-5 h-5" />}
					>
						Refresh
					</Button>

					{lastUpdate && (
						<p className="text-center mt-2 text-gray-700">
							Last update: {getFullDate(lastUpdate)}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default CurrencyForm;
