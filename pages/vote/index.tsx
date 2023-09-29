import Main from 'components/Main';
import Head from 'next/head';
import VoteSection from 'components/Vote';
import { PreEvaluationSection } from 'components/Vote/PreEvaluationSection';

export default function Vote() {
	return (
		<>
			<Head>
				<title>Infinex | Governance V3</title>
			</Head>
			<Main>
				<VoteSection />
				<PreEvaluationSection />
			</Main>
		</>
	);
}
