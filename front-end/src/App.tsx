import { useEffect } from 'react';
import './App.css';


function App() {
  
  useEffect(() => {
    async function load() {
     
    }
    
    load();
   }, []);
  return (
    <>
      <div className='faucet-wrapper'>
        <div className='faucet'>
        Your account is: 
          <div className='balance-view is-size-2'>
            Current Balance: <strong>10</strong>ETH
          </div>
          <button className='btn mr2'>login </button>
        </div>
      </div>
    </>
  );
}

export default App;
