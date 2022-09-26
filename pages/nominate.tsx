import { Checkbox } from '@synthetixio/ui';
import Main from 'components/Main';
import { COUNCILS_DICTIONARY, DeployedModules } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Nominate() {
	const { t } = useTranslation();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { ensName, walletAddress, isWalletConnected } = useConnectorContext();
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForGrantsCouncil = useNominateMutation(DeployedModules.GRANTS_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);

	const isAlreadyNominatedForSpartan = useIsNominated(
		DeployedModules.SPARTAN_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForGrants = useIsNominated(
		DeployedModules.GRANTS_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForAmbassador = useIsNominated(
		DeployedModules.AMBASSADOR_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominated =
		isAlreadyNominatedForSpartan.data ||
		isAlreadyNominatedForGrants.data ||
		isAlreadyNominatedForAmbassador.data ||
		isAlreadyNominatedForTreasury.data;
	console.log(isAlreadyNominated);
	return (
		<Main>
			<h1 className="tg-title-h1 text-center pt-4">
				Choose your Council you would like to nominate yourself
			</h1>
			<div className="flex flex-col">
				{isAlreadyNominated && (
					<h3 className="tg-title-h3 text-center pt-4">
						It seems that you are already nominated for one of these council. You only can nominate
						for one council
					</h3>
				)}
				{isWalletConnected ? (
					<div className="flex justify-center flex-col md:flex-row gap-4 m-10 max-w-[190px] w-full md:max-w-none">
						{COUNCILS_DICTIONARY.map((council) => (
							<Checkbox
								key={`${council.slug}-council-checkbox`}
								id={`${council.slug}-council-checkbox`}
								onChange={() => setActiveCheckbox(council.slug)}
								label={t('modals.nomination.checkboxes.'.concat(council.slug))}
								color="lightBlue"
								checked={activeCheckbox === council.slug}
								disabled={isAlreadyNominated}
							/>
						))}
					</div>
				) : (
					<h3 className="tg-title-h3 text-center pt-4">Please connect your wallet</h3>
				)}
			</div>
		</Main>
	);
}
