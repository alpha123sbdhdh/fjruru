import { ethers } from "ethers";
async function test() {
  const provider = new ethers.JsonRpcProvider("https://polygon.publicnode.com");
  try {
    const num = await provider.getBlockNumber();
    console.log("Polygon Success:", num);
  } catch (e) {
    console.error("Polygon Error:", e);
  }
}
test();
