import classNames from 'classnames';
import React, { useState } from 'react';
import styles from 'styles/yams.module.css';
import { Button } from '@chakra-ui/react';

interface SignedBody {
	signature: string;
	address: string;
	hidden: boolean;
	setHidden: (value: boolean) => void;
}

const EmailModal = ({ setHidden, hidden, signature, address }: SignedBody) => {
	// create a form with email input, as well as signature and address
	// submit button will send the email, signature, and address to the backend
	const [emailValue, setEmailValue] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const isValidEmail = (email) => {
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		return emailRegex.test(email);
	};

	const handleChange = (e) => {
		setEmailValue(e.target.value);
		setIsDisabled(!isValidEmail(e.target.value));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		console.log('submitting', { signature, address });
		// Perform any email related operations here

		// Close the modal after submitting the form
		setTimeout(() => {
			setIsLoading(false);
			setIsSubmitted(true);
		}, 1000);
	};

	return (
		<div
			className="email-modal-container"
			style={{
				opacity: hidden ? 0 : 1,
				pointerEvents: hidden ? 'none' : 'all',
				transition: 'opacity 0.1s ease-out',
				position: 'absolute',
				width: '100vw',
				height: '100vh',
				zIndex: 10,
				backgroundColor: 'rgba(0, 0, 0, 0.44)' /* Semi-transparent black overlay */,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			onClick={(e) => {
				// close the modal if they click on the container (outside of the form)
				if (!e.target.className.includes('email-modal-container')) {
					return;
				}
				setHidden(true);
			}}
		>
			<div
				style={{
					maxWidth: '400px',
					width: '100%',
					maxHeight: '90vh',
					height: 'auto',
					overflowY: 'auto',
					padding: '40px 50px',
					borderRadius: '5px',
					boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
				}}
				className="animation-appear relative flex flex-col justify-center items-center bg-primary-light mx-4"
			>
				<div
					className={`w-full animation-appear flex flex-col justify-center items-center ${
						isSubmitted ? 'invisible' : 'visible'
					}`}
				>
					{/* Form */}

					<h4 className="text-black font-bold text-xl mb-2">Connect your email</h4>
					<p className="text-sm font-medium text-slate-800 text-center mb-3">
						Participants in Infinex governance will be favoured in the closed beta waitlist
					</p>

					<input
						type="email"
						className={classNames(
							'bg-primary-light text-black rounded-3xl py-2 px-4 w-full focus:outline-none yams_inputIndent__ReOlz text-sm placeholder-gray-500'
						)}
						placeholder="Email"
						value={emailValue}
						onChange={handleChange}
						disabled={isLoading}
					/>

					<div className="flex flex-row gap-2 mt-4 justify-between">
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
				</div>

				{isSubmitted && (
					<div className="absolute text-center flex flex-col items-center">
						<h4 className="animation-appear text-black font-bold text-xl mb-2">Thank you</h4>
						<p className="animation-appear mb-4">Your email has been received</p>
						<button
							// className={classNames(
							// 	styles.primaryButtonShadow,
							// 	'flex items-center gap-2 shadow-none border text-sm border-[#5a1f02] text-sm text-[#1f0c03] !px-5'
							// )}
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
				{/* <Button
					height="42px"
					isLoading={isLoading}
					loadingText="Submitting"
					background="secondary"
					variant="custom"
					className={classNames(
						styles.primaryButtonShadow,
						'bg-primary',
						'shadow-none',
						'!text-sm'
					)}
					onClick={handleSubmit}
					disabled={isLoading}
				>
					Not now
				</Button>

				<Button
					height="42px"
					isLoading={isLoading}
					loadingText="Submitting"
					background="primary"
					variant="custom"
					className={classNames(
						styles.primaryButtonShadow,
						'bg-primary',
						'shadow-none',
						'!text-sm'
					)}
					onClick={handleSubmit}
					disabled={isLoading}
				>
					Submit
				</Button> */}

				{/* end form */}
			</div>
		</div>
	);
};

export default EmailModal;
