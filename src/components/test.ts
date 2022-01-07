import { computed, readonly, ref, shallowRef, Ref } from 'vue';
import {
  getPhantomWallet,
  Wallet,
  WalletName,
} from '@solana/wallet-adapter-wallets';
import { PublicKey } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import axios from 'axios';


let walletAddress = `ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ`;
let url = `https://api.wallet.pixelracers.io/engineMint/${walletAddress}`;

const getAddress = async () => {
    const result = await axios.get(url);
    const address = result.data[0].arweaveUrl;

    return address;
  };


getAddress()
.then((address) => {
    console.log(address);
})

const userWalletAddress = useWallet();
    console.log(userWalletAddress);
