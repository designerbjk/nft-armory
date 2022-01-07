import axios from 'axios';

// async function getUser() {
//   try {
//     const response = await axios.get('https://api.wallet.pixelracers.io/engineMint/ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ');
//     return response.data[0].arweaveUrl;
//   } catch (error) {
//     console.error(error);
//   }
// }


// async function getURL() {
//    axios.get('https://api.wallet.pixelracers.io/engineMint/ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ')
//   .then(function(response) {
//     let uri = response.data[0].arweaveUrl;
//     console.log(JSON.stringify(uri));
//     // I need this data here ^^
  
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
// }


async function myFetch() {
  let response = await axios.get('https://api.wallet.pixelracers.io/engineMint/ERz6kx2tyLcvHZqiViYyLwHLrpRvBT4vviTe4VdHusVQ');
  if (!response) {
    throw new Error(`HTTP error! status: ${response}`);
  }
  return await response.data[0].arweaveUrl;
}

myFetch()
  .then(data=> {
    let objectURL = data;
    return objectURL;
  })
  .catch(e => console.log(e));



export default myFetch();


function axiosTest (populateData) {
  axios.get(url)
 .then(function(response){
         populateData(response.data);
  })
  .catch(function(error){
         console.log(error);
   });
}   

const uri ;  
const populateData = (data) => {uri.push(data)} 


