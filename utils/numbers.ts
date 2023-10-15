// numberUtils.ts

/**
 * Format a number as a percentage with 2 decimal places.
 * @param num - The number to be formatted.
 * @return The formatted percentage string or "Loading..." if undefined.
 */
export const formatPercent = (num: number | undefined): string => {
	if (typeof num === 'undefined') {
		return 'Loading...';
	}
	if (num >= 0 && num < 100) {
		return `${num.toFixed(2)}%`;
	} else if (num >= 100) {
		return `Pending calculation`;
	} else {
		return `0%`;
	}
};

/**
 * Format a number generally with 2 decimal places and locale-specific formatting.
 * @param num - The number to be formatted.
 * @param locale - The locale for formatting. Default is 'en-US'.
 * @return The formatted number string or "Loading..." if undefined.
 */
export const formatNumberWithLocale = (
	num: number | undefined,
	locale: string = 'en-US'
): string => {
	if (typeof num === 'undefined' || typeof locale === 'undefined') {
		return 'Loading...';
	}
	return num.toLocaleString(locale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};
