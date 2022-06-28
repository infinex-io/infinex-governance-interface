import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useTranslation } from 'react-i18next';
import BackButton from 'components/BackButton';

import CouncilsCarousel from 'components/CouncilsCarousel';

const Councils: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<div className="flex flex-col items-center p-3 container">
					<div className="w-full relative">
						<BackButton />
						<h1 className="tg-title-h1 text-center p-12 ml-auto">{t('councils.headline')}</h1>
					</div>
					<CouncilsCarousel withoutAllMembers />
				</div>
			</Main>
		</>
	);
};

export default Councils;
