const axios = require('axios');
let walletAddress = `ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ`;
let url = `https://api.wallet.pixelracers.io/engineMint/${walletAddress}`;
axios.get(url)
.then(res =>{
    console.log(res.data[0].redeemed);
});