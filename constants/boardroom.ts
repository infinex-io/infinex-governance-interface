const isMainnet = false;
const TEST_NET_URL = `https://xis287baki.execute-api.us-east-1.amazonaws.com`;
const MAIN_NET_URL = `https://api.boardroom.info`;

export const BOARDROOM_SIGNIN_API_URL = `${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/siwe/signIn`;
export const BOARDROOM_SIGNOUT_API_URL = `${
	isMainnet ? MAIN_NET_URL : TEST_NET_URL
}/v1/siwe/signOut`;
export const NONCE_API_URL = `${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/siwe/nonce`;
export const VALID_UUID_API_URL = `${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/siwe/me`;
export const GET_USER_DETAILS_API_URL = (address: string) =>
	`${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/userDetails/${address}`;
export const UPDATE_USER_DETAILS_API_URL = (address: string) =>
	`${isMainnet ? MAIN_NET_URL : TEST_NET_URL}/v1/userDetails/${address}`;
