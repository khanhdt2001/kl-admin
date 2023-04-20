import { Alchemy, Network } from "alchemy-sdk";
const settings = {
    apiKey: "-C7_ur_4s6R0oUnBNGi4qB3XWfv-HsFR",
    network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(settings);

export const sliceString = (message) => {
    let result = message.toString().slice(0, 4);
    return result
}