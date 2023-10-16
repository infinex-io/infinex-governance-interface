const rooms = [
	{
		type: 'cex',
		key: 1,
		name: 'Binance Forecourt',
		description: 'Lock BNB\\nProve trading history',
		emoji: '⛲',
		token: 'BNB',
		exchange_id: 'Binance',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		extra_details: 'Only BNB on the binance smart chain will be detected.',
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/binance-guide',
	},
	{
		type: 'dex',
		key: 14,
		name: 'Spartan Grounds',
		description: 'Prove PerpsV2 volume',
		emoji: '⚔️',
		token: '',
		exchange_id: 'SNX',
		needsApiPass: false,
		linking: true,
		locking: false,
		dex: true,
	},
	{
		type: 'dex',
		key: 13,
		name: 'AMM Sauna',
		description: 'Prove volume on Curve, Sushi and Uniswap',
		emoji: '🦄',
		token: '',
		info: 'Volumes on Uniswap, Sushiswap and Curve will be checked across 14 different chains.',
		exchange_id: 'Spot Dex',
		needsApiPass: false,
		linking: true,
		locking: false,
		dex: true,
	},
	{
		type: 'cex',
		key: 2,
		name: 'FTX Panic Room',
		description: 'Lock FTT',
		emoji: '🫣',
		token: 'FTT',
		exchange_id: 'FTX',
		needsApiPass: false,
		linking: false,
		locking: true,
		dex: false,
	},
	{
		type: 'cex',
		key: 3,
		name: 'Kucoin Scullery',
		description: 'Lock KCS\\nProve trading history',
		emoji: '🛖',
		token: 'KCS',
		exchange_id: 'Kucoin',
		needsApiPass: true,
		linking: true,
		locking: true,
		dex: false,
		extra_details: 'Only KCS on Ethereum Mainnet will be detected.',
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/kucoin-guide',
	},
	// {type:"cex", key: 4, name: "His Excellency’s Chambers", description: "Lock HT, Earn Voting Power", emoji: "🧖‍♂️", token: "HT", exchange_id: "Huobi", needsApiPass: false},
	{
		type: 'cex',
		key: 5,
		name: 'BitMex Ballroom',
		description: 'Lock BMEX\\nProve trading history',
		emoji: '💃',
		token: 'BMEX',
		exchange_id: 'Bitmex',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/bitmex-guide',
	},
	// {
	// 	type: 'dex',
	// 	key: 6,
	// 	name: 'dYdX Observatory',
	// 	description: 'Lock dYdX\\nEarn Voting Power',
	// 	emoji: '🔭',
	// 	token: 'DYDX',
	// 	exchange_id: 'Dydx',
	// 	info: 'We track your deposits to dYdX layer 2',
	// 	needsApiPass: false,
	// 	linking: true,
	// 	locking: true,
	// 	dex: true,
	// },
	{
		type: 'dex',
		key: 7,
		name: 'Blueberry Fields',
		description: 'Lock GMX\\nProve trading history',
		emoji: '🫐',
		token: 'GMX',
		info: 'Volume traded on Arbirtum and Avalanche will be detected.',
		exchange_id: 'GMX',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: true,
	},
	{
		type: 'cex',
		key: 8,
		name: 'Bybit Pillow Chamber',
		description: 'Lock MNT\\nProve trading history',
		emoji: '🌖',
		token: 'MNT',
		exchange_id: 'Bybit',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		extra_details: 'Only MNT on Ethereum Mainnet will be detected.',
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/bybit-guide',
	},
	{
		type: 'cex',
		key: 9,
		name: 'OKX Pitstop',
		description: 'Lock OKB\\nProve trading history',
		emoji: '🏁',
		token: 'OKB',
		exchange_id: 'OKX',
		needsApiPass: true,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/okx-guide',
	},
	{
		type: 'cex',
		key: 10,
		name: 'The Bitget Laundromat',
		description: 'Lock BGB\\nProve trading history',
		emoji: '🧺',
		token: 'BGB',
		exchange_id: 'Bitget',
		needsApiPass: true,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/bitget-guide',
	},
	{
		type: 'cex',
		key: 11,
		name: 'MEXC Nursery',
		description: 'Lock MX\\nProve trading history',
		emoji: '🤱',
		token: 'MX',
		exchange_id: 'MEXC',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/mexc-guide',
	},
	{
		type: 'cex',
		key: 12,
		name: 'Kraken Quarters',
		description: 'Prove trading history',
		emoji: '🐙',
		token: '',
		exchange_id: 'Kraken',
		info: 'Kraken trading history takes some time to calculate – please be patient while waiting for your results.',
		needsApiPass: false,
		linking: true,
		locking: false,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/kraken-guide',
	},
];

export default rooms;
