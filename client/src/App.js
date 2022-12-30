import "./styles/App.css";
import "./styles/Pages.css";

import Interface from "./Interface";
import NotConnected from "./components/NotConnected";

import { useState } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
// import { CustomAvatar } from "./components/CustomAvatar";

import { chain, useAccount, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [
    chain.goerli,
    chain.mainnet,
    chain.sepolia,
    chain.polygon,
    chain.polygonMumbai,
    chain.optimism,
    chain.optimismGoerli,
    chain.arbitrum,
    chain.arbitrumGoerli,
    chain.hardhat,
    chain.foundry,
    chain.localhost,
  ],
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

  const [style, setStyle] = useState("App-header orange");
  const [animation, setAnimation] = useState("toOrange");
  const changeStyle = () => {
    style === "App-header orange" ? setStyle("App-header light") : setStyle("App-header orange");
    setChecked(!checked);
    animation === "toLight" ? setAnimation("toOrange") : setAnimation("toLight");
  };

  const [checked, setChecked] = useState(false);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={darkTheme({ accentColor: "#f8cc82", accentColorForeground: "black" })}
        chains={chains}
      >
        <div className="App preload">
          <header className={style}>
            <div className="title">
              <h1 className={animation}>ERC721 Buyable</h1>
            </div>
            <div className="header-right">
              <label className="switch">
                <input type="checkbox" checked={checked} onChange={changeStyle} />
                <span className="slider round"></span>
              </label>

              <ConnectButton />
            </div>
          </header>

          <h1>Decentralized Marketplace</h1>
          {isConnected ? <Interface checked={checked} /> : <NotConnected />}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
