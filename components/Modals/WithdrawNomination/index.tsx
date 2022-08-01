import { ConnectButton } from 'components/ConnectButton';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { capitalizeString } from 'utils/capitalize';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';

interface WithdrawNominationModalProps {
	deployedModule: DeployedModules;
	council: string;
}

export default function WithdrawNominationModal({
	deployedModule,
	council,
}: WithdrawNominationModalProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const { ensName, walletAddress, isWalletConnected } = useConnectorContext();
	const { setTxHash, setContent, setVisible, state, visible, setState } =
		useTransactionModalContext();
	const withdrawNomination = useWithdrawNominationMutation(deployedModule);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (state === 'confirmed' && visible) {
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient
				.refetchQueries({
					stale: true,
					active: true,
				})
				.then(() => {
					setIsOpen(false);
					setVisible(false);
					push('/profile/' + walletAddress);
				});
		}
	}, [
		state,
		push,
		setIsOpen,
		walletAddress,
		setVisible,
		visible,
		queryClient,
		council,
		deployedModule,
	]);

	const handleWithdrawNomination = async () => {
		setState('signing');
		setVisible(true);
		setContent(
			<>
				<h6 className="tg-tile-h6">
					{t('modals.withdraw.nomination-for', { council: capitalizeString(council) })}
				</h6>
				<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(walletAddress!)}</h3>
			</>
		);
		try {
			const tx = await withdrawNomination.mutateAsync();
			setTxHash(tx.hash);
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};

	return (
		<BaseModal headline={t('modals.withdraw.headline')}>
			{!isWalletConnected ? (
				<ConnectButton />
			) : (
				<div className="px-2 flex flex-col items-center max-w-[500px]">
					<span className="tg-content text-gray-500 py-2 text-center">
						{t('modals.withdraw.subline')}
					</span>

					<div className="flex flex-col items-center px-12 py-8 rounded m-4 bg-black w-full">
						<h5 className="tg-title-h5 text-gray-300 mb-1">
							{t('modals.withdraw.nomination-for', { council: capitalizeString(council) })}
						</h5>
						<h3 className="text-white tg-title-h3">{ensName || truncateAddress(walletAddress!)}</h3>
					</div>
					<Button onClick={() => handleWithdrawNomination()} className="w-full md:w-auto">
						{t('modals.withdraw.button')}
					</Button>
				</div>
			)}
		</BaseModal>
	);
}
