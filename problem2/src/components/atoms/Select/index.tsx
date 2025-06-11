import { mergeClasses } from '@/utils/common';
import {
	useState,
	useRef,
	useEffect,
	type ReactNode,
} from 'react';
import type { FieldError } from 'react-hook-form';
import Input from '../Input';

export type SelectOption = {
	value: string;
	label: string;
	icon?: ReactNode;
	disabled?: boolean;
};

export type SelectProps = {
	label?: string;
	error?: FieldError | string;
	helperText?: string;
	required?: boolean;
	searchable?: boolean;
	placeholder?: string;
	options: SelectOption[];
	value?: string;
	onChange?: (value: string) => void;
	onBlur?: () => void;
	name?: string;
	id?: string;
	disabled?: boolean;
	classes?: {
		container?: string;
		label?: string;
		trigger?: string;
		dropdown?: string;
		option?: string;
		error?: string;
		helper?: string;
		search?: string;
	};
};

const Select: React.FC<SelectProps> = ({
	label,
	error,
	helperText,
	required,
	searchable = true,
	placeholder = 'Select an option...',
	options = [],
	value,
	onChange,
	onBlur,
	classes,
	id,
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerInputRef = useRef<HTMLInputElement>(null);

	const selectId =
		id || `select-${Math.random().toString(36).substring(2, 9)}`;
	const hasError = Boolean(error);
	const errorMessage = typeof error === 'string' ? error : error?.message;

	// Use external value
	const currentValue = value || '';
	const selectedOption = options.find(
		(option) => option.value === currentValue
	);

	const filteredOptions = searchable
		? options.filter((option) =>
				option.label.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: options;

		// Reset search state when dropdown closes
		useEffect(() => {
			if (!isOpen) {
				setIsSearching(false);
				setSearchTerm('');
			}
		}, [isOpen]);

		// Close dropdown when clicking outside
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					containerRef.current &&
					!containerRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
					setSearchTerm('');
				}
			};

			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}, []);

		// Focus search input when dropdown opens
		useEffect(() => {
			if (isOpen && searchable && triggerInputRef.current) {
				triggerInputRef.current.focus();
			}
		}, [isOpen, searchable]);

		const handleToggle = () => {
			if (!disabled) {
				if (!isOpen && searchable) {
					setIsOpen(true);
					setIsSearching(true);
					setSearchTerm('');
				} else if (!searchable) {
					setIsOpen(!isOpen);
				}
			}
		};

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (searchable) {
				const newValue = e.target.value;
				setSearchTerm(newValue);
				setIsSearching(true);
				if (!isOpen) {
					setIsOpen(true);
				}
			}
		};

		const handleInputFocus = () => {
			if (searchable && !isOpen) {
				setIsOpen(true);
				setIsSearching(true);
				setSearchTerm('');
			}
		};

	const handleOptionSelect = (optionValue: string) => {
		// Call onChange if provided
		if (onChange) {
			onChange(optionValue);
		}

		setIsOpen(false);
		setSearchTerm('');
		setIsSearching(false);

		// Trigger onBlur event
		if (onBlur) {
			onBlur();
		}
	};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
				setSearchTerm('');
				setIsSearching(false);
			} else if (event.key === 'Enter' && !searchable) {
				event.preventDefault();
				handleToggle();
			} else if (event.key === 'ArrowDown' && !isOpen) {
				event.preventDefault();
				setIsOpen(true);
			}
		};

	return (
		<div
			ref={containerRef}
			className={mergeClasses(
				'relative flex flex-col',
				classes?.container
			)}
		>
			{label && (
				<label
					htmlFor={selectId}
					className={mergeClasses(
						'text-sm font-medium text-gray-700',
						classes?.label
					)}
				>
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

				{/* Select Trigger */}
				{searchable ? (
					<div className="relative">
						{selectedOption?.icon && !isSearching && (
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
								<span className="flex-shrink-0">{selectedOption.icon}</span>
							</div>
						)}
						<Input
							ref={triggerInputRef}
							type="text"
							value={isSearching ? searchTerm : selectedOption?.label || ''}
							onChange={handleInputChange}
							onFocus={handleInputFocus}
							onKeyDown={handleKeyDown}
							placeholder={
								isSearching && selectedOption
									? selectedOption.label
									: placeholder
							}
							disabled={disabled}
							classes={{
								container: 'relative',
								input: mergeClasses(
									'pr-10',
									selectedOption?.icon && !isSearching ? 'pl-10' : '',
									classes?.trigger,
									{
										'!border-red-500 !focus:ring-red-500 !focus:border-red-500':
											hasError,
									}
								),
							}}
							aria-invalid={hasError}
							aria-describedby={
								errorMessage
									? `${selectId}-error`
									: helperText
									? `${selectId}-helper`
									: undefined
							}
							autoComplete="off"
						/>

						{/* Icon container for searchable input */}
						<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<svg
								className={mergeClasses(
									'w-5 h-5 text-gray-400 transition-transform duration-150',
									isOpen ? 'transform rotate-180' : ''
								)}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				) : (
					<div
						className={mergeClasses(
							'w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer outline-0',
							'transition duration-150 ease-in-out',
							'flex items-center justify-between',
							disabled
								? 'bg-gray-50 text-gray-500 cursor-not-allowed'
								: 'bg-white hover:border-gray-400',
							hasError
								? 'border-red-500 focus:ring-red-500 focus:border-red-500'
								: 'border-gray-300',
							classes?.trigger
						)}
						onClick={handleToggle}
						onKeyDown={handleKeyDown}
						tabIndex={disabled ? -1 : 0}
						role="combobox"
						aria-expanded={isOpen}
						aria-haspopup="listbox"
						aria-invalid={hasError}
						aria-describedby={
							errorMessage
								? `${selectId}-error`
								: helperText
								? `${selectId}-helper`
								: undefined
						}
					>
						<div className="flex items-center flex-1 min-w-0">
							{selectedOption ? (
								<>
									{selectedOption.icon && (
										<span className="mr-2 flex-shrink-0">
											{selectedOption.icon}
										</span>
									)}
									<span className="truncate">{selectedOption.label}</span>
								</>
							) : (
								<span className="text-gray-500 truncate">{placeholder}</span>
							)}
						</div>
						<svg
							className={mergeClasses(
								'w-5 h-5 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-150',
								isOpen ? 'transform rotate-180' : ''
							)}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				)}

				{/* Dropdown */}
				{isOpen && (
					<div
						className={mergeClasses(
							'absolute top-full left-0 right-0 z-50 mt-1',
							'bg-white border border-gray-300 rounded-md shadow-lg',
							'max-h-60 overflow-hidden',
							classes?.dropdown
						)}
					>
						<div className="max-h-60 overflow-y-auto">
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option) => (
									<div
										key={option.value}
										className={mergeClasses(
											'px-3 py-2 cursor-pointer flex items-center',
											'hover:bg-gray-50 transition-colors duration-150',
											option.disabled
												? 'text-gray-400 cursor-not-allowed'
												: 'text-gray-900',
											option.value === currentValue
												? 'bg-orange-50 text-orange-700'
												: '',
											classes?.option
										)}
										onClick={() =>
											!option.disabled && handleOptionSelect(option.value)
										}
										role="option"
										aria-selected={option.value === currentValue}
									>
										{option.icon && (
											<span className="mr-2 flex-shrink-0">{option.icon}</span>
										)}
										<span className="truncate">{option.label}</span>
									</div>
								))
							) : (
								<div className="px-3 py-8 text-gray-500 text-sm text-center">
									{searchable && searchTerm
										? 'No options found'
										: 'No options available'}
								</div>
							)}
						</div>
					</div>
				)}

				{errorMessage && (
					<div
						id={`${selectId}-error`}
						className={mergeClasses('text-sm text-red-600', classes?.error)}
						role="alert"
					>
						{errorMessage}
					</div>
				)}			{helperText && !errorMessage && (
				<div
					id={`${selectId}-helper`}
					className={mergeClasses('text-sm text-gray-500', classes?.helper)}
				>
					{helperText}
				</div>
			)}
		</div>
	);
};

export default Select;
