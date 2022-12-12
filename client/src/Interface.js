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

  // Test a NON ERC721 Buyable : "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  // Test a VALID ERC721 Buyable : "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const [contractAddress, setContractAddress] = useState(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  const [supportInterface, setSupportInterface] = useState(false);
  const [foundUrlParam, setFoundUrlParam] = useState(false);

  useEffect(() => {
    if (!signer) return;
    checkContractData();
  }, [signer]);

  const resetStates = () => {
    setSupportInterface(false);
    // setRoyaltyDenominator(0);
    // setRoyalty(0);
    // setContractOwner("")
    // setIsAdmin(false);
    // setTokenURIs([]);
    // setPriceList([]);
    // setTokenOwned([]);
    // setFoundData(false);
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

      const owner = await contract.owner();

      console.log("Contract owner", owner);
      // setContractOwner(owner);
      // setIsAdmin(owner.toUpperCase() === props.account.toUpperCase());

      support = await contract.supportsInterface(0x8ce7e09d);
      console.log("Support interface ?", support);
      setSupportInterface(support);
    } catch (error) {
      console.log("error:", error);
      resetStates();
      alert("Contract doesn't support interface or doesn't exists");
    }

    if (support) {
      console.log("Contract interface supported");
      // await getContractData();
    }
  };

  return (
    <div className="Interface">
      <p>
        Contract support ERC721 Buyable interface :{" "}
        {supportInterface ? "True" : "False"}
      </p>
      {supportInterface && (
        <Routes>
          <Route
            path="/"
            element={<Layout param={foundUrlParam ? contractAddress : null} />}
          >
            <Route
              index
              element={
                <Collection
                  contractAddress={foundUrlParam ? contractAddress : null}
                />
              }
            />
            <Route
              path="owner"
              element={
                <ContractOwner
                  contractAddress={foundUrlParam ? contractAddress : null}
                />
              }
            />
            <Route
              path="tokens"
              element={
                <TokensOwner
                  contractAddress={foundUrlParam ? contractAddress : null}
                />
              }
            />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}
