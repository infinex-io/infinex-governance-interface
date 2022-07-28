import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export const TabIcon = ({ isActive, children }: PropsWithChildren<{ isActive: boolean }>) => (
	<div
		className={clsx('rounded-full w-5 h-5 flex items-center justify-center pt-0.5', {
			'bg-black': isActive,
			'bg-primary': !isActive,
			'text-white': isActive,
			'text-black': !isActive,
		})}
	>
		<span className="tg-caption-sm">{children}</span>
	</div>
);
