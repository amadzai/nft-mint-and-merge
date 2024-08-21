import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'reactstrap';
import '../App.css'

function WalletBalance() {

    const [balance, setBalance] = useState();
    
    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };
  
    return (
      <div className='mb-3'>
          <Button onClick={() => getBalance()} className='balance-button'>Check Balance</Button>
          <h5 className='text-light mt-3'>Your Balance: {balance}</h5>
      </div>
    );
  };
  
  export default WalletBalance;