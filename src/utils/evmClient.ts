import { ethers } from "ethers";

export const RPC_URL = "https://nodes-prod.18.182.4.86.sslip.io/ext/bc/ZdfdpWpwtAuSgAkTv8ZycQTiKuCcybGecfRsyBym9TzZhXWip/rpc";
export const CHAIN_ID = 333090;

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}
