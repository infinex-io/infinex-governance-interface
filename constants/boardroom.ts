const isMainnet = true;
const TEST_NET_URL = `https://xis287baki.execute-api.us-east-1.amazonaws.com`;
const MAIN_NET_URL = `https://api.boardroom.info`;

const BASE_URL = isMainnet ? MAIN_NET_URL : TEST_NET_URL;

// POST
export const BOARDROOM_SIGNIN_API_URL = `${BASE_URL}/v1/siwe/signIn`;
// POST
export const BOARDROOM_SIGNOUT_API_URL = `${BASE_URL}/v1/siwe/signOut`;
// POST
export const NONCE_API_URL = `${BASE_URL}/v1/siwe/nonce`;
// POST
export const VALID_UUID_API_URL = `${BASE_URL}/v1/siwe/me`;
// POST
export const GET_USER_DETAILS_API_URL = (address: string) =>
	`${BASE_URL}/v1/userDetails/${address}`;
// POST
export const GET_BATCH_USER_DETAILS_API_URL = (addresses: string) =>
	`${BASE_URL}/v1/batchUserDetails?addresses=${addresses}`;
// GET
export const GET_USER_PITCH_FOR_PROTCOL_API_URL = (protocol: string, address: string) =>
	`${BASE_URL}/v1/getDelegationPitch/${protocol}/${address}`;
// GET
export const GET_PITCHES_FOR_PROTOCOL_API_URL = (protocol: string) =>
	`${BASE_URL}/v1/getDelegationPitchesByProtocol/${protocol}`;
// GET
export const GET_PITCHES_FOR_USER_API_URL = (address: string) =>
	`${BASE_URL}/v1/getDelegationPitchesByAddress/${address}`;
// POST
export const UPDATE_USER_DETAILS_API_URL = (address: string) =>
	`${BASE_URL}/v1/updateUserDetails/${address}`;
// POST
export const UPDATE_USER_PITCH_FOR_PROTOCOL = `${BASE_URL}/v1/updateDelegationPitch`;
