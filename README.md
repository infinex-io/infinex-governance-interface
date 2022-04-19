# Governance Module V3 Interface

## Setting up a development flow

The development flow uses Hardhat Local Host with the following configurations

const LOCAL_HOST_URL = 'http://127.0.0.1:8545';
const HARDHAT_LOCALHOST_CHAIN_ID = 31337;

1. Start a local node - using the `npx hardhat cannon` command (if you need to run/modify configurations on the node, refer to the [`synthetix-v3/governance-modules`](https://github.com/Synthetixio/synthetix-v3/tree/main/packages/governance-modules) repo)
2. Configure Metamask Network to use Hardhat Local Host (should be a predefined network on metamask but if not can import your own with the above configurations)
3. Import addresses to metamask
4. When connecting, useDapp will initiate a contract deployment - this is the multicall contract that the library depends on - approve this contract deployment with a hardhat account
5. Interact with the UI (i.e connect wallet, disconnect and query contract views and functions)
