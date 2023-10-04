import BackIcon from 'components/Icons/BackIcon';
import LinkIcon from 'components/Icons/LinkIcon';


const FTXFileUpload = () => {
    return (
        <div className="px-8 sm:px-0 flex flex-col justify-center items-center bg-black gap-10 text-black h-full">
            <LinkIcon />
            <h1 className="text-white text-5xl font-black">Proof of Rug</h1>
            <p className="text-sm font-medium text-center max-w-sm text-white">
                Attach your FTX Customer Claim Form to prove you lost funds.
            </p>
            <form className="cursor-pointer">
                <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 
                    file:bg-primary file:text-black file:rounded-md file:border-0 file:text-sm 
                    file:font-semibold cursor-pointer mb-5"
                />
                <label htmlFor="email" className="text-white text-sm">Enter your FTX email:</label>
                <input type="email" 
                className="w-full py-1 px-2 bg-transparent border border-white rounded text-white 
                focus:outline-0 focus:border-primary transition placeholder:text-gray-500" placeholder='email' />
            </form>
            <div className="flex flex-row gap-4 mt-5">
                <button className="text-white bg-none rounded-sm py-2 px-4 border border-white flex items-center gap-2">
                    <BackIcon width={10} height={10} />
                    <span>Back</span>
                </button>
                <button
                    className="text-black bg-primary rounded-sm py-2 px-4"
                >Submit</button>
            </div>
        </div>
    )
}

export default FTXFileUpload