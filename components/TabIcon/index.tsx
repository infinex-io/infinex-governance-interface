import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export const TabIcon = ({
	isActive,
	children,
	key,
}: PropsWithChildren<{ isActive: boolean; key: string }>) => (
	<span
		key={key}
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
