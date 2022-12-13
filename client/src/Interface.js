import { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";

import Layout from "./components/Layout";
import Collection from "./pages/Collection";
import ContractOwner from "./pages/ContractOwner";
import TokensOwner from "./pages/TokensOwner";
import NoPage from "./pages/NoPage";

import abi from "./abis/Interface.json";
const contractABI = abi.abi;

export default function Interface() {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [searchParams] = useSearchParams();
  const [foundUrlParam, setFoundUrlParam] = useState(false);

  // Test a NON ERC721 Buyable : "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  // Test a VALID ERC721 Buyable : "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const [contractAddress, setContractAddress] = useState(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const [nftContract, setNFTContract] = useState();
  const [supportInterface, setSupportInterface] = useState(false);
  const [foundData, setFoundData] = useState(false);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState(0);
  const [contractOwner, setContractOwner] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenOwned, setTokenOwned] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [royalty, setRoyalty] = useState(0);
  const [royaltyDenominator, setRoyaltyDenominator] = useState(0);

  useEffect(() => {
    if (!signer) return;
    checkContractData();
  }, [signer]);

  const resetStates = () => {
    setNFTContract();
    setSupportInterface(false);
    setRoyaltyDenominator(0);
    setRoyalty(0);
    setDescription("");
    setName("");
    setSymbol("");
    setSupply(0);
    setRoyalty(0);
    setContractOwner("");
    setIsAdmin(false);
    setTokenURIs([]);
    setPriceList([]);
    setTokenOwned([]);
    setFoundData(false);
  };

  const checkContractData = async () => {
    let support = false;

    const urlContractAddressParam = searchParams.get("contractAddress");
    if (urlContractAddressParam) {
      setContractAddress(urlContractAddressParam);
      setFoundUrlParam(true);
    }

    const getContractAddress = urlContractAddressParam
      ? urlContractAddressParam
      : contractAddress;

    try {
      const contract = new ethers.Contract(
        getContractAddress,
        contractABI,
        signer
      );
      console.log("NFT Contract", contract);
      setNFTContract(contract);

      const owner = await contract.owner();

      console.log("Contract owner", owner);
      setContractOwner(owner);
      setIsAdmin(owner.toUpperCase() === address.toUpperCase());

      support = await contract.supportsInterface(0x8ce7e09d);
      console.log("Support interface?", support);
      setSupportInterface(support);
    } catch (error) {
      console.log("error:", error);
      resetStates();
      alert("Contract doesn't support interface or doesn't exists");
    }

    if (support) {
      await getContractData(getContractAddress);
    }
  };

  const getContractData = async (getContractAddress) => {
    const contract = new ethers.Contract(
      getContractAddress,
      contractABI,
      signer
    );

    setName(await contract.name());
    setSymbol(await contract.symbol());

    const getSupply = await contract.totalSupply();
    setSupply(getSupply);
    console.log("Total supply:", getSupply.toString());

    const totalOwned = await contract.balanceOf(address);
    console.log("Connected address owns :", totalOwned.toString(), "tokens");

    const prices = [];
    const owned = [];
    const uris = [];

    for (let i = 1; i <= getSupply; i++) {
      const uri = await contract.tokenURI(i);
      const json = await Buffer.from(uri.substring(29), "base64").toString();
      const jsonUri = JSON.parse(json);
      uris.push(jsonUri);

      const price = await contract.prices(i);
      prices.push(parseFloat(ethers.utils.formatEther(price.toString())));

      if (owned.length < totalOwned) {
        const owner = await contract.ownerOf(i);
        if (address.toUpperCase() === owner.toUpperCase()) {
          owned.push(i);
        }
      }
    }
    setPriceList(prices);
    // console.log("NFT prices", prices);
    setTokenOwned(owned);
    console.log("Connected address owns following:", owned);
    setTokenURIs(uris);
    // console.log("URIs", uris);

    setDescription(uris[0].description);
    console.log("NFTs description:", uris[0].description);

    let roy;
    let denominator;
    await contract.royaltyInfo().then((res) => {
      denominator = res[1].toNumber();
      roy = (res[0].toNumber() / denominator) * 100;
    });
    setRoyalty(roy);
    setRoyaltyDenominator(denominator);
    console.log("Royalties:", roy, "%");
    console.log("Royalties denominator:", denominator);

    setFoundData(true);
  };

  return (
    <div className="Interface">
      <form>
        <label>Contract address</label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <button onClick={checkContractData}>Find Collection</button>
      </form>
      <p>
        Contract support ERC721 Buyable interface :{" "}
        {supportInterface ? "True" : "False"}
      </p>
      <p>
        <strong>Name</strong>: {name}
      </p>
      <p>
        <strong>Symbol</strong>: {symbol}
      </p>
      <p>
        <strong>Total supply</strong>: {supply.toString()}
      </p>
      <p>
        <strong>Description</strong>: {description}
      </p>
      <p>
        <strong>Royalties</strong>: {royalty} %
      </p>
      {supportInterface && (
        <Routes>
          <Route
            path="/"
            element={<Layout param={{ contractAddress, foundUrlParam }} />}
          >
            <Route
              index
              element={<Collection contractAddress={contractAddress} />}
            />
            <Route
              path="owner"
              element={<ContractOwner contractAddress={contractAddress} />}
            />
            <Route
              path="tokens"
              element={<TokensOwner contractAddress={contractAddress} />}
            />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}
