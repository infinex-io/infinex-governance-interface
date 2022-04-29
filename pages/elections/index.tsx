import type { NextPage } from 'next';
import Head from 'next/head';
import ElectionsSections from 'sections/elections/index';
import Main from 'components/Main';
import { useTranslation } from 'react-i18next';
import NominateSelfBanner from 'components/NominateSelfBanner';

const Elections: NextPage = () => {
	const { t } = useTranslation();
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<NominateSelfBanner />
				<ElectionsSections />
			</Main>
		</>
	);
};

export default Elections;
