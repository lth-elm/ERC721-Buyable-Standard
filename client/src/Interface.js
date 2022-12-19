import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import Collection from "./pages/Collection";
import ContractOwner from "./pages/ContractOwner";
import TokensOwner from "./pages/TokensOwner";
import NoPage from "./pages/NoPage";

import abi from "./abis/Interface.json";
const contractABI = abi.abi;

export default function Interface({ checked }) {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const navigate = useNavigate();
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenOwned, setTokenOwned] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [royalty, setRoyalty] = useState(0);
  const [royaltyDenominator, setRoyaltyDenominator] = useState(0);

  const [showDialog, setShowDialog] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [mined, setMined] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

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
    setIsAdmin(false);
    setTokenURIs([]);
    setPriceList([]);
    setTokenOwned([]);
    setFoundData(false);
  };

  const checkContractData = async (e) => {
    if (e) {
      e.preventDefault();
    }

    let support = false;

    const urlContractAddressParam = searchParams.get("contractAddress");
    if (urlContractAddressParam) {
      setContractAddress(urlContractAddressParam);
      setFoundUrlParam(true);
    }

    const getContractAddress = urlContractAddressParam ? urlContractAddressParam : contractAddress;

    try {
      const contract = new ethers.Contract(getContractAddress, contractABI, signer);
      console.log("NFT Contract", contract);
      setNFTContract(contract);

      const owner = await contract.owner();

      console.log("Contract owner", owner);
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
    const contract = new ethers.Contract(getContractAddress, contractABI, signer);

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

  function ConfirmDialog() {
    const handleClose = () => clearTransactionDialog();

    return (
      <Modal show={true} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {mined && "Transaction Confirmed"}
            {!mined && !showSign && "Confirming Your Transaction..."}
            {!mined && showSign && "Please Sign to Confirm"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ textAlign: "left", padding: "0px 20px 20px 20px" }}>
            {mined && (
              <div>
                Your transaction has been confirmed and is on the blockchain.
                <br />
                <br />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://polygonscan.com/tx/${transactionHash}`}
                >
                  View on Polygonscan
                </a>
              </div>
            )}
            {!mined && !showSign && (
              <div>
                <p>Please wait while we confirm your transaction on the blockchain....</p>
              </div>
            )}
            {!mined && showSign && (
              <div>
                <p>Please sign to confirm your transaction.</p>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", paddingBottom: "30px" }}>
            {!mined && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="CloseModal" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const clearTransactionDialog = () => {
    setShowDialog(false);
    setShowSign(false);
    setMined(false);
    setTransactionHash("");
  };

  const updateURL = (e) => {
    e.preventDefault();
    navigate(`/?contractAddress=${document.getElementById("newAddress").value}`, { replace: true });
    checkContractData(e);
  };

  return (
    <div className="Interface">
      <form>
        <label>Contract address</label>
        <input
          type="text"
          id={"newAddress"}
          placeholder={contractAddress}
          // onInput={(e) => setContractAddress(e.target.value)}
        />
        <button onClick={(e) => updateURL(e)}>Find Collection</button>
        {/* <button
          onClick={(e) => {
            checkContractData(e);
          }}
        >
          Find Collection
        </button> */}
      </form>
      <p>
        Contract support ERC721 Buyable interface :{" "}
        {supportInterface ? (
          <span className="support-true">True</span>
        ) : (
          <span className="support-false">False</span>
        )}
      </p>
      <div className="interface-container">
        <div className="info-container">
          <div className="info-title">
            <h2>Details</h2>
          </div>
          <div className="info-body">
            <span>
              <strong>Name</strong>
              <br />
              <p>{name}</p>
            </span>
            <span>
              <strong>Symbol</strong>
              <br /> <p>{symbol}</p>
            </span>
            <span>
              <strong>Total supply</strong>
              <br /> <p>{supply.toString()}</p>
            </span>
            <span>
              <strong>Description</strong>
              <br /> <p>{description}</p>
            </span>
            {supportInterface ? (
              <span>
                <strong>Royalties</strong>
                <br /> <p>{royalty} %</p>
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        {supportInterface && foundData && (
          <Routes>
            <Route
              path="/"
              element={<Layout param={{ contractAddress, foundUrlParam }} checked={checked} />}
            >
              <Route
                index
                element={
                  <Collection
                    nftContract={nftContract}
                    tokenURIs={tokenURIs}
                    priceList={priceList}
                    getContractData={getContractData}
                    clearTransactionDialog={clearTransactionDialog}
                    setShowSign={setShowSign}
                    setShowDialog={setShowDialog}
                    setMined={setMined}
                    setTransactionHash={setTransactionHash}
                  />
                }
              />
              <Route
                path="owner"
                element={
                  <ContractOwner
                    nftContract={nftContract}
                    isAdmin={isAdmin}
                    royalty={royalty}
                    royaltyDenominator={royaltyDenominator}
                    getContractData={getContractData}
                    clearTransactionDialog={clearTransactionDialog}
                    setShowSign={setShowSign}
                    setShowDialog={setShowDialog}
                    setMined={setMined}
                    setTransactionHash={setTransactionHash}
                  />
                }
              />
              <Route
                path="tokens"
                element={
                  <TokensOwner
                    nftContract={nftContract}
                    tokenOwned={tokenOwned}
                    tokenURIs={tokenURIs}
                    priceList={priceList}
                    getContractData={getContractData}
                    clearTransactionDialog={clearTransactionDialog}
                    setShowSign={setShowSign}
                    setShowDialog={setShowDialog}
                    setMined={setMined}
                    setTransactionHash={setTransactionHash}
                  />
                }
              />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        )}
      </div>

      {showDialog && <ConfirmDialog />}
    </div>
  );
}
