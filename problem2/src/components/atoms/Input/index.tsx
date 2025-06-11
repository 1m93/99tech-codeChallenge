import { mergeClasses } from '@/utils/common';
import { forwardRef, type InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
	label?: string;
	error?: FieldError | string;
	helperText?: string;
	required?: boolean;
	classes?: {
		container?: string;
		label?: string;
		input?: string;
		error?: string;
		helper?: string;
	};
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helperText, required, classes, id, ...props }, ref) => {
		const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
		const hasError = Boolean(error);
		const errorMessage = typeof error === 'string' ? error : error?.message;

		return (
			<div
				className={mergeClasses('flex flex-col space-y-1', classes?.container)}
			>
				{label && (
					<label
						htmlFor={inputId}
						className={mergeClasses(
							'text-sm font-medium text-gray-700',
							classes?.label
						)}
					>
						{label}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
				)}

				<input
					ref={ref}
					id={inputId}
					className={mergeClasses(
						'w-full px-3 py-2 border rounded-md shadow-sm outline-0',
						'disabled:bg-gray-50 disabled:text-gray-500',
						'transition duration-150 ease-in-out',
						hasError
							? 'border-red-500 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-300',
						classes?.input
					)}
					aria-invalid={hasError}
					aria-describedby={
						errorMessage
							? `${inputId}-error`
							: helperText
							? `${inputId}-helper`
							: undefined
					}
					{...props}
				/>

				{errorMessage && (
					<div
						id={`${inputId}-error`}
						className={mergeClasses('text-sm text-red-600', classes?.error)}
						role="alert"
					>
						{errorMessage}
					</div>
				)}

				{helperText && !errorMessage && (
					<div
						id={`${inputId}-helper`}
						className={mergeClasses('text-sm text-gray-500', classes?.helper)}
					>
						{helperText}
					</div>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
