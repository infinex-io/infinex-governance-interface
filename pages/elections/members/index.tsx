import Main from 'components/Main';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CouncilMembersSection from 'sections/nominations/CouncilMembers';

export default function CouncilMembers() {
	const { query } = useRouter();
	return (
		<>
			<Head>Synthetix | {query?.council && query.council.toString()}</Head>
			<Main>
				<CouncilMembersSection />
			</Main>
		</>
	);
}
