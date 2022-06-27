import { Icon, IconButton } from '@synthetixio/ui';
import { useModalContext } from 'containers/Modal';
import { PropsWithChildren, useEffect } from 'react';

export default function BaseModal({ children, headline }: PropsWithChildren<{ headline: string }>) {
	const { setIsOpen, isOpen } = useModalContext();

	useEffect(() => {
		if (isOpen) {
			document.documentElement.scroll(0, 0);
			document.documentElement.classList.add('stop-scrolling');
		} else document.documentElement.classList.remove('stop-scrolling');
	}, [isOpen]);

	return (
		<div
			className="bg-purple p-0.5 rounded-t-[2rem] relative container"
			style={{ height: 'calc(100vh - 30px)' }}
		>
			<div className="flex flex-col items-center darker-60 rounded-t-[2rem] overflow-auto h-full w-full pt-12 pb-4">
				<IconButton
					className="top-5 right-5 absolute"
					onClick={() => {
						document.documentElement.classList.remove('stop-scrolling');
						setIsOpen(false);
					}}
					rounded
					size="sm"
				>
					<Icon name="Small-Cross" className="text-primary" />
				</IconButton>
				<h2 className="md:tg-title-h2 tg-title-h3 text-white text-center">{headline}</h2>
				{children}
			</div>
		</div>
	);
}
