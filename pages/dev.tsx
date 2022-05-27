import { DeployedModules } from 'containers/Modules';
import useCouncilMemberHistoryQuery from 'queries/eventHistory/useCouncilMemberHistoryQuery';
import useNominationHistoryQuery from 'queries/eventHistory/useNominationHistoryQuery';
import useVoteHistoryQuery from 'queries/eventHistory/useVoteHistoryQuery';
import { usePreEvaluationVotingPowerQuery } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { useState } from 'react';

export default function Dev() {
	const [epochIndex, setEpochIndex] = useState<string>('0');
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

	const voting = usePreEvaluationVotingPowerQuery(DeployedModules.SPARTAN_COUNCIL, epochIndex);

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
					votes.refetch();
					nomination.refetch();
				}}
			>
				refetch
			</button>
			<hr />
			<h1>Live Voting</h1>
			{voting.data &&
				voting.data.map((e, i) => {
					return (
						<li key={i}>
							<ul>
								<h2>BallotId: {e.ballotId}</h2>
							</ul>
							<ul>Total Voting Power: {Number(e.totalVotingPower)}</ul>
							<ul>Voters:</ul>
							{e.voters.map((e) => (
								<>
									<hr />
									<p>{e}</p>
									<hr />
								</>
							))}
							<ul>Voting Powers:</ul>
							{e.votingPowers.map((e) => (
								<>
									<hr />
									<p>{Number(e)}</p>
									<hr />
								</>
							))}
							<hr />
						</li>
					);
				})}
			<hr />
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
			<hr />
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
			<hr />
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
			<hr />
		</div>
	);
}
