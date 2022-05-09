import { Button, Checkbox, Flex } from '@synthetixio/ui';
import Connector from 'containers/Connector';
import { DeployedModules } from 'containers/Modules/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BaseModal from '../BaseModal';

export default function EditModal() {
	const { t } = useTranslation();
	const { walletAddress, ensName } = Connector.useContainer();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForGrantsCouncil = useNominateMutation(DeployedModules.GRANTS_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);
	return (
		<BaseModal headline={t('modals.edit.headline')}>
			<StyledBlackBox>
				<StyledBlackBoxSubline>{t('modals.edit.subline')}</StyledBlackBoxSubline>
				{ensName
					? ensName
					: walletAddress &&
					  walletAddress
							.substring(0, 5)
							.concat('...')
							.concat(walletAddress.substring(walletAddress.length - 4))}
			</StyledBlackBox>
			<StyledCheckboxWrapper justifyContent="center">
				<Checkbox
					id="spartan-council-checkbox"
					onChange={() => {
						setActiveCheckbox('spartan');
					}}
					label={t('modals.nomination.checkboxes.spartan')}
					color="lightBlue"
					checked={activeCheckbox === 'spartan'}
				/>
				<Checkbox
					id="grants-council-checkbox"
					onChange={() => {
						setActiveCheckbox('grants');
					}}
					label={t('modals.nomination.checkboxes.grants')}
					color="lightBlue"
					checked={activeCheckbox === 'grants'}
				/>
				<Checkbox
					id="ambassador-council-checkbox"
					onChange={() => {
						setActiveCheckbox('ambassador');
					}}
					label={t('modals.nomination.checkboxes.ambassador')}
					color="lightBlue"
					checked={activeCheckbox === 'ambassador'}
				/>
				<Checkbox
					id="treasury-council-checkbox"
					onChange={() => {
						setActiveCheckbox('treasury');
					}}
					label={t('modals.nomination.checkboxes.treasury')}
					color="lightBlue"
					checked={activeCheckbox === 'treasury'}
				/>
			</StyledCheckboxWrapper>
			<StyledEditButton>{t('modals.edit.save')}</StyledEditButton>
		</BaseModal>
	);
}

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	height: 80px;
	padding: 16px 50px;
`;

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledCheckboxWrapper = styled(Flex)`
	margin: ${({ theme }) => theme.spacings.superBig} 0px;
	width: 100%;
	> * {
		margin: ${({ theme }) => theme.spacings.medium};
	}
`;

const StyledEditButton = styled(Button)`
	max-width: 312px;
`;
