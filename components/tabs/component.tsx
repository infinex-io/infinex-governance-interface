import React from 'react';

import styles from './styles.module.css';

export interface TabItemProps {
	label: string;
	onClick?: () => void;
	active?: boolean;
	content?: React.ReactNode;
}

export interface TabListProps {
	tabItems: TabItemProps[];
	itemClicked: (index: number) => void;
	active?: number;
}

export const TabItem = ({ label, onClick, active }: TabItemProps) => {
	return (
		<div className={`${active ? styles.itemActive : styles.itemDefault}`} onClick={onClick}>
			{label}
		</div>
	);
};

export const TabList = ({ tabItems, active, itemClicked }: TabListProps) => {
	return (
		<>
			<div className={styles.tabList}>
				{tabItems.map((item, i) => (
					<TabItem
						key={i}
						active={active === i}
						label={item.label}
						onClick={() => itemClicked(i)}
					/>
				))}
			</div>
			<div>
				{tabItems.map((item, i) => (
					<div key={i}>{active === i && item.content}</div>
				))}
			</div>
		</>
	);
};
