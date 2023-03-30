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
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useModulesContext } from 'containers/Modules/index';
import { getCrossChainClaim } from 'mutations/voting/useCastMutation';
import { BigNumber, Contract, utils } from 'ethers';
import { useConnectorContext } from 'containers/Connector';
import { ConnectButton } from 'components/ConnectButton';
import Wei from '@synthetixio/wei';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

interface VoteModalProps {
	member: Pick<GetUserDetails, 'address' | 'ens' | 'pfpThumbnailUrl' | 'about'>;
	deployedModule: DeployedModules;
	council: string;
}

export default function VoteModal({ member, deployedModule, council }: VoteModalProps) {
	const { connected, safe, sdk } = useSafeAppsSDK();
	const [hasSafeVoted, setHasSafeVoted] = useState(false);
	const { t } = useTranslation();
	const { setIsOpen } = useModalContext();
	const { walletAddress, isWalletConnected } = useConnectorContext();
	const governanceModules = useModulesContext();
	const [votingPower, setVotingPower] = useState({ l1: new Wei(0), l2: new Wei(0) });
	const { push } = useRouter();
	const queryClient = useQueryClient();
	const castVoteMutation = useCastMutation(deployedModule);
	const { setVisible, setContent, state, setTxHash, visible, setState } =
		useTransactionModalContext();
	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				queryClient.invalidateQueries('voting-result');
				queryClient.invalidateQueries(['getCurrentVoteStateQuery', walletAddress]);
				queryClient.resetQueries({
					active: true,
					stale: true,
					inactive: true,
				});

				push('/profile/' + member.address);
				setVisible(false);
				setIsOpen(false);
			}, 2000);
		}
	}, [
		state,
		setVisible,
		setIsOpen,
		push,
		member.address,
		visible,
		queryClient,
		deployedModule,
		walletAddress,
	]);

	useEffect(() => {
		if (safe.safeAddress && connected && governanceModules[deployedModule]?.contract) {
			governanceModules[deployedModule]!.contract.getDeclaredCrossChainDebtShare(
				safe.safeAddress
			).then((declared: BigNumber) => {
				if (declared.eq(0)) {
					setHasSafeVoted(false);
				} else {
					setHasSafeVoted(true);
				}
			});
			getCrossChainClaim(governanceModules[deployedModule]!.contract, safe.safeAddress).then(
				(data) => {
					if (data) {
						setVotingPower((state) => ({ ...state, l1: new Wei(BigNumber.from(data.amount)) }));
					}
				}
			);
		} else if (walletAddress && governanceModules[deployedModule]?.contract) {
			getCrossChainClaim(governanceModules[deployedModule]!.contract, walletAddress).then(
				(data) => {
					if (data) {
						setVotingPower((state) => ({ ...state, l1: new Wei(BigNumber.from(data.amount)) }));
					}
				}
			);
			governanceModules[deployedModule]?.contract
				.getDebtShare(walletAddress)
				.then((share: BigNumber) => {
					setVotingPower((state) => ({ ...state, l2: new Wei(share) }));
				});
		}
	}, [walletAddress, governanceModules, deployedModule, safe.safeAddress, connected]);

	const handleVote = async () => {
		setState('signing');
		setVisible(true);
		try {
			if (safe.chainId === 1 && connected && !!governanceModules[deployedModule]?.contract) {
				const one = governanceModules[deployedModule]!.contract.interface.encodeFunctionData(
					'castRelayed',
					[safe.safeAddress, [member.address]]
				);
				const treeData = await getCrossChainClaim(
					governanceModules[deployedModule]!.contract,
					safe.safeAddress
				);
				const two = governanceModules[deployedModule]!.contract.interface.encodeFunctionData(
					'declareAndCastRelayed',
					[safe.safeAddress, treeData!.amount, treeData!.proof, [member.address]]
				);
				console.log(one, two);
				if (hasSafeVoted) {
					const data = governanceModules[deployedModule]!.contract.interface.encodeFunctionData(
						'castRelayed',
						[safe.safeAddress, [member.address]]
					);
					// https://etherscan.io/address/0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1
					const messengerData = new Contract('0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1', [
						'function sendMessage(address _target, bytes memory _message, uint32 _gasLimit) public',
					]).contract.interface.encodeFunctionData('sendMessage', [
						governanceModules[deployedModule]?.contract.address,
						data,
						0,
					]);
					console.log(data);
					await sdk.txs.send({
						txs: [
							{
								to: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
								data: messengerData,
								value: '0',
							},
						],
					});
					setState('confirmed');
				} else {
					const treeData = await getCrossChainClaim(
						governanceModules[deployedModule]!.contract,
						safe.safeAddress
					);
					if (treeData) {
						const data = governanceModules[deployedModule]!.contract.interface.encodeFunctionData(
							'declareAndCastRelayed',
							[safe.safeAddress, treeData.amount, treeData.proof, [member.address]]
						);
						console.log(data);
						// https://etherscan.io/address/0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1
						const messengerData = new Contract('0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1', [
							'function sendMessage(address _target, bytes memory _message, uint32 _gasLimit) public',
						]).contract.interface.encodeFunctionData('sendMessage', [
							governanceModules[deployedModule]?.contract.address,
							data,
							0,
						]);

						await sdk.txs.send({
							txs: [
								{
									to: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
									data: messengerData,
									value: '0',
								},
							],
						});
						setState('confirmed');
					} else {
						console.error('could not found address in merkle tree');
						setState('error');
					}
				}
			} else {
				setContent(
					<>
						<h6 className="tg-title-h6">
							{t('modals.vote.cta', { council: capitalizeString(council) })}
						</h6>
						<h3 className="tg-title-h3">{member.ens || truncateAddress(member.address)}</h3>
					</>
				);
				const tx = await castVoteMutation.mutateAsync([member.address]);
				setTxHash(tx.hash);
			}
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};

	return (
		<BaseModal headline={t('modals.vote.headline', { council: capitalizeString(council) })}>
			<div className="max-w-[500px] flex flex-col items-center px-2">
				<span className="text-center tg-body text-gray-500 mt-2">{t('modals.vote.subline')}</span>
				<Avatar
					scale={12}
					width={90}
					height={90}
					walletAddress={member.address}
					url={member.pfpThumbnailUrl}
					className="md:mt-10 mb-8 mt-8"
				/>
				<h3 className="tg-title-h3 text-white md:pb-4">
					{member.ens || truncateAddress(member.address)}
				</h3>
				<span className="text-gray-500 max-w-[500px] overflow-y-auto max-h-[100px] text-center hidden md:block">
					{member.about}
				</span>
				<div className="flex flex-col items-center border-gray-700 border rounded bg-black text-white mt-4 md:p-4 w-full">
					<h5 className="tg-title-h5 mt-4 mb-2 mx-4">{t('modals.vote.voting-power.headline')}</h5>
					<h4 className="pb-4 gt-america-condensed-bold-font text-2xl truncate max-w-[350px] md:max-w-[460px]">
						{utils.formatUnits(
							deployedModule === 'treasury council'
								? votingPower.l1.add(votingPower.l2).toBN().toString()
								: bnSqrt(votingPower.l1.add(votingPower.l2).toBN()).toString(),
							'wei'
						)}
					</h4>
				</div>
				{!isWalletConnected ? (
					<div className="m-6">
						<ConnectButton />
					</div>
				) : (
					<Button
						onClick={() => handleVote()}
						size="lg"
						className="m-6 w-full"
						disabled={votingPower.l1.eq(0) && votingPower.l2.eq(0)}
					>
						{t('modals.vote.submit')}
					</Button>
				)}
				<Button
					className="w-full"
					size="lg"
					variant="outline"
					onClick={() => {
						setIsOpen(false);
						push('/profile/' + member.address);
					}}
				>
					{t('modals.vote.profile')}
				</Button>
			</div>
		</BaseModal>
	);
}

const BN_ONE = BigNumber.from(1);
const BN_TWO = BigNumber.from(2);

function bnSqrt(value: BigNumber) {
	let z = value.add(BN_ONE).div(BN_TWO);
	let y = value;

	while (z.sub(y).isNegative()) {
		y = z;
		z = value.div(z).add(z).div(BN_TWO);
	}

	return y;
}
