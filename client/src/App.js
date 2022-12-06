import "./App.css";
import Wallet from "./Wallet";

import { useAccount } from "wagmi";

function App() {
  const { address, isConnected } = useAccount();

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Dashboard</h1>
        </div>
        <div>
          <Wallet />
        </div>
      </header>
      {isConnected ? (
        <p>Connected with {address}</p>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}

export default App;
