import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import styles from "styles/yams.module.css"

interface Props {
    refLink: string
}

const TweetButton = ({refLink} : Props) => {
    return (
        <div className="flex items-center justify-center">
            <a className={classNames("flex bg-primary rounded-3xl")} target="_blank" href={`https://twitter.com/intent/tweet?text=Farming%20governance%20points%20for%20the%20future%20of%20DeFi%20%F0%9F%A5%82%0A%40infinex_app%0A%23infinex%0A${refLink}%0A`}>
                <div className="flex items-center justify-center w-32 px-5 py-2 rounded transition-colors">
                    <figure className="w-10">
                    <svg width="20" height="26" viewBox="0 0 361 290" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M361 34.29C347.77 40.15 333.54 44.06 318.53 45.91C333.79 36.85 345.53 22.4 351.04 5.33C336.76 13.7 320.94 19.85 304.11 23.09C290.67 8.84 271.5 0 250.26 0C209.46 0 176.39 32.78 176.39 73.2C176.39 78.92 177.06 84.49 178.32 89.9C116.94 86.82 62.4997 57.64 26.0797 13.36C19.6797 24.18 16.0797 36.85 16.0797 50.22C16.0797 75.63 29.0897 98 48.9297 111.18C36.8197 110.81 25.4197 107.44 15.4397 102.04C15.4397 102.26 15.4397 102.59 15.4397 102.9C15.4397 138.41 40.9097 167.98 74.6697 174.71C68.4997 176.4 61.9797 177.34 55.2597 177.34C50.4897 177.34 45.8397 176.8 41.3397 175.99C50.7397 205.01 78.0097 226.22 110.32 226.85C85.0397 246.45 53.1997 258.19 18.5797 258.19C12.5997 258.19 6.74973 257.85 0.969727 257.15C33.6797 277.86 72.5197 290 114.21 290C250.06 290 324.38 178.44 324.38 81.66C324.38 78.49 324.28 75.33 324.13 72.21C338.63 61.97 351.13 49.05 361 34.29Z"
                            fill="black"
                        />
                    </svg>
                    </figure>
                    Tweet
                </div>
            </a>
        </div>
        
    )
}

export default TweetButton