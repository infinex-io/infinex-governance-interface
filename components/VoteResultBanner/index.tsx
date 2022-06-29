import { Button } from '@synthetixio/ui';
import { SNXIcon } from 'components/old-ui';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const VoteResultBanner: React.FC = () => {
	const { push } = useRouter();
	const { t } = useTranslation();
	const periods = COUNCILS_DICTIONARY.map((council) => useCurrentPeriod(council.module));

	if (!periods.find((item) => item.data?.currentPeriod === 'VOTING')) return null;

	return (
		<div className="w-full p-0.5 bg-purple rounded mx-auto">
			<div className="flex md:flex-row flex-col gap-2 items-center justify-between w-full h-full darker-60 p-5">
				<div className="flex md:flex-row flex-col gap-2 items-center">
					<div className="bg-dark-blue rounded-full h-12 w-12 flex items-center justify-center md:mr-4">
						<SNXIcon />
					</div>
					<div className="text-center md:text-left">
						<h3 className="tg-title-h3">{t('landing-page.vote-banner.title')}</h3>
						<p className="tg-content mt-1">{t('landing-page.vote-banner.subtitle')}</p>
					</div>
				</div>
				<Button
					onClick={() => {
						push({ pathname: '/vote/' });
					}}
					variant="outline"
				>
					{t('landing-page.vote-banner.cta')}
				</Button>
			</div>
		</div>
	);
};
