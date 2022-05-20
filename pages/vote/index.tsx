import { ArrowLeftIcon, IconButton } from 'components/old-ui';
import Main from 'components/Main';
import { TextBold } from 'components/Text/bold';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import VoteBanner from 'components/Banners/VoteBanner';
import VoteSection from 'components/Vote';

export default function Vote() {
	const { t } = useTranslation();
	const { push } = useRouter();
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<VoteBanner />
				<div className="flex flex-col items-center">
					<div className="flex items-center absolute top-[100px] left-[100px]">
						<IconButton active onClick={() => push({ pathname: '/' })} rounded size="tiniest">
							<ArrowLeftIcon active />
						</IconButton>
						<TextBold color="lightBlue">{t('councils.back-btn')}</TextBold>
					</div>
					<VoteSection />
				</div>
			</Main>
		</>
	);
}
