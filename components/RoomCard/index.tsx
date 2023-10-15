import React from 'react';
import styles from 'styles/yams.module.css';
import classNames from 'classnames';

interface RoomCard {
	key: number;
	name?: string;
	description?: string;
	emoji: string;
	token: string;
	exchange_id: string;
}

export default function RoomCard({ key, name, description, emoji, exchange_id, token }: RoomCard) {
	/* ======================== Hooks ======================== */
	// const { t } = useTranslation();   w-52 h-72

	return (
		<div
			key={key}
			className={classNames(
				`flex flex-col justify-between items-center p-8 gap-3 border-[1px] rounded-3xl border-solid 
      border-[#edac8b] border-opacity-40 w-60 h-72`,
				styles.boxIndent
			)}
		>
			<div
				className={classNames(
					'flex items-center justify-center w-14 h-14 rounded-full flex-shrink-0 text-3xl',
					styles.boxIndent
				)}
			>
				{emoji}
			</div>
			<div className="flex flex-col items-center text-center gap-1 mb-3">
				<h5 className="text-base font-bold text-sm">{name}</h5>
				<p className="w-full text-center text-sm font-medium text-slate-800 mt-1 mb-[-2px]">
					{description?.split('\\n')[0]}
				</p>
				<p className="w-full text-center text-sm font-medium text-slate-800">
					{description?.split('\\n')[1]}
				</p>
			</div>
			<button
				className={classNames(
					'flex justify-center items-center w-full px-4 py-2 rounded-3xl font-semibold text-sm',
					styles.primaryButtonShadow
				)}
			>
				Select
			</button>
		</div>
	);
}
