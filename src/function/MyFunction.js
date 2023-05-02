import { Alchemy, Network } from "alchemy-sdk";
import LendingContract from "../smartcontract/LendingFactory.json";
const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider);
const lendingAbi = LendingContract.abi;
const lending = new web3.eth.Contract(
    lendingAbi,
    "0x5fbdb2315678afecb367f032d93f642f64180aa3"
);
const settings = {
    apiKey: "-C7_ur_4s6R0oUnBNGi4qB3XWfv-HsFR",
    network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(settings);

export const sliceString = (message) => {
    let result = message.toString().slice(0, 4);
    return result;
};

export const RegisterNFT = async (myAccount, nftAddress) => {
    const res = await lending.methods.registerNFT(nftAddress).send({
        from: myAccount,
    });
    return res;
};

export const UnRegisterNFT = async (myAccount, nftAddress) => {
    const res = await lending.methods.unRegisterNFT(nftAddress).send({
        from: myAccount,
    });
    return res;
}
