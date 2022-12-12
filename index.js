import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
withdrawButton.onclick = withDraw;
balanceButton.onclick = getBalance;
fundButton.onclick = fund;

console.log(ethers);

async function connect() {
  if (typeof window.ethereum !== undefined) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!!";
  } else {
    console.log("No metamask found!");
    connectButton.innerHTML = "Please Install Metamask!!";
  }
}
async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}
async function withDraw() {
  if (typeof window.ethereum != "undefined") {
    console.log("WithDrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // account by which we are connect in our metamask
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse,provider);
      console.log("WithDraw done");
    } catch (error) {
      console.log(error);
    }
  }
}
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  // provider/connection with the blockchain
  // signer / wallet / someone with some gas
  // contract that we are interacting with
  // ABI and address
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(); // account by which we are connect in our metamask
  console.log(signer);
  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    const transactionRespone = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
    await listenForTransactionMine(transactionRespone, provider);
    console.log("done!");
  } catch (error) {
    console.log(error);
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
  // return provider.once(transactionResponse.hash, (transactionReceipt) => {
  //   console.log(
  //     `Completed with ${transactionReceipt.confirmations} confirmations`
  //   );
  // });
}
