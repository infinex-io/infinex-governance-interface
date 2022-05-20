import { Button } from 'components/old-ui';
import { useModalContext } from 'containers/Modal';
import { useRouter } from 'next/router';
import useUserDetailsQuery, { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BaseModal from '../BaseModal';
import useCastMutation from 'mutations/voting/useCastMutation';
import { DeployedModules } from 'containers/Modules/Modules';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useEffect, useState } from 'react';
import { parseURL } from 'utils/ipfs';
import { H4 } from 'components/Headlines/H4';
import { truncateAddress } from 'utils/truncate-address';
import Image from 'next/image';

interface VoteModalProps {
	member: GetUserDetails;
	deployedModule: DeployedModules;
	council: string;
}

export default function VoteModal({ member, deployedModule, council }: VoteModalProps) {
	const { data } = useUserDetailsQuery(member.address);
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();
	const { push } = useRouter();
	const castVoteMutation = useCastMutation(deployedModule);
	const handleVote = async () => {
		const tx = await castVoteMutation.mutateAsync([member.address]);
		if (tx) {
			push('/profile/' + member.address);
			setIsOpen(false);
		}
	};
	return (
		<BaseModal headline={t('modals.vote.headline', { council })}>
			{data && data.pfpThumbnailUrl && (
				<Image
					className="rounded-full"
					width={90}
					height={90}
					src={parseURL(member.pfpThumbnailUrl)}
					alt="ens avatar"
				/>
			)}
			{data?.ens ? <H4>{data.ens}</H4> : <H4>{truncateAddress(data?.address || '')}</H4>}
			<StyledSubmitButton onClick={() => handleVote()} variant="primary">
				{t('modals.vote.submit')}
			</StyledSubmitButton>
			<StyledProfileButton variant="secondary" onClick={() => push('/profile/' + member.address)}>
				{t('modals.vote.profile')}
			</StyledProfileButton>
		</BaseModal>
	);
}

const councilDic = [
	{
		name: 'Spartan',
		module: DeployedModules.SPARTAN_COUNCIL,
	},
	{
		name: 'Grants',
		module: DeployedModules.GRANTS_COUNCIL,
	},
	{
		name: 'Ambassador',
		module: DeployedModules.AMBASSADOR_COUNCIL,
	},
	{
		name: 'Treasury',
		module: DeployedModules.TREASURY_COUNCIL,
	},
];

const parseNomination = (nominations: boolean[]) => {
	const [nominationInfo] = nominations.map((nomination, index) => {
		if (nomination) {
			return councilDic[index];
		}
	});
	console.log(nominationInfo);
	return nominationInfo;
};

const StyledSubmitButton = styled(Button)`
	min-width: 280px;
	margin: ${({ theme }) => theme.spacings.medium};
	max-width: 240px;
`;

const StyledProfileButton = styled(Button)`
	min-width: 280px;
	max-width: 240px;
`;
