import "./App.css";
import Interface from "./pages/Interface";
import NotConnected from "./components/NotConnected";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  useAccount,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { CustomConnectButton } from "./components/CustomConnectButton";

const { chains, provider } = configureChains(
  [chain.hardhat, chain.goerli, chain.localhost], // [chain.mainnet, chain.goerli, chain.sepolia, chain.polygon, chain.polygonMumbai, chain.optimism, chain.optimismGoerli, chain.arbitrum, chain.arbitrumGoerli, chain.localhost, chain.hardhat, chain.foundry]
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  const { address, isConnected } = useAccount();
  console.log("Connected with", address);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        <div className="App">
          <header className="App-header">
            <div>
              <h1>ERC721 Buyable</h1>
            </div>
            <div>
              <ConnectButton />
              {/* <CustomConnectButton /> */}
            </div>
          </header>
          <h1>Decentralized Marketplace</h1>
          {isConnected ? <Interface /> : <NotConnected />}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
