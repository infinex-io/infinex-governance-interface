import { Button } from '@synthetixio/ui';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props {
	className?: string;
	council?: string;
	members: number;
	listView?: boolean;
}

export const CouncilStats: React.FC<Props> = ({ className, listView, members, council }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	return (
		<div
			className={clsx('p-0.5 rounded-lg bg-purple', className, {
				'w-full xs:max-w-[210px] min-w-[210px] h-[285px]': !listView,
				'w-full': listView,
			})}
		>
			<div
				className={clsx('darker-20 relative flex text-center xs:text-left p-4 rounded-lg h-full', {
					'flex-col items-center xs:items-start justify-center': !listView,
					'items-center': listView,
				})}
			>
				<h4 className={clsx('font-bold mt-auto', listView ? 'text-5xl' : 'text-6xl')}>{members}</h4>
				<div className={clsx({ 'mx-2': listView })}>
					<h5 className="text-sm font-semibold leading-5">{t('councils.members', { council })}</h5>
					<p className="text-xs font-normal opacity-75 leading-5">
						{t('councils.view-member-sub')}
					</p>
				</div>
				<Button
					className={clsx({ 'mt-auto': !listView, 'ml-auto': listView })}
					onClick={() => push('/councils')}
				>
					{t('councils.view-council')}
				</Button>
			</div>
		</div>
	);
};
