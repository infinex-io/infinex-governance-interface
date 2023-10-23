import classNames from "classnames";
import { ConnectButton } from "components/ConnectButton";
import { Button } from "components/button";
import { useConnectorContext } from "containers/Connector";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from 'styles/yams.module.css'
import { isWalletAddress } from "utils/validate";

const Claim = () => {
    const [isLoading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
	const { walletAddress, isWalletConnected } = useConnectorContext();

    const searchParams = useSearchParams()
    const hash = searchParams.get('key')
    const email = searchParams.get('email')
    

    const callSubmit = async () => {
        setLoading(true)
        console.log(email, hash, walletAddress)
        try {
            await fetch(`https://nq6hc2c1ch.execute-api.ap-northeast-1.amazonaws.com/dev/email_link`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    code: hash,
                    address: walletAddress
                }),
            })
        }
        catch (error) {
            console.error(error)
        }
        setSuccess(true)
        setLoading(false)
    }

    return (
        (hash && email)
            ?
            <div className="text-center text-black flex flex-col items-center justify-center">
                <h1 className="text-xl font-black">Claim your referral points</h1>
                <p className="mb-7 mt-1 text-sm">Verify your wallet address to claim your bonus <br/>governance points.</p>
                {success ?
                 <div className="text-sm">Thanks for your submission</div>
                :isWalletConnected ? <Button
					className={classNames(
						'w-28 rounded-3xl whitespace-nowrap text-sm hover:bg-primary',
						styles.primaryButtonShadow
					)}
					onClick={callSubmit}
					label="Submit"
                    loading={isLoading}
				/>
                : <ConnectButton className="rounded-3xl hover:bg-primary" />}
            </div>
            :
            <div className="text-black text-center">Please use the link provided in your email.</div>
    )
}

export default Claim;