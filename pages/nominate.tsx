import { Button, useTransactionModalContext } from '@synthetixio/ui';
import Main from 'components/Main';
import { DeployedModules } from 'constants/config';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import Head from 'next/head';

export default function Nominate() {
	const { setVisible, setTxHash, setState } = useTransactionModalContext();

	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);

	const handleNomination = async () => {
		setState('signing');
		setVisible(true);
		try {
			const treasuryTx = await nominateForTreasuryCouncil.mutateAsync();
			setTxHash(treasuryTx.hash);
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};
	return (
		<>
			<Head>
				<title>Nominate | Governance V3</title>
			</Head>
			<Main>
				<div className="py-10 flex items-center justify-center">
					<Button className="w-[313px]" onClick={() => handleNomination()}>
						Nomnate for Treasury Council
					</Button>
				</div>
			</Main>
		</>
	);
}
