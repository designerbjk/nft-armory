<template>
  <div>
    <!--master-->
    <form v-if="chosenNFTType === 'master'" class="mt-10" @submit.prevent="mintNewMaster">
      <div class="nes-field">
        <div>
       
          <div v-if="isConnected">Wallet is connected</div>
       
          <input type="text" id="getWalletAddress" class="nes-input" v-model="getWalletAddress"/>

        </div>
        <input type="text" id="uri" class="nes-input" v-model="uri"/>
      </div>

      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Claim my engine
      </button>
    </form>

    <!--print-->
    <form v-else-if="chosenNFTType === 'print'" class="mt-5" @submit.prevent="mintNewPrint">
      <div class="nes-field mt-5">
        <div><label for="masterEditionMint">Master Edition Mint:</label></div>
        <input
          type="text"
          id="masterEditionMint"
          class="nes-input"
          v-model="masterEditionMint"
          :placeholder="DEFAULTS.MASTER_MINT"
        />
      </div>

      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Mint new Print NFT
      </button>
    </form>

    <!--notifications-->
    <StdNotifications :is-connected="isConnected" :is-loading="isLoading" :error="error" />
    <NotifySuccess v-if="mintResult" class="mt-5">
      <p>Claim successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!newNFT"
        >Loading your new NFT... (might take a min or two)</LoadingIcon
      >
      <div v-else>
        <ExplorerLink :tx-id="mintResult.txId" />
        <NFTViewCard :n="newNFT" class="text-black" />
      </div>
    </NotifySuccess>

    <!--modals-->
  
   
 
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PublicKey } from '@solana/web3.js';
import { NFTMintEditionFromMaster, NFTMintMaster } from '@/common/NFTmint';
import useWallet from '@/composables/wallet';
import NotifyWarning from '@/components/notifications/NotifyWarning.vue';
import NotifySuccess from '@/components/notifications/NotifySuccess.vue';
import { IMintResult, INFT } from '@/common/helpers/types';
import LoadingIcon from '@/components/LoadingIcon.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import { NFTGet } from '@/common/NFTget';
import useModal from '@/composables/modal';
import useError from '@/composables/error';
import ExplorerLink from '@/components/ExplorerLink.vue';
import StdNotifications from '@/components/StdNotifications.vue';
import { DEFAULTS } from '@/globals';
import axios from 'axios';





export default defineComponent({
  
  components: {
    StdNotifications,
    ExplorerLink,
    NFTViewCard,
    LoadingIcon,
    NotifySuccess,
    NotifyWarning,
  },
  setup() {
    const { isConnected, getWallet } = useWallet();
    const { error, clearError, setError, tryConvertToPk } = useError();
    const { getWalletAddress } = useWallet();
  

    const chosenNFTType = ref('master');
    const isLoading = ref<boolean>(false);
    const mintResult = ref<IMintResult | null>(null);
    const newNFT = ref<INFT | null>(null);

    const clearPreviousResults = () => {
      isLoading.value = false;
      mintResult.value = null;
      newNFT.value = null;
      clearError();
    };

    const fetchNewNFT = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        [newNFT.value] = await NFTGet({ mint: new PublicKey(mintResult.value!.mint) });
      } catch (e) {
        await fetchNewNFT();
      }
    };

    // --------------------------------------- master

    // need to fetch user wallet address somehow
    let walletAddress = `ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ`;
    let url = `https://api.wallet.pixelracers.io/engineMint/${walletAddress}`;

    const getAddress = async () => {
      const result = await axios.get(url);
      let index = 0;
      if(result.data[index].redeemed === false){
        const address = result.data[index].arweaveUrl;
        return address;
      }
      else index++
    };

    const arweaveURL = getAddress().then((address) => {
      return address;
    });

    
    

    const uri = ref<string | null>("hello");
    const maxSupply = ref<number | null>(1);

    const mintNewMaster = async () => {
      clearPreviousResults();
      isLoading.value = true;
      NFTMintMaster(getWallet() as any, uri.value!, maxSupply.value as any)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
          isLoading.value = false;
          await fetchNewNFT();
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- print
    const masterEditionMint = ref<string | null>(null);
    const updateAuthority = ref<string | null>();

    const mintNewPrint = async () => {
      clearPreviousResults();
      isLoading.value = true;

      // if PKs don't deserialize, we don't want to call the rest of the function
      const masterPk = tryConvertToPk(masterEditionMint.value!);
      const updatePk = tryConvertToPk(updateAuthority.value!);
      if (error.value) {
        return;
      }

      NFTMintEditionFromMaster(getWallet() as any, masterPk!, updatePk as any)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
          isLoading.value = false;
          await fetchNewNFT();
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipArweave');

    return {
      DEFAULTS,
      isConnected,
      error,
      chosenNFTType,
      isLoading,
      mintResult,
      newNFT,
      // master
      uri,
      maxSupply,
      mintNewMaster,
      // print
      masterEditionMint,
      updateAuthority,
      mintNewPrint,
      // modal
      isModalVisible,
      showModal,
      hideModal,
      //get Address
      arweaveURL,
      getWalletAddress,
    };
  },
});
</script>

<style scoped></style>
