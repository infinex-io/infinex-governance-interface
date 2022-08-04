import { useEffect, useState } from 'react';

export const usePaginate = (pageSize: number, length?: number) => {
	const [activePage, setActivePage] = useState(0);
	const paginate = <T>(arr: T[]) => {
		const startIndex = activePage * pageSize;
		const endIndex =
			arr?.length && startIndex + pageSize > arr?.length ? arr?.length : startIndex + pageSize;
		return arr?.slice(startIndex, endIndex);
	};

	return {
		activePage,
		setActivePage,
		pageSize,
		paginate,
	};
};
