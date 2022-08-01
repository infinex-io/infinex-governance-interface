import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export const TabIcon = ({ isActive, children }: PropsWithChildren<{ isActive: boolean }>) => (
	<div
		className={clsx('rounded-full w-5 h-5 flex items-center justify-center pt-0.5', {
			'bg-black text-white': isActive,
			'bg-primary text-black': !isActive,
		})}
	>
		<span className="tg-caption-sm">{children}</span>
	</div>
);
