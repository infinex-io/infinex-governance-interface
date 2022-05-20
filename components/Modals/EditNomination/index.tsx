import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, Checkbox, Flex, Card } from 'components/old-ui';

import BaseModal from '../BaseModal';
import { truncateAddress } from 'utils/truncate-address';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';

import { useState } from 'react';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNominateMutation from 'mutations/nomination/useNominateMutation';

import { useRouter } from 'next/router';
import { useModalContext } from 'containers/Modal';

interface EditModalProps {
	council: string;
	deployedModule: DeployedModules;
}

export default function EditModal({ deployedModule, council }: EditModalProps) {
	const { t } = useTranslation();
	const { walletAddress, ensName } = useConnectorContext();
	const { setIsOpen } = useModalContext();
	const { push } = useRouter();
	const withdrawMutation = useWithdrawNominationMutation(deployedModule);
	const [step, setStep] = useState(1);
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForGrantsCouncil = useNominateMutation(DeployedModules.GRANTS_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);
	const isInNominationPeriodSpartan = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const isInNominationPeriodGrants = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const isInNominationPeriodAmbassador = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const isInNominationPeriodTreasury = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);
	const handleBtnClick = async () => {
		if (step === 1) {
			const tx = await withdrawMutation.mutateAsync();
			if (tx) {
				setStep(2);
			}
		} else if (step === 2) {
			switch (activeCheckbox) {
				case 'spartan':
					const spartanTx = await nominateForSpartanCouncil.mutateAsync();
					if (spartanTx) {
						setIsOpen(false);
						push({
							pathname: '/councils/'.concat('spartan'),
						});
					}
					break;
				case 'grants':
					const grantsTx = await nominateForGrantsCouncil.mutateAsync();
					if (grantsTx) {
						setIsOpen(false);
						push({
							pathname: '/councils/'.concat('grants'),
						});
					}
					break;
				case 'ambassador':
					const ambassadorTx = await nominateForAmbassadorCouncil.mutateAsync();
					if (ambassadorTx) {
						setIsOpen(false);
						push({
							pathname: '/councils/'.concat('ambassador'),
						});
					}
					break;
				case 'treasury':
					const treasuryTx = await nominateForTreasuryCouncil.mutateAsync();
					if (treasuryTx) {
						setIsOpen(false);
						push({
							pathname: '/councils/'.concat('treasury'),
						});
					}
					break;
				default:
					console.info('no matching entity found');
			}
		}
	};
	return (
		<BaseModal headline={t('modals.edit.headline')}>
			<span className="max-w-[400px] tg-content text-white text-center">
				You can only nominate for 1 coincil at any given time. In order to change your nomination
				from one council to another you must first select your new coincil and click save. You will
				be need to sign 2 transactions in order to change.
			</span>
			<div className="flex flex-col justify-center items-center bg-black p-10">
				{step === 1 ? (
					<>
						<h4 className="tg-title-h4 text-white">{t('modals.edit.step-one')}</h4>
						<StyledInformationBox direction="column" alignItems="center">
							<StyledBlackBoxSubline>{t('modals.edit.current')}</StyledBlackBoxSubline>
							<h3 className="tg-title-h3 text-white">
								{ensName ? ensName : walletAddress && truncateAddress(walletAddress)}
							</h3>
							<Card color="lightBlue">
								<StyledCardContent className="darker-60" justifyContent="center">
									{t('modals.edit.council', { council })}
								</StyledCardContent>
							</Card>
						</StyledInformationBox>
					</>
				) : (
					<>
						<h4 className="tg-title-h4">{t('modals.edit.step-two')}</h4>
						<StyledCheckboxWrapper justifyContent="center">
							<Checkbox
								id="spartan-council-checkbox"
								onChange={() => {
									setActiveCheckbox('spartan');
								}}
								label={t('modals.nomination.checkboxes.spartan')}
								color="lightBlue"
								checked={activeCheckbox === 'spartan'}
								disabled={isInNominationPeriodSpartan.data?.currentPeriod !== 'NOMINATION'}
							/>
							<Checkbox
								id="grants-council-checkbox"
								onChange={() => {
									setActiveCheckbox('grants');
								}}
								label={t('modals.nomination.checkboxes.grants')}
								color="lightBlue"
								checked={activeCheckbox === 'grants'}
								disabled={isInNominationPeriodGrants.data?.currentPeriod !== 'NOMINATION'}
							/>
							<Checkbox
								id="ambassador-council-checkbox"
								onChange={() => {
									setActiveCheckbox('ambassador');
								}}
								label={t('modals.nomination.checkboxes.ambassador')}
								color="lightBlue"
								checked={activeCheckbox === 'ambassador'}
								disabled={isInNominationPeriodAmbassador.data?.currentPeriod !== 'NOMINATION'}
							/>
							<Checkbox
								id="treasury-council-checkbox"
								onChange={() => {
									setActiveCheckbox('treasury');
								}}
								label={t('modals.nomination.checkboxes.treasury')}
								color="lightBlue"
								checked={activeCheckbox === 'treasury'}
								disabled={isInNominationPeriodTreasury.data?.currentPeriod !== 'NOMINATION'}
							/>
						</StyledCheckboxWrapper>
					</>
				)}
			</div>
			<StyledEditButton onClick={() => handleBtnClick()}>
				{t('modals.edit.button')}
			</StyledEditButton>
		</BaseModal>
	);
}

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 0.75rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledEditButton = styled(Button)`
	max-width: 312px;
`;

const StyledCardContent = styled(Flex)`
	width: 100%;
	height: 100%;
	color: ${({ theme }) => theme.colors.white};
`;

const StyledInformationBox = styled(Flex)`
	border: 1px solid ${({ theme }) => theme.colors.grey};
	padding: ${({ theme }) => theme.spacings.tiny};
`;

const StyledCheckboxWrapper = styled(Flex)`
	margin: ${({ theme }) => theme.spacings.superBig} 0px;
	width: 100%;
	> * {
		margin: ${({ theme }) => theme.spacings.medium};
	}
`;
