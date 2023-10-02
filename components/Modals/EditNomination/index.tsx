import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import { useTranslation } from 'react-i18next';
import BaseModal from '../BaseModal';
import { truncateAddress } from 'utils/truncate-address';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import { useEffect, useState } from 'react';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import { capitalizeString } from 'utils/capitalize';
import { Button, Checkbox, useTransactionModalContext } from '@synthetixio/ui';
import { useModalContext } from 'containers/Modal';
import { useQueryClient } from 'react-query';
import { ConnectButton } from 'components/ConnectButton';
import { COUNCILS_DICTIONARY } from 'constants/config';

interface EditModalProps {
	council: string;
	deployedModule: DeployedModules;
}

export default function EditNominationModal({ deployedModule, council }: EditModalProps) {
	const { t } = useTranslation();
	const { ensName, walletAddress, isWalletConnected } = useConnectorContext();
	const { push } = useRouter();
	const { setContent, setTxHash, setVisible, state, setState } = useTransactionModalContext();
	const withdrawMutation = useWithdrawNominationMutation(deployedModule);
	const [step, setStep] = useState(1);
	const { setIsOpen } = useModalContext();
	const queryClient = useQueryClient();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const nominateForTradeCouncil = useNominateMutation(DeployedModules.TRADE_COUNCIL);
	const nominateForEcosystemCouncil = useNominateMutation(DeployedModules.ECOSYSTEM_COUNCIL);
	const nominateForCoreContributorCouncil = useNominateMutation(DeployedModules.CORE_CONTRIBUTOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);
	const periodsData = useCurrentPeriods();

	const shouldBeDisabled = (council: string) => {
		const periodForCouncil = periodsData.find((periodData) => periodData.data?.council === council);
		return periodForCouncil?.data ? periodForCouncil.data?.currentPeriod !== 'NOMINATION' : true;
	};

	useEffect(() => {
		if (state === 'confirmed' && step === 1) {
			setStep(2);
			setVisible(false);
			setState('signing');
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient.refetchQueries({ stale: true, active: true });
		}
		if (state === 'confirmed' && step === 2) {
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient.refetchQueries({ stale: true, active: true }).then(() => {
				push('/councils/'.concat(activeCheckbox));
				setVisible(false);
				setIsOpen(false);
				setState('signing');
			});
		}
	}, [state, step, setVisible, push, setState, setIsOpen, queryClient, activeCheckbox]);

	useEffect(() => {
		setStep(1);
	}, []);

	const handleBtnClick = async () => {
		if (step === 1) {
			setState('signing');
			setContent(
				<>
					<h6 className="tg-title-h6">
						{t('modals.edit.cta-step-1-head', { council: capitalizeString(council) })}
					</h6>
					<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(walletAddress!)}</h3>
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
					<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(walletAddress!)}</h3>
				</>
			);
			setVisible(true);
			try {
				switch (activeCheckbox) {
					case 'trade':
						const tradeTx = await nominateForTradeCouncil.mutateAsync();
						setTxHash(tradeTx.hash);
						break;
					case 'ecosystem':
						const ecosystemTx = await nominateForEcosystemCouncil.mutateAsync();
						setTxHash(ecosystemTx.hash);
						break;
					case 'coreContributor':
						const coreContributorTx = await nominateForCoreContributorCouncil.mutateAsync();
						setTxHash(coreContributorTx.hash);
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
			<span className="max-w-[600px] tg-content text-gray-500 text-center my-1 mb-4 px-2">
				You can only nominate for 1 council at any given time. In order to change your nomination
				from one council to another you must first select your new council and click save. You will
				be need to sign 2 transactions in order to change.
			</span>
			{!isWalletConnected ? (
				<ConnectButton />
			) : (
				<div className="px-2 flex flex-col items-center max-w-[850px] w-full">
					<div className="flex flex-col justify-center items-center bg-black px-4 py-6 w-full">
						{step === 1 ? (
							<div className="flex flex-col items-center ">
								<div className="flex justify-center items-center w-[100px] mb-4">
									<div className="bg-purple rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
										1
									</div>
									<div className="min-w-full h-[1px] bg-purple"></div>
									<div className="bg-gray-500 rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
										2
									</div>
								</div>
								<h5 className="tg-title-h5 text-white">{t('modals.edit.step-one')}</h5>
								<div className="border-gray-500 rounded border p-4 m-4 flex flex-col items-center">
									<h5 className="tg-title-h5 text-gray-300 mb-1">{t('modals.edit.current')}</h5>
									<h3 className="tg-title-h3 text-white">
										{ensName ? ensName : walletAddress && truncateAddress(walletAddress)}
									</h3>
								</div>
								<div className="bg-primary p-[2px] rounded">
									<div className="darker-60 text-primary py-1 px-6 rounded">
										{t('modals.edit.council', { council: capitalizeString(council) })}
									</div>
								</div>
							</div>
						) : (
							<>
								<div className="flex justify-center items-center w-[100px] mb-4">
									<div className="bg-green rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-black tg-caption flex flex-col items-center justify-center">
										1
									</div>
									<div className="min-w-full h-[1px] bg-green"></div>
									<div className="bg-purple rounded-full min-w-[28px] min-h-[28px] max-w-[30px] max-h-[30px] text-white tg-caption flex flex-col items-center justify-center">
										2
									</div>
								</div>
								<h5 className="tg-title-h5 text-white m-2 mb-4">{t('modals.edit.step-two')}</h5>
								<div className="flex justify-between md:flex-row flex-col w-full flex-wrap gap-4">
									{COUNCILS_DICTIONARY.map((council) => (
										<Checkbox
											key={`${council.slug}-council-checkbox`}
											id={`${council.slug}-council-checkbox`}
											onChange={() => setActiveCheckbox(council.slug)}
											label={t('modals.nomination.checkboxes.'.concat(council.slug))}
											color="lightBlue"
											checked={activeCheckbox === council.slug}
											disabled={shouldBeDisabled(council.slug)}
										/>
									))}
								</div>
							</>
						)}
					</div>
					<div className="border-l-primary border-l-4 bg-primary mb-4 w-full">
						<h5 className="tg-title-h5 darker-60 text-white p-2 flex items-center">
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
					<Button
						className="w-full mb-8"
						onClick={() => handleBtnClick()}
						size="lg"
						disabled={step === 2 && !activeCheckbox}
					>
						{t('modals.edit.button')}
					</Button>
				</div>
			)}
		</BaseModal>
	);
}
