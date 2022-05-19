export const capitalizeString = (str?: string) => {
	if (!str) return;
	return str.charAt(0).toUpperCase().concat(str.slice(1));
};
