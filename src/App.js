import logo from './logo.svg';
import Web3 from 'web3'
import './App.css';

function App() {
  // const [web3, setWeb3] = useState(null);
  // const [accounts, setAccounts] = useState(null);
  // const [contract, setContract] = useState(null);

  // const web3 = await getWeb3();
  
  // const accounts = await web3.eth.getAccounts();
  // const networkId = await web3.eth.net.getId();

  // const deployedNetwork = Sanaaj.networks[networkId];
  // const instance = new web3.eth.Contract(
  //   Sanaaj.abi,
  //   deployedNetwork && deployedNetwork.address,
  // );
  // setWeb3(web3);
  // setAccounts(accounts);
  // setContract(instance);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
