import { devnet } from "./devnet";
import { unitnet } from "./initnet";
import { mainnet } from "./mainnet";
import { testnet } from "./testnet";

export type INetwork = typeof mainnet.network | typeof devnet.network | typeof testnet.network | typeof unitnet.network;

export { devnet, mainnet, testnet, unitnet };
