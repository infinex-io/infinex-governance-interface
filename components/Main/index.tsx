import { PropsWithChildren } from 'react';

export default function Main({ children }: PropsWithChildren<{}>) {
	return <main className="bg-background-dark text-white bg-center">{children}</main>;
}
