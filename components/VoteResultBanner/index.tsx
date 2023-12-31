import SNXIcon from 'components/Icons/SNXIcon';
import { useRouter } from 'next/router';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/button';

export const VoteResultBanner: React.FC = () => {
	const { push } = useRouter();
	const { t } = useTranslation();
	const periodsData = useCurrentPeriods();

	if (periodsData.find((periodData) => periodData.data?.currentPeriod !== 'VOTING')) return null;

	return (
		<div className="w-full p-[1px] bg-secondary-dark rounded-[1px] mx-auto">
			<div className="flex md:flex-row flex-col gap-2 items-center justify-between w-full h-full bg-[#16151D] p-5">
				<div className="flex md:flex-row flex-col gap-2 items-center">
					<div className="bg-dark-blue rounded-full h-10 w-10 flex items-center justify-center md:mr-4">
						<SNXIcon />
					</div>
					<div className="text-center md:text-left">
						<h3 className="tg-title-h3">{t('landing-page.vote-banner.title')}</h3>
						<p className="tg-content mt-1">{t('landing-page.vote-banner.subtitle')}</p>
					</div>
				</div>
				<Button
					onClick={() => {
						push('/vote');
					}}
					className='border-secondary-dark'
					variant="outline"
					label={t('landing-page.vote-banner.cta') as string}
				/>
			</div>
		</div>
	);
};
