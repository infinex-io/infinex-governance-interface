import clsx from 'clsx';

import styles from './Loader.module.scss';

interface Props {
	fullScreen?: boolean;
	overlay?: boolean;
	className?: string;
}
export const Loader: React.FC<Props> = ({ fullScreen, overlay, className }) => (
	<div
		className={clsx(className, {
			'flex items-center justify-center fixed w-full h-full top-0 left-0': fullScreen,
			'bg-black z-100 bg-opacity-40': overlay,
		})}
	>
		<div className={styles.loader}>
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
);
