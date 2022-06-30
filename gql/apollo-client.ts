import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	uri: 'https://api.thegraph.com/subgraphs/name/rickk137/synthetix-election',
	cache: new InMemoryCache(),
});

export default client;
