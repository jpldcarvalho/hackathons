import { Contract, utils } from 'ethers'
import Copycat from '../../artifacts/contracts/Copycat.sol/Copycat.json'
import { useWeb3React } from '@web3-react/core';
import { useNavigate } from 'react-router-dom';
import { contractAddr } from '../../networks';

function Copy() {
	const navigate = useNavigate()
	const {
		library,
		account,
	} = useWeb3React();

  async function onSubmit(e: any) {
		e.preventDefault()
		const address = e.target.elements.address.value
		const token = e.target.elements.token.value
		const amount = e.target.elements.amount.value
		const contract = new Contract(contractAddr, Copycat.abi, library.getSigner())
		try {
			let addTxn = await contract.addWalletToCopycat(address, token, {from: account, value: utils.parseEther(String(amount*0.9))})
			await addTxn.wait()
			await contract.depositFee(address, {from: account, value: utils.parseEther(String(amount*0.1))})
		} catch(e:any) {
			console.log(e)
			await contract.deposit(address, {from: account, value: utils.parseEther(String(amount*0.9))})
			await contract.depositFee(address, {from: account, value: utils.parseEther(String(amount*0.1))})
		}

		navigate('/listing')
  }

	return (
		<div className="w-1/2 mt-10 mx-auto
			text-gray-400 bg-gray-800 rounded-xl
			p-6">
			<h2 className="text-gray-300 text-center font-bold text-lg pb-3 mb-4 border-b border-gray-700">
				Copy Address
			</h2>
			<div>
				<form autoComplete="off" onSubmit={onSubmit}>
					<div className="mb-6">
						<label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Address</label>
						<input type="text" autoComplete='off' name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Wallet Address" required />
					</div>
					<div className="mb-6">
						<label htmlFor="token" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Token</label>
						<select name="token" id="token" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Token">
							<option value="0x0000000000000000000000000000000000001010">MATIC</option>
							<option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">WETH</option>
						</select>
					</div>
					<div className="mb-6">
						<label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Amount</label>
						<input type="number" step=".01" autoComplete='off' name="amount" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Amount" required />
					</div>

					<button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
				</form>
			</div>
		</div>
	);
}

export default Copy;