import "./App.css";
import Wallet from "./components/Wallet";
import Interface from "./pages/Interface";
import NotConnected from "./components/NotConnected";

import { useAccount } from "wagmi";

function App() {
  const { address, isConnected } = useAccount();
  console.log("Connected with ", address);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>ERC721 Buyable</h1>
        </div>
        <div>
          <Wallet />
        </div>
      </header>
      <h1>Decentralized Marketplace</h1>
      {isConnected ? <Interface /> : <NotConnected />}
    </div>
  );
}

export default App;
