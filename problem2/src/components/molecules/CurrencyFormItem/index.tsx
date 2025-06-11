import type { CurrencyConverterForm } from '@/types/currencyConverter';
import type { UseFormReturn } from 'react-hook-form';
import CurrencySelect from '../CurrencySelect';
import Input from '@/components/atoms/Input';
import { mergeClasses } from '@/utils/common';
import DeleteIcon from '@/assets/icons/delete.svg?react';
import { useCallback } from 'react';
import {
	calculateConvertedAmount,
	parseCurrencyValue,
} from '@/utils/currencyConverter';

type CurrencyFormItemProps = {
	form: UseFormReturn<CurrencyConverterForm>;
	index: number;
	className?: string;
	removable?: boolean;
	onRemove?: (index: number) => void;
};

const CurrencyFormItem: React.FC<CurrencyFormItemProps> = ({
	form,
	index,
	className,
	removable,
	onRemove,
}) => {
	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	const updateOtherItemsOnUpdateCurrency = useCallback(
		(value: string) => {
			const currentFormValues = watch('convertItems');
			const itemPrice = parseCurrencyValue(value);
			const itemAmount = currentFormValues[index]?.amount;

			if (
				Number.isNaN(itemPrice) ||
				itemAmount == null ||
				itemAmount.toString() === ''
			) {
				return;
			}

			for (let i = 0; i < currentFormValues.length; i++) {
				if (i !== index) {
					const itemValue = currentFormValues[i];
					const itemCurrency = itemValue?.currency;

					if (!itemCurrency) {
						continue;
					}

					const otherItemPrice = parseCurrencyValue(itemCurrency);

					setValue(
						`convertItems.${i}.amount`,
						calculateConvertedAmount(itemAmount, itemPrice, otherItemPrice)
					);
				}
			}
		},
		[index, watch, setValue]
	);

	const updateOtherItemsOnUpdateAmount = useCallback(
		(value: string) => {
			const currentFormValues = watch('convertItems');
			const itemCurrency = currentFormValues[index]?.currency;
			const itemPrice = parseCurrencyValue(itemCurrency);

			if (Number.isNaN(itemPrice)) {
				return;
			}

			for (let i = 0; i < currentFormValues.length; i++) {
				if (i !== index) {
					const itemValue = currentFormValues[i];
					const itemCurrency = itemValue?.currency;

					if (!itemCurrency) {
						continue;
					}

					const otherItemPrice = parseCurrencyValue(itemCurrency);

					if (value === '') {
						setValue(`convertItems.${i}.amount`, undefined);
						continue;
					}

					setValue(
						`convertItems.${i}.amount`,
						calculateConvertedAmount(Number(value), itemPrice, otherItemPrice)
					);
				}
			}
		},
		[index, watch, setValue]
	);

	const handleChangeInput = useCallback(
		(value: string, type: 'currency' | 'amount') => {
			setValue(`convertItems.${index}.${type}`, value);

			if (type === 'currency') {
				updateOtherItemsOnUpdateCurrency(value);
			} else {
				updateOtherItemsOnUpdateAmount(value);
			}
		},
		[
			index,
			setValue,
			updateOtherItemsOnUpdateCurrency,
			updateOtherItemsOnUpdateAmount,
		]
	);

	return (
		<div
			className={mergeClasses(
				'flex gap-4 bg-gray-300 p-4 rounded-lg relative sm:flex-row flex-col',
				className
			)}
		>
			<CurrencySelect
				value={watch(`convertItems.${index}.currency`)}
				error={errors.convertItems?.[index]?.currency}
				onChange={(value) => {
					handleChangeInput(value, 'currency');
				}}
				classes={{
					container: 'flex-1 bg-white rounded-lg',
				}}
			/>

			<Input
				{...register(`convertItems.${index}.amount`)}
				error={errors.convertItems?.[index]?.amount}
				placeholder="Amount"
				min={0}
				onChange={({ target: { value } }) => {
					handleChangeInput(value, 'amount');
				}}
				classes={{
					container: 'bg-white rounded-lg flex-1',
				}}
				type="number"
			/>

			{removable && (
				<span
					className={mergeClasses(
						'bg-red-500 rounded-full w-8 h-8 flex items-center justify-center',
						'absolute -top-2 -right-4 cursor-pointer hover:bg-red-600 transition-colors duration-200'
					)}
					onClick={() => onRemove?.(index)}
				>
					<DeleteIcon className="w-5 h-5 fill-white" />
				</span>
			)}
		</div>
	);
};

export default CurrencyFormItem;
