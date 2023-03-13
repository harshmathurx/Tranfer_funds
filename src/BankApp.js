

import { React, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from './Bank.module.css'
import { bank_app_abi, bank_app_contract } from './Contracts/doof_app'


const BankApp = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = bank_app_contract;

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [transferHash, setTransferHash] = useState(null);
	const [checkAcc, setCheckAcc] = useState("false");
	const [accStatus, setAccStatus] = useState("");
	const [accbalance, setAccBalance] = useState("");

	const connectWalletHandler = async () => {
		try {
			if (window.ethereum && window.ethereum.isMetaMask) {
				window.ethereum.request({ method: 'eth_requestAccounts' })
					.then(result => {
						accountChangedHandler(result[0]);
						setConnButtonText('Wallet Connected');
						setErrorMessage(null);
					})
					.catch(error => {
						setErrorMessage(error.message);
					});

			} else {
				console.log('Need to install MetaMask');
				setErrorMessage('Please install MetaMask browser extension to interact');
			}
		} catch (error) {
			console.log(error);
			setErrorMessage(error.message);
		}

	}


	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}
	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// Existing code goes here

	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		try {
			if (window.ethereum && window.ethereum.isMetaMask && ethers.providers) {
				let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
				setProvider(tempProvider);

				let tempSigner = tempProvider.getSigner();
				setSigner(tempSigner);

				let tempContract = new ethers.Contract(contractAddress, bank_app_abi, tempSigner);
				setContract(tempContract);

			} else {
				setErrorMessage('Please install MetaMask browser extension to interact')
			}
		} catch (error) {
			console.log(error);
		}
	}

	const createAccount = async () => {
		let txt = await contract.createDoof();
		console.log(txt.data.data.message);
		setAccStatus("Your Account is created");
	}

	const checkAccountExists = async () => {
		///e.preventDefault();
		let txt = await contract.doofExists();
		if (txt == true) {
			setCheckAcc("true");
		}
	}

	const AccountBalance = async () => {
		let txt = await contract.accountBalance();
		let balanceNumber = txt.toNumber();
		//let tokenDecimals = await contract.decimals();
		console.log(balanceNumber)
		setAccBalance('' + balanceNumber);
	}

	const EarnDoofs = async (e) => {
		e.preventDefault();
		let txt = await contract.earn();
	}

	const transferHandler = async (e) => {
		e.preventDefault();
		let transferAmount = e.target.sendAmount.value;
		let recieverAddress = e.target.recieverAddress.value;
		let txt = await contract.transferDoofs(recieverAddress, transferAmount);
		setTransferHash("Transfer confirmation hash: " + txt.hash);
	}

	const WithdrawBalance = async (e) => {
		e.preventDefault();
		let withdrawAmount = e.target.withdrawAmount.value;
		let txt = await contract.withdraw(withdrawAmount);
		console.log(txt);
	}


	return (
		<div >
			<h2> Doof Coins </h2>
			<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

			{defaultAccount && contract && provider && (<div>
				<div className={styles.walletCard}>
					<div>
						<h3>Address: {defaultAccount}</h3>
					</div>

					<div>
						<button onClick={AccountBalance}>Check Balance</button> <h3>Doofcoins in the Bank: {accbalance} </h3>
					</div>

					{errorMessage}
				</div>
				<div className={styles.interactionsCard}>
					<div>
						<h4>Click here to Create your account. Make sure you are connected to Wallet</h4>
						<button onClick={createAccount}>CreateAccount</button>
						<h4>Click here to check if your account Exists or not</h4>
						<button onClick={checkAccountExists}>CheckAccountExists</button>
						<h4>Your Account Status</h4> <h5> {checkAcc}</h5>
					</div>
					<form onSubmit={transferHandler}>
						<h3> Transfer money </h3>
						<p> Reciever Address </p>
						<input type='text' id='recieverAddress' className={styles.addressInput} />

						<p> Transfer Amount </p>
						<input type='number' id='sendAmount' min='0' step='1' />

						<button type='submit' className={styles.button6}>Transfer</button>
						<div>
							{transferHash}
						</div>
					</form>
					<form onSubmit={EarnDoofs}>
						<h3> Airdrop Doofcoins</h3>
						<button type='submit' className={styles.button6}>Deposit</button>

					</form>
					<form onSubmit={WithdrawBalance}>
						<h3> Withdraw Money </h3>
						<p>Withdraw Amount </p>
						<input type='number' id='withdrawAmount' min='0' step='1' />
						<button type='submit' className={styles.button6}>Withdraw</button>

					</form>
				</div>
			</div>)}

		</div>
	)
}

export default BankApp;