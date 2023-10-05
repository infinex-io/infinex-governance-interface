import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	icon?: React.ReactElement;
	className?: string;
	loading?: boolean;
	variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'link' | 'success' | 'outline';
}

export const Button = ({
	label,
	icon,
	className,
	loading,
	variant = 'primary',
	...props
}: ButtonProps) => {
	const buttonClass = classNames(
		styles.button,
		{ [styles.buttonLoading]: loading },
		{ [styles.primary]: variant === 'primary' },
		{ [styles.secondary]: variant === 'secondary' },
		{ [styles.tertiary]: variant === 'tertiary' },
		{ [styles.destructive]: variant === 'destructive' },
		{ [styles.link]: variant === 'link' },
		{ [styles.success]: variant === 'success' },
		{ [styles.outline]: variant === 'outline' },
		className
	);
	const buttonIconClassname = icon ? styles.icon : '';
	return (
		<div>
			<button {...props} className={buttonClass}>
				{loading ? (
					<>
						{label && <span>{label}</span>}
					</>
				) : (
					<>
						{icon && <span className={buttonIconClassname}>{icon}</span>}
						{label && <span>{label}</span>}
					</>
				)}
			</button>
		</div>
	);
};
