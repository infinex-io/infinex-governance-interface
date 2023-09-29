import { useState, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Text,
	Button,
	Box,
	Link,
	ListItem,
	UnorderedList,
} from '@chakra-ui/react';

import { theme } from '@synthetixio/v3-theme';
import { SESSION_STORAGE_KEYS } from '../../../constants/config';

interface TermsModalProps {
	defaultOpen: boolean;
}

export const TermsModal = ({ defaultOpen = true }: TermsModalProps) => {
	const [isOpen, setOpen] = useState(defaultOpen);
	const [enabled, setEnabled] = useState(false);

	const onSubmit = () => {
		sessionStorage.setItem(SESSION_STORAGE_KEYS.TERMS_CONDITIONS_ACCEPTED, JSON.stringify(true));
		setOpen(false);
	};

	return (
		<Modal isOpen={isOpen} onClose={() => {}}>
			<ModalOverlay />
			<ModalContent
				bgGradient={theme.gradients['dark'][500]}
				pt="10"
				pb="3"
				borderWidth="1px"
				borderColor="gray.900"
				data-testid="transaction modal"
			>
				<ModalHeader py={0} textAlign="center" color="white">
					Infinex Terms of Service
				</ModalHeader>
				<ModalBody fontSize="xs" color="gray.600">
					<Text fontSize="sm">
						By clicking “I Agree” below, you agree to be bound by the terms of this Agreement. As
						such, you fully understand that:
					</Text>
					<Box
						onScroll={(e) => {
							const div = e.currentTarget;
							const scrollTopWithTolerance = div.scrollTop + 10;
							if (scrollTopWithTolerance >= div.scrollHeight - div.offsetHeight) {
								setEnabled(true);
							} else {
								setEnabled(false);
							}
						}}
						as="div"
						my={2}
						py={3}
						height="320px"
						overflow="auto"
						css={{
							'&::-webkit-scrollbar': {
								width: '2px',
							},
							'&::-webkit-scrollbar-track': {
								width: '2px',
							},
						}}
					>
						<UnorderedList ml="5px">
							<Text fontSize="14px">
								<ListItem>
									<Link
										href="https://synthetix.io/"
										target="_blank"
										color="cyan.500"
										_focusVisible={{ outline: 'none' }}
									>
										Infinex{' '}
									</Link>
									is a blockchain-based decentralized finance project. You are participating at your
									own risk.
								</ListItem>
								<ListItem mt={2}>
									Infinex is offered for use “as is” and without any guarantees regarding
									security. The protocol is made up of immutable code and can be accessed through a
									variety of user interfaces.
								</ListItem>
								<ListItem mt={2}>
									No central entity operates the Infinex protocol. Decisions related to the
									protocol are governed by a dispersed group of participants who collectively govern
									and maintain the protocol.
								</ListItem>
								<ListItem mt={2}>
									Infinex DAO does not unilaterally offer, maintain, operate, administer, or
									control any trading interfaces. The only user interfaces maintained by Infinex
									DAO are the governance and staking interfaces herein.
								</ListItem>
								<ListItem mt={2}>
									You can participate in the governance process by staking SNX tokens in accordance
									with the rules and parameters summarized{' '}
									<Link
										href="https://governance.synthetix.io/"
										target="_blank"
										color="cyan.500"
										_focusVisible={{ outline: 'none' }}
									>
										here
									</Link>
									, and/or joining the{' '}
									<Link
										color="cyan.500"
										target="_blank"
										href="https://discord.com/invite/AEdUHzt"
										_focusVisible={{ outline: 'none' }}
									>
										Infinex Discord
									</Link>{' '}
									and contributing to the conversation.
								</ListItem>
								<ListItem mt={2}>
									The rules and parameters associated with the Infinex protocol and Infinex DAO
									governance are subject to change at any time.
								</ListItem>
								<ListItem mt={2}>
									Your use of Infinex is conditioned upon your acceptance to be bound by the
									Infinex Term of Use, which can be found{' '}
									<Link
										href="https://staking.synthetix.io/terms"
										target="_blank"
										color="cyan.500"
										_focusVisible={{ outline: 'none' }}
									>
										here
									</Link>
									.
								</ListItem>
								<ListItem mt={2}>
									The laws that apply to your use of Infinex may vary based upon the jurisdiction
									in which you are located. We strongly encourage you to speak with legal counsel in
									your jurisdiction if you have any questions regarding your use of Infinex.
								</ListItem>
								<ListItem mt={2}>
									By entering into this agreement, you are not agreeing to enter into a partnership.
									You understand that Infinex is a decentralized protocol provided on an “as is”
									basis.
								</ListItem>
								<ListItem mt={2}>
									You hereby release all present and future claims against Infinex DAO related to
									your use of the protocol, the SNX token, SNX DAO governance, and any other facet
									of the protocol.
								</ListItem>
								<ListItem mt={2}>
									You agree to indemnify and hold harmless SNX DAO and its affiliates for any costs
									arising out of or relating to your use of the Infinex protocol.
								</ListItem>
								<ListItem mt={2}>
									You are not accessing the protocol from Burma (Myanmar), Cuba, Iran, Sudan, Syria,
									the Western Balkans, Belarus, Côte d’Ivoire, Democratic Republic of the Congo,
									Iraq, Lebanon, Liberia, Libya, North Korea, Russia, certain sanctioned areas of
									Ukraine, Somalia, Venezuela, Yemen, or Zimbabwe (collectively, “Prohibited
									Jurisdictions”), or any other jurisdiction listed as a Specially Designated
									National by the United States Office of Foreign Asset Control (“OFAC”).
								</ListItem>
							</Text>
						</UnorderedList>
					</Box>
				</ModalBody>
				<Button
					isDisabled={!enabled}
					variant="outline"
					_focusVisible={{ outline: 'none' }}
					my={4}
					mx={6}
					onClick={onSubmit}
				>
					I agree
				</Button>
			</ModalContent>
		</Modal>
	);
};
