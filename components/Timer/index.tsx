import clsx from 'clsx';
import React from 'react';
import { useTimer } from 'react-timer-hook';

interface TimerProps {
	expiryTimestamp: number | string;
	onExpire?: () => void;
	className?: string;
}

export const Timer: React.FC<TimerProps> = ({ expiryTimestamp, onExpire, className, ...props }) => {
	const { minutes, hours, days } = useTimer({
		expiryTimestamp: new Date(expiryTimestamp),
		autoStart: true,
		onExpire,
	});

	return (
		<div className={clsx('flex items-center', className)} {...props}>
			<span>{days}D</span>
			<span className="mx-2">{hours}H</span>
			<span>{minutes}M</span>
		</div>
	);
};
