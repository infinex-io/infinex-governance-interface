import clsx from 'clsx';
import React from 'react';
import { useTimer } from 'react-timer-hook';

interface TimerProps {
	expiryTimestamp: number | undefined;
	onExpire?: () => void;
	className?: string;
}

export const Timer: React.FC<TimerProps> = ({ expiryTimestamp, onExpire, className, ...props }) => {
	const { minutes, hours, days } = useTimer({
		expiryTimestamp: new Date(expiryTimestamp || 0),
		autoStart: true,
		onExpire,
	});

	
	// LOADING STATE
	if (expiryTimestamp === undefined) {
		return (
			<div
				className="bg-slate-800 rounded animate-pulse"
				data-testid="loading-state"
			>
				<div className={clsx('flex items-center invisible', className)} {...props}>
					<span>D</span>
					<span className="mx-2">H</span>
					<span>M</span>
				</div>
			</div>

		)
	}

	return (
		<div className={clsx('flex items-center', className)} {...props}>
			<span>{days}D</span>
			<span className="mx-2">{hours}H</span>
			<span>{minutes}M</span>
		</div>
	);
};
