const axios = require('axios');

async function getUser() {
  try {
    const response = await axios.get('https://api.wallet.pixelracers.io/engineMint/ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ');
    console.log(response.data[0].arweaveUrl);
  } catch (error) {
    console.error(error);
  }
}

export default getUser();