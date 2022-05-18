import { DeployedModules } from 'containers/Modules/Modules';
import useCouncilMemberHistoryQuery from 'queries/historical/useCouncilMemberHistoryQuery';
import useNominationHistoryQuery from 'queries/historical/useNominationHistoryQuery';
import useVoteHistoryQuery from 'queries/historical/useVoteHistoryQuery';
import { useState } from 'react';

export default function Dev() {
	const [epochIndex, setEpochIndex] = useState<string>('');
	const [wallet, setWallet] = useState<string>('');
	const [ballotId, setBallotId] = useState<string>('');

	const nomination = useNominationHistoryQuery(
		DeployedModules.SPARTAN_COUNCIL,
		wallet.length > 0 ? wallet : null,
		epochIndex.length > 0 ? epochIndex : null
	);
	const votes = useVoteHistoryQuery(
		DeployedModules.SPARTAN_COUNCIL,
		wallet.length > 0 ? wallet : null,
		ballotId.length > 0 ? ballotId : null,
		epochIndex.length > 0 ? epochIndex : null
	);
	const members = useCouncilMemberHistoryQuery(
		DeployedModules.SPARTAN_COUNCIL,
		wallet.length > 0 ? wallet : null,
		epochIndex.length > 0 ? epochIndex : null
	);

	return (
		<div style={{ color: 'white', padding: '20px', margin: 'auto', paddingLeft: '200px' }}>
			<p>Epoch Index</p>
			<input value={epochIndex} onChange={(e) => setEpochIndex(e.target.value)} />
			<p>Wallet</p>
			<input value={wallet} onChange={(e) => setWallet(e.target.value)} />
			<p>Ballot Id</p>
			<input value={ballotId} onChange={(e) => setBallotId(e.target.value)} />
			<button
				onClick={() => {
					members.refetch();
				}}
			>
				refetch
			</button>
			<h1>Nominees</h1>
			{epochIndex} for {wallet}
			{nomination.data &&
				nomination.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>Nominee: {e}</ul>
							<hr />
						</li>
					);
				})}
			<p>------</p>
			<h1>Votes</h1>
			{epochIndex} for {wallet}
			{votes.data &&
				votes.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>Voter: {e.voter}</ul>
							<ul>BallotId: {e.ballotId}</ul>
							<ul>Voting Power: {Number(e.voterPower)}</ul>
							<hr />
						</li>
					);
				})}
			<p>------</p>
			<h1>Members</h1>
			<h2>
				{epochIndex} for {wallet}
			</h2>
			{members.data &&
				members.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>Member: {e}</ul>
							<hr />
						</li>
					);
				})}
		</div>
	);
}
