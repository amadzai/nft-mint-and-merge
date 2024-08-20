import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'reactstrap';

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
          <h5>Your Balance: {balance}</h5>
          <Button onClick={() => getBalance()} color="success">Show My Balance</Button>
      </div>
    );
  };
  
  export default WalletBalance;