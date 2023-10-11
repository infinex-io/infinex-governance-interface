export const capitalizeString = (str?: string) => {
	if (!str) return;
	if (str.toLowerCase() === "corecontributor") return "Core Contributor"
	return str.charAt(0).toUpperCase().concat(str.slice(1));
};
