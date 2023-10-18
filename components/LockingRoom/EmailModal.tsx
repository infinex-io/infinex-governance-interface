import classNames from 'classnames';
import React, { useState } from 'react';
import styles from 'styles/yams.module.css';
import { Button } from '@chakra-ui/react';
import { supabase } from 'utils/supabaseClient';
import { useSearchParams } from 'next/navigation';
import short from "short-uuid";
import TweetButton from './TwitterButton';

interface SignedBody {
	signature: string;
	address: string;
	hidden: boolean;
	setHidden: (value: boolean) => void;
	loggedIn: string;
}

const EmailModal = ({ setHidden, hidden, signature, address, loggedIn }: SignedBody) => {
	// create a form with email input, as well as signature and address
	// submit button will send the email, signature, and address to the backend
	const [emailValue, setEmailValue] = useState('');
	const searchParams = useSearchParams()
	const [isLoading, setIsLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [checkEmail, setCheckEmail] = useState(false);
	const [copied, setCopied] = useState(false);
	const translator = short();

	const copyClick = () => {
		navigator.clipboard.writeText(loggedIn);
		setCopied(true);
	};

	const isValidEmail = (email : string) => {
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		return emailRegex.test(email);
	};

	const handleChange = (e : any) => {
		setEmailValue(e.target.value);
		setIsDisabled(!isValidEmail(e.target.value));
	};

	const handleSubmit = async (e : any) => {
		e.preventDefault();
		setIsLoading(true);


		// register email to supabase
		const { error } = await supabase.auth.signInWithOtp({
			email: emailValue,
			options: {
				emailRedirectTo: "https://gov.infinex.io/farming?loggedin=true",
				data: {
					ref: searchParams.get("ref") === null ? null : translator.toUUID(searchParams.get("ref")!),
				},
			},
		});
		// if verification email sent
		if (error === null) {
			setCheckEmail(true);
			console.log("Success");
		} else {
			console.log("Error");
		}

		setIsLoading(false);
		setIsSubmitted(true);
	};

	return (
		<div
			className="email-modal-container"
			style={{
				opacity: hidden ? 0 : 1,
				pointerEvents: hidden ? 'none' : 'all',
				transition: 'opacity 0.1s ease-out',
				position: 'fixed',
				width: '100vw',
				height: '100vh',
				zIndex: 10,
				backgroundColor: 'rgba(0, 0, 0, 0.44)' /* Semi-transparent black overlay */,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			onClick={(e : any) => {
				// close the modal if they click on the container (outside of the form)
				if (!e.target.className.includes('email-modal-container')) {
					return;
				}
				setHidden(true);
			}}
		>
			<div
				style={{
					maxWidth: loggedIn ? '650px' : '400px',
					width: '100%',
					maxHeight: '90vh',
					height: 'auto',
					overflowY: 'auto',
					padding: '40px 50px',
					boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
				}}
				className="rounded-3xl animation-appear relative flex flex-col justify-center items-center bg-primary-light mx-4"
			>
				{loggedIn !== "" ?
					<div className={`w-full animation-appear flex flex-col justify-center items-center text-slate-900`}>
						<h1 className="font-bold text-xl">Your referral link</h1>
						<div className={classNames("p-1 px-2 my-5 mx-3 rounded-3xl flex items-center space-x-3 cursor-pointer animation-appear animation-delay-5", styles.inputIndent)} onClick={copyClick}>
							<div
								className="appearance-none h-10 flex items-center justify-between rounded pl-3 py-1 max-w-[90vw]"
							>
								<div className="whitespace-nowrap mr-10 overflow-x-auto text-slate-800">{loggedIn}</div>
								{copied ? (
									<div className={classNames("transition-colors p-1 px-2 flex items-center rounded-3xl mr-1 float-left", styles.buttonIndent)}>
										<svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
												fill="currentColor"
												fill-rule="evenodd"
												clip-rule="evenodd"
											></path>
										</svg>
										<span className="text-sm ml-2">Copied</span>
									</div>
								) : (
									<div className={classNames("transition-colors p-1 px-2 flex items-center rounded-3xl mr-1 float-left", styles.buttonIndent)}>
										<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
												fill="currentColor"
												fill-rule="evenodd"
												clip-rule="evenodd"
											></path>
										</svg>
										<span className="text-sm ml-2">Copy</span>
									</div>
								)}
							</div>
						</div>
						<div className="flex items-center justify-center gap-3">
							<button
								className={classNames(
									styles.primaryButtonShadow,
									'flex items-center gap-2 shadow-none border text-sm border-[#5a1f02] text-sm text-[#1f0c03] !px-5'
								)}
								disabled={isLoading}
								onClick={() => setHidden(true)}
							>
								<span>Exit</span>
							</button>
							<TweetButton refLink={loggedIn} />
						</div>
					</div>
					:
					<div
						className={`w-full animation-appear flex flex-col justify-center items-center ${isSubmitted ? 'invisible' : 'visible'
							}`}
					>
						{/* Form */}

						<h4 className="text-black font-bold text-xl mb-2">Boost your governance points</h4>
						<p className="text-sm font-medium text-slate-800 text-center mb-3">
							Share your referral link to multiply your governance points and elevate your position on the closed beta waitlist
						</p>

						<input
							type="email"
							className={classNames(
								'bg-primary-light text-black rounded-3xl py-2 px-4 w-full focus:outline-none yams_inputIndent__ReOlz text-sm placeholder-[#0000003b]'
							)}
							placeholder="Email"
							value={emailValue}
							onChange={handleChange}
							disabled={isLoading}
						/>

						<div className="flex flex-row gap-3 mt-4 justify-between">
							{/* Backicon */}
							<button
								className={classNames(
									styles.primaryButtonShadow,
									'flex items-center gap-2 shadow-none border text-sm border-[#5a1f02] text-sm text-[#1f0c03] !px-5'
								)}
								disabled={isLoading}
								onClick={() => setHidden(true)}
							>
								<span>Not now</span>
							</button>
							{/* Button */}
							<Button
								type="submit"
								variant="custom"
								className={classNames(
									styles.primaryButtonShadow,
									'bg-primary',
									'border',
									'border-primary',
									'shadow-none',
									'text-sm',
									'!px-5',
									isDisabled ? 'opacity-50 pointer-events-none' : 'pointer-events-all'
								)}
								onClick={handleSubmit}
								disabled={isDisabled || isLoading}
								isLoading={isLoading}
							>
								Submit
							</Button>
						</div>
					</div>}

				{checkEmail && (
					<div className="absolute text-center flex flex-col items-center">
						<h4 className="animation-appear text-black font-bold text-xl mb-2">Thank you</h4>
						<p className="animation-appear mb-4 text-black">Please check your email for a confirmation link.</p>
						<button
							className={classNames(
								styles.primaryButtonShadow,
								'bg-primary',
								'border',
								'border-primary',
								'shadow-none',
								'text-sm',
								'!px-5',
								'animation-appear animation-delay-1'
							)}
							onClick={() => setHidden(true)}
						>
							<span>Continue</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailModal;
