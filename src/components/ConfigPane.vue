<template>
  <div class="flex justify-center mb-10">
    <div class="nes-select is-dark flex-1">
      <select required id="cluster" v-model="chosenCluster">
        <option :value="Cluster.Mainnet">Mainnet</option>
        <option :value="Cluster.Devnet">Devnet</option>
      </select>
    </div>
    <div class="nes-select is-dark flex-1">
      <select required id="wallet" v-model="chosenWallet">
        <option class="text-gray-500" :value="null">Choose wallet..</option>
        <option :value="WalletName.Phantom">Phantom</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { WalletName } from '@solana/wallet-adapter-wallets';
import useCluster, { Cluster } from '@/composables/cluster';
import useWallet from '@/composables/wallet';

export default defineComponent({
  setup() {
    // cluster
    const { cluster, setCluster, getClusterURL } = useCluster();
    const chosenCluster = computed({
      get() {
        return cluster.value;
      },
      set(newVal: Cluster) {
        setCluster(newVal);
      },
    });

    // wallet
    const { getWalletName, setWallet } = useWallet();
    const chosenWallet = computed({
      get() {
        return getWalletName();
      },
      set(newVal: WalletName | null) {
        setWallet(newVal, getClusterURL());
      },
    });



    return {
      Cluster,
      chosenCluster,
      WalletName,
      chosenWallet,
     
    };
  },
});
</script>

<style scoped></style>
