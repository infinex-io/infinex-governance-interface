import { PropsWithChildren } from 'react';

export default function Main({ children }: PropsWithChildren<{}>) {
	return <main className="bg-dark-blue text-white min-height-[90vh]">{children}</main>;
}
