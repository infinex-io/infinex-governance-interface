import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import BaseModal from '../BaseModal';
import useCastMutation from 'mutations/voting/useCastMutation';
import { DeployedModules } from 'containers/Modules/Modules';
import { truncateAddress } from 'utils/truncate-address';
import { capitalizeString } from 'utils/capitalize';
import Avatar from 'components/Avatar';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { useEffect } from 'react';

interface VoteModalProps {
	member: Pick<GetUserDetails, 'address' | 'ens' | 'pfpThumbnailUrl' | 'about'>;
	deployedModule: DeployedModules;
	council: string;
}

export default function VoteModal({ member, deployedModule, council }: VoteModalProps) {
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();
	const { push } = useRouter();
	const castVoteMutation = useCastMutation(deployedModule);
	const { setVisible, setContent, state, setTxHash, visible, setState } =
		useTransactionModalContext();
	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				setVisible(false);
				setIsOpen(false);
				push('/profile/' + member.address);
			}, 2000);
		}
	}, [state, setVisible, setIsOpen, push, member.address, visible]);
	const handleVote = async () => {
		setState('signing');
		setVisible(true);
		try {
			setContent(
				<>
					<h6 className="tg-title-h6">{t('modals.vote.cta', { council: 'Spartan' })}</h6>
					<h3 className="tg-title-h3">{member.ens || truncateAddress(member.address)}</h3>
				</>
			);
			const tx = await castVoteMutation.mutateAsync([member.address]);
			setTxHash(tx.hash);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<BaseModal headline={t('modals.vote.headline', { council: capitalizeString(council) })}>
			{member.pfpThumbnailUrl && (
				<Avatar
					width={160}
					height={160}
					walletAddress={member.address}
					url={member.pfpThumbnailUrl}
				/>
			)}
			{member?.ens ? (
				<h4 className="tg-title-h4 text-white">{member.ens}</h4>
			) : (
				<h4 className="tg-title-h4 text-white">{truncateAddress(member.address)}</h4>
			)}
			<span className="text-gray-500 max-w-[300px]">{member.about}</span>
			<Button onClick={() => handleVote()} size="lg" className="m-6">
				{t('modals.vote.submit')}
			</Button>
			<Button
				size="lg"
				variant="outline"
				onClick={() => {
					setIsOpen(false);
					push('/profile/' + member.address);
				}}
			>
				{t('modals.vote.profile')}
			</Button>
		</BaseModal>
	);
}
