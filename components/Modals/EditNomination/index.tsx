import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import { useTranslation } from 'react-i18next';

import { Checkbox } from 'components/old-ui';

import BaseModal from '../BaseModal';
import { truncateAddress } from 'utils/truncate-address';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';

import { useEffect, useState } from 'react';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useNominateMutation from 'mutations/nomination/useNominateMutation';

import { useRouter } from 'next/router';
import { capitalizeString } from 'utils/capitalize';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { useModalContext } from 'containers/Modal';
import { useQueryClient } from 'react-query';
import { useAccount } from 'wagmi';

interface EditModalProps {
	council: string;
	deployedModule: DeployedModules;
}

export default function EditModal({ deployedModule, council }: EditModalProps) {
	const { t } = useTranslation();
	const { data } = useAccount();
	const { ensName } = useConnectorContext();
	const { push } = useRouter();
	const { setContent, setTxHash, setVisible, state, setState } = useTransactionModalContext();
	const withdrawMutation = useWithdrawNominationMutation(deployedModule);
	const [step, setStep] = useState(1);
	const { setIsOpen } = useModalContext();
	const queryClient = useQueryClient();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForGrantsCouncil = useNominateMutation(DeployedModules.GRANTS_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);
	const isInNominationPeriodSpartan = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const isInNominationPeriodGrants = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const isInNominationPeriodAmbassador = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const isInNominationPeriodTreasury = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	useEffect(() => {
		if (state === 'confirmed' && step === 1) {
			setStep(2);
			setVisible(false);
			setState('signing');
			queryClient.resetQueries({ queryKey: ['nominees', 'isNominated'], active: true });
		}
		if (state === 'confirmed' && step === 2) {
			queryClient.resetQueries({ queryKey: ['nominees', 'isNominated'], active: true });
			setTimeout(() => {
				setVisible(false);
				push('/councils/'.concat(council));
				setIsOpen(false);
				setState('signing');
			}, 2000);
		}
	}, [state, step, setVisible, push, council, setState, setIsOpen, queryClient]);

	const handleBtnClick = async () => {
		if (step === 1) {
			setState('signing');
			setContent(
				<>
					<h6 className="tg-title-h6">
						{t('modals.edit.cta-step-1-head', { council: capitalizeString(council) })}
					</h6>
					<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(data!.address!)}</h3>
				</>
			);
			setVisible(true);
			try {
				const tx = await withdrawMutation.mutateAsync();
				setTxHash(tx.hash);
			} catch (error) {
				console.error(error);
				setState('error');
			}
		} else if (step === 2) {
			setState('signing');
			setContent(
				<>
					<h6 className="tg-title-h6">
						{t('modals.edit.cta-step-2-head', { council: capitalizeString(council) })}
					</h6>
					<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(data?.address!)}</h3>
				</>
			);
			setVisible(true);
			try {
				switch (activeCheckbox) {
					case 'spartan':
						const spartanTx = await nominateForSpartanCouncil.mutateAsync();
						setTxHash(spartanTx.hash);
						break;
					case 'grants':
						const grantsTx = await nominateForGrantsCouncil.mutateAsync();
						setTxHash(grantsTx.hash);
						break;
					case 'ambassador':
						const ambassadorTx = await nominateForAmbassadorCouncil.mutateAsync();
						setTxHash(ambassadorTx.hash);
						break;
					case 'treasury':
						const treasuryTx = await nominateForTreasuryCouncil.mutateAsync();
						setTxHash(treasuryTx.hash);
						break;
					default:
						console.info('no matching entity found');
				}
			} catch (error) {
				console.error(error);
				setState('error');
			}
		}
	};
	return (
		<BaseModal headline={t('modals.edit.headline')}>
			<span className="max-w-[600px] tg-content text-gray-500 text-center my-4">
				You can only nominate for 1 council at any given time. In order to change your nomination
				from one council to another you must first select your new council and click save. You will
				be need to sign 2 transactions in order to change.
			</span>
			<div className="flex flex-col justify-center items-center bg-black px-10 py-6 mb-8 w-[800px]">
				{step === 1 ? (
					<>
						<div className="flex flex-col items-center ">
							<div className="flex justify-center items-center w-[200px] mb-4">
								<div className="bg-purple rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
									1
								</div>
								<div className="min-w-full h-[1px] bg-purple"></div>
								<div className="bg-gray-500 rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
									2
								</div>
							</div>
							<h4 className="tg-title-h4 text-white">{t('modals.edit.step-one')}</h4>
							<div className="border-gray-500 rounded border-[1px] p-8 m-4">
								<h6 className="tg-title-h6 text-gray-500">{t('modals.edit.current')}</h6>
								<h3 className="tg-title-h3 text-white">
									{ensName ? ensName : data?.address && truncateAddress(data.address)}
								</h3>
							</div>
							<div className="bg-primary p-[2px] rounded">
								<div className="darker-60 text-primary py-1 px-6 rounded">
									{t('modals.edit.council', { council: capitalizeString(council) })}
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="flex justify-center items-center w-[200px] mb-4">
							<div className="bg-green rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
								1
							</div>
							<div className="min-w-full h-[1px] bg-green"></div>
							<div className="bg-purple rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
								2
							</div>
						</div>
						<h4 className="tg-title-h4 text-white m-4 mb-8">{t('modals.edit.step-two')}</h4>
						<div className="flex justify-between w-full">
							<Checkbox
								id="spartan-council-checkbox"
								onChange={() => setActiveCheckbox('spartan')}
								label={t('modals.nomination.checkboxes.spartan')}
								color="lightBlue"
								checked={activeCheckbox === 'spartan'}
								disabled={isInNominationPeriodSpartan.data?.currentPeriod !== 'NOMINATION'}
							/>
							<Checkbox
								id="grants-council-checkbox"
								onChange={() => setActiveCheckbox('grants')}
								label={t('modals.nomination.checkboxes.grants')}
								color="lightBlue"
								checked={activeCheckbox === 'grants'}
								disabled={isInNominationPeriodGrants.data?.currentPeriod !== 'NOMINATION'}
							/>
							<Checkbox
								id="ambassador-council-checkbox"
								onChange={() => setActiveCheckbox('ambassador')}
								label={t('modals.nomination.checkboxes.ambassador')}
								color="lightBlue"
								checked={activeCheckbox === 'ambassador'}
								disabled={isInNominationPeriodAmbassador.data?.currentPeriod !== 'NOMINATION'}
							/>
							<Checkbox
								id="treasury-council-checkbox"
								onChange={() => setActiveCheckbox('treasury')}
								label={t('modals.nomination.checkboxes.treasury')}
								color="lightBlue"
								checked={activeCheckbox === 'treasury'}
								disabled={isInNominationPeriodTreasury.data?.currentPeriod !== 'NOMINATION'}
							/>
						</div>
					</>
				)}
			</div>
			<div className="border-l-primary border-l-4 bg-primary mb-4">
				<h5 className="tg-title-h5 darker-60 text-white p-2 flex">
					<svg
						width="29"
						height="29"
						viewBox="0 0 29 29"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mr-2"
					>
						<circle cx="14.5" cy="14.5" r="13.4643" stroke="#00D1FF" strokeWidth="2.07143" />
						<path
							d="M10.4194 18.3764H13.3388V13.0404H10.7094V10.8751H16.3161V18.3764H19.3708V20.5417H10.4194V18.3764ZM16.3548 9.61839H12.9521V6.56372H16.3548V9.61839Z"
							fill="#00D1FF"
						/>
					</svg>
					{t('modals.edit.banner')}
				</h5>
			</div>
			<Button onClick={() => handleBtnClick()} size="lg" disabled={step === 2 && !activeCheckbox}>
				{t('modals.edit.button')}
			</Button>
		</BaseModal>
	);
}
