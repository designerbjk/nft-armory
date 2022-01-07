import { computed, readonly, ref, shallowRef, Ref } from 'vue';
import {
  getPhantomWallet,
  Wallet,
  WalletName,
} from '@solana/wallet-adapter-wallets';
import { PublicKey } from '@solana/web3.js';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import axios from 'axios';

const walletClass = ref<Wallet | null>(null);
const walletAdapter = ref<Ref<SignerWalletAdapter | null>>(shallowRef(null));

const walletMapping = {
  Phantom: getPhantomWallet,
};

export default function useWallet() {
  const isConnected = computed(() => !!walletAdapter.value);

  const getWallet = (): SignerWalletAdapter | null => {
    if (walletAdapter.value) {
      return walletAdapter.value;
    }
    return null;
  };

  const setWallet = (newWallet: string | null, network: string) => {
    console.log('attempting to set wallet',  newWallet, network.substr(0, 10));

    if (!newWallet) {
      console.log('removing active wallet');
      walletClass.value = null;
      walletAdapter.value = null; // don't think I need shallowRef here
      return;
    }

    const gottenWallet = (walletMapping as any)[newWallet!]({ network });
    const connectedAdapter = gottenWallet.adapter();
    connectedAdapter
      .connect()
      .then(() => {
        // only set the two if the call succeeds
        walletClass.value = gottenWallet;
        walletAdapter.value = connectedAdapter;
        console.log('wallet successfully connected', getWallet(), newWallet, network.substr(0, 10));
      })
      .catch(() => {
        console.log('oh no, failed to connect to wallet, try again');
        walletClass.value = null;
        walletAdapter.value = null;
      });
  };

  const getWalletName = (): WalletName | null => {
    if (walletClass.value) {
      return walletClass.value.name;
    }
    return null;
  };

  const getWalletAddress = (): PublicKey | null => {
    if (walletAdapter.value) {
      return walletAdapter.value.publicKey;
    }
    return null;
  };

  return {
    wallet: readonly(walletAdapter),
    isConnected,
    getWallet,
    setWallet,
    getWalletName,
    getWalletAddress,
  };
}


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
