import { ethers } from "ethers";
async function test() {
  const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth");
  const address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const abi = ["function balanceOf(address owner) view returns (uint256)"];
  const contract = new ethers.Contract(address, abi, provider);
  try {
    const bal = await contract.balanceOf("0x0968aee425ddf5ea1c89f74f0943597dff176340");
    console.log("Success:", bal.toString());
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
