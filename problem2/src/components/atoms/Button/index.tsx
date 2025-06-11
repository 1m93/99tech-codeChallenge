import { mergeClasses } from '@/utils/common';
import React from 'react';

type ButtonProps = {
	children: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'primary' | 'secondary' | 'outline';
	disabled?: boolean;
	className?: string;
	icon?: React.ReactNode;
	iconPosition?: 'left' | 'right';
};

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	type = 'button',
	variant = 'primary',
	disabled = false,
	className = '',
	icon,
	iconPosition = 'left',
}) => {
	const baseClasses =
		'px-4 py-2 rounded font-medium transition-colors duration-200';

	const variantClasses = {
		primary: 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300',
		secondary: 'bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300',
		outline:
			'border border-orange-500 text-orange-500 hover:bg-orange-50 disabled:border-orange-300 disabled:text-orange-300',
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={mergeClasses(
				baseClasses,
				variantClasses[variant],
				disabled ? 'cursor-not-allowed' : 'cursor-pointer',
				'flex items-center justify-center gap-2',
				className
			)}
		>
			{icon && iconPosition === 'left' && (
				<span className="flex-shrink-0">{icon}</span>
			)}

			{children}

			{icon && iconPosition === 'right' && (
				<span className="flex-shrink-0">{icon}</span>
			)}
		</button>
	);
};

export default Button;
