export function parseRemainingTime(dateInSec: number) {
	const difference = dateInSec - new Date().getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	const oneHour = 1000 * 60 * 60;
	const days = Math.floor(difference / oneDay);
	const hours = Math.floor((difference - oneDay * days) / oneHour);
	const minutes = Math.floor((difference - oneDay * days - oneHour * hours) / (1000 * 60));
	return `${days}D ${hours}H ${minutes}M`;
}
