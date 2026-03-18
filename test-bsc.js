import { ethers } from "ethers";
async function test() {
  const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");
  try {
    const num = await provider.getBlockNumber();
    console.log("BSC Success:", num);
  } catch (e) {
    console.error("BSC Error:", e);
  }
}
test();
