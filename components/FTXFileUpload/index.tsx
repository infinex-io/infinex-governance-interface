import BackIcon from 'components/Icons/BackIcon';
import LinkIcon from 'components/Icons/LinkIcon';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from 'utils/supabaseClient';

const FTXFileUpload = () => {
	const [email, setEmail] = useState<string>('');
	const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
	const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [confirmationCode, setConfirmationCode] = useState<string>('');
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // handling email + file submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsLoading(true);
		e.preventDefault();
		if (!isValidEmail || !isFileUploaded) {
		    setIsLoading(false);
            return;
        }
		const { data, error } = await supabase.auth.signInWithOtp({
			email: email,
		});
		if (error) console.log(error);
        else {
            const ftxFile = e.target[0].files[0]
            const { data, error } = await supabase
            .storage
            .from('FTX Files')
            .upload(`${email}.pdf`, ftxFile)
            if (error) {
                console.log(error)
            }
        }
		setIsLoading(false);
		setIsSubmitted(true);
	};

    // regex email verification
	useEffect(() => {
		const res = email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
		if (res !== null) setIsValidEmail(true);
		else setIsValidEmail(false);
	}, [email]);

    // cap verification code length at 6
	const maxLengthCheck = (object: any) => {
		if (object.target.value.length > object.target.maxLength) {
			object.target.value = object.target.value.slice(0, object.target.maxLength);
		}
	};

    // handling verification code submit 
	const verificationSubmit = async (e: React.MouseEvent<HTMLElement>) => {
		setIsLoading(true);
		e.preventDefault();
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token: confirmationCode,
			type: 'email',
		});
		if (error) console.log(error);
		else {
			setIsSuccess(true);
		}
		setIsLoading(false);
	};

	return (
		<div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-black gap-10 text-black h-full">
			<LinkIcon />
			<h1 className="text-white text-5xl font-black">Proof of Rug</h1>

			{!isSubmitted ? (
				<div>
					<p className="text-sm font-medium text-center max-w-sm text-white">
						Attach your FTX Customer Claim Form to prove you lost funds.
					</p>
					<form className="cursor-pointer" onSubmit={handleSubmit}>
						<input
							type="file"
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 
                    file:bg-primary file:text-black file:rounded-md file:border-0 file:text-sm 
                    file:font-semibold cursor-pointer my-5"
							onChange={() => setIsFileUploaded(true)}
							accept="application/pdf"
						/>
						<label htmlFor="email" className="text-white text-sm">
							Enter your FTX email:
						</label>
						<input
							type="email"
							onChange={(event) => setEmail(event.target.value)}
							value={email}
							className="w-full py-1 px-2 bg-transparent border border-white rounded text-white mt-1 
                            focus:outline-0 focus:border-primary transition placeholder:text-gray-500"
							placeholder="email"
						/>
                        <div className="flex flex-row gap-4 mt-5">
							<button className="text-white bg-none rounded-sm py-2 px-4 border border-white flex items-center gap-2" disabled={isLoading}>
								<BackIcon width={10} height={10} />
								<span>Back</span>
							</button>
							<button
								className={`text-black bg-primary rounded-sm py-2 px-4 ${isLoading ? "animate-pulse" : ""}`}
								type="submit"
								value="submit"
                                disabled={isLoading}
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			) : (
				<div>
					{!isSuccess ? (
						<div className="flex flex-col justify-center items-center text-white">
							<h1 className="max-w-sm text-center text-sm">
								In order to verify your email, enter the verification code sent to your email.
							</h1>
							<input
								type="number"
								className="bg-transparent rounded border border-white text-center py-2 
                    w-36 mt-3 focus:outline-0 focus:border-primary transition text-xl"
								maxLength={6}
								onChange={(event) => setConfirmationCode(event.target.value)}
								value={confirmationCode}
								onInput={maxLengthCheck}
							/>
							<div className="flex flex-row gap-4 mt-5">
								<button
									className={`text-black bg-primary rounded-sm py-2 px-4 ${isLoading ? "animate-pulse" : ""}`}
									type="submit"
									value="submit"
                                    disabled={isLoading}
									onClick={verificationSubmit}
								>
									Confirm
								</button>
							</div>{' '}
						</div>
					) : (
						<div className="flex flex-col justify-center items-center text-white">
                            Email verified successfully!
                        </div>
					)}
				</div>
			)}
		</div>
	);
};

export default FTXFileUpload;
