import { ethers } from "ethers";

export const RPC_URL = process.env.NEXT_PUBLIC_AVAX_RPC_URL || "https://nodes-prod.18.182.4.86.sslip.io/ext/bc/ZdfdpWpwtAuSgAkTv8ZycQTiKuCcybGecfRsyBym9TzZhXWip/rpc";
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "333090");
export const BLOCK_EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "";

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}
