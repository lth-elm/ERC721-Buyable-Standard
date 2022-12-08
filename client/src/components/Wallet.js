import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { CustomConnectButton } from "./CustomConnectButton";

const { chains, provider } = configureChains(
  [chain.goerli, chain.mainnet, chain.hardhat], // [chain.mainnet, chain.goerli, chain.sepolia, chain.polygon, chain.polygonMumbai, chain.optimism, chain.optimismGoerli, chain.arbitrum, chain.arbitrumGoerli, chain.localhost, chain.hardhat, chain.foundry]
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

const Wallet = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        <ConnectButton />
        {/* <CustomConnectButton /> */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Wallet;
