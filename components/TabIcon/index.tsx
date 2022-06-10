import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export const TabIcon = ({ isActive, children }: PropsWithChildren<{ isActive: boolean }>) => (
	<span
		className={clsx('tg-caption-sm rounded-full p-[4px] px-[8px]', {
			'bg-black': isActive,
			'bg-primary': !isActive,
			'text-white': isActive,
			'text-black': !isActive,
		})}
	>
		{children}
	</span>
);
