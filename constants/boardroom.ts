const isMainnet = false;
const TEST_NET_URL = `https://xis287baki.execute-api.us-east-1.amazonaws.com`;
const MAIN_NET_URL = `https://api.boardroom.info`;

const BASE_URL = isMainnet ? MAIN_NET_URL : TEST_NET_URL;

export const BOARDROOM_SIGNIN_API_URL = `${BASE_URL}/v1/siwe/signIn`;
export const BOARDROOM_SIGNOUT_API_URL = `${BASE_URL}/v1/siwe/signOut`;
export const NONCE_API_URL = `${BASE_URL}/v1/siwe/nonce`;
export const VALID_UUID_API_URL = `${BASE_URL}/v1/siwe/me`;
export const GET_USER_DETAILS_API_URL = (address: string) =>
	`${BASE_URL}/v1/userDetails/${address}`;
export const GET_BATCH_USER_DETAILS_API_URL = (addresses: string) =>
	`${BASE_URL}/v1/batchUserDetails?addresses=${addresses}`;
export const UPDATE_USER_DETAILS_API_URL = (address: string) =>
	`${BASE_URL}/v1/updateUserDetails/${address}`;
