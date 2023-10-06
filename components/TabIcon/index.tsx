import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export const TabIcon = ({ isActive, children }: PropsWithChildren<{ isActive: boolean }>) => (
	<div
		className={clsx('rounded-full w-5 h-5 flex items-center justify-center pt-0.5', {
			'bg-slate-850 text-slate-400': isActive,
			'bg-slate-850 text-slate-500': !isActive,
		})}
	>
		<span className="tg-caption-sm">{children}</span>
	</div>
);
