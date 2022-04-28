export const showBanner = (period: string) => {
	switch (period) {
		case 'NOMINATION':
			return true;
		default:
			return false;
	}
};
