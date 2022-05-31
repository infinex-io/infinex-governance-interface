import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { Flex } from 'components/old-ui';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
import { capitalizeString } from 'utils/capitalize';
import { truncateAddress } from 'utils/truncate-address';
import { useAccount } from 'wagmi';
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
	const { ensName } = useConnectorContext();
	const { data } = useAccount();
	const { setTxHash, setContent, setVisible, state, visible, setState } =
		useTransactionModalContext();
	const withdrawNomination = useWithdrawNominationMutation(deployedModule);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				queryClient.resetQueries({
					queryKey: 'nominees',
				});
				setIsOpen(false);
				setVisible(false);
				push('/profile/' + data?.address);
			}, 2000);
		}
	}, [state, push, setIsOpen, data?.address, setVisible, visible, queryClient, council]);

	const handleWithdrawNomination = async () => {
		setState('signing');
		setVisible(true);
		setContent(
			<>
				<h6 className="tg-tile-h6">
					{t('modals.withdraw.nomination-for', { council: capitalizeString(council) })}
				</h6>
				<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(data?.address!)}</h3>
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
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>
					{t('modals.withdraw.nomination-for', { council: capitalizeString(council) })}
				</StyledBlackBoxSubline>
				<StyledWalletAddress>{ensName || truncateAddress(data?.address!)}</StyledWalletAddress>
			</StyledBlackBox>
			<Button onClick={() => handleWithdrawNomination()}>{t('modals.withdraw.button')}</Button>
		</BaseModal>
	);
}

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	height: 80px;
	padding: 16px 50px;
	margin-bottom: ${({ theme }) => theme.spacings.medium};
`;

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 0.75rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledWalletAddress = styled.h3`
	font-family: 'Inter Bold';
	font-size: 1.5rem;
	margin: ${({ theme }) => theme.spacings.tiniest};
	color: ${({ theme }) => theme.colors.white};
`;

const StyledCheckboxWrapper = styled(Flex)`
	margin: ${({ theme }) => theme.spacings.superBig} 0px;
	width: 100%;
	> * {
		margin: ${({ theme }) => theme.spacings.medium};
	}
`;
const StyledButton = styled(Button)`
	max-width: 312px;
`;
