const axios = require('axios');
const fs = require('fs');

fs.readFile('/Users/hashmin/Desktop/arweaveLink.json', (err, data) => {
    if (err) console.log(err);

    let rawJson = JSON.parse(data);
    // console.log(rawJson);

    readArweaveToFile(rawJson, 0, 1);
})

    function readArweaveToFile(rawJson, startIndex, packSize) {
        let promises = [];
        let max = startIndex + packSize;
        if (max > 19999) {
            max = 19999;
        }

        for (let i = startIndex; i < max; ++i) {
                let row = rawJson[i];
                
                promises.push(axios.get(row.id)
                .then ((raw) => {
                    let creators = raw.data.properties.creators;
                    for (let cI = 0; cI < creators.length; ++cI) {
                        let creator = creators[cI];
                        
                        if (creator.share === 0) {
                            return {
                                arweave: row.id,
                                address: creator.address
                            }
                        }
                    }
                }));
            }
            
            Promise.all(promises)
            .then((results) => {
                let final = {};
                
                if (fs.existsSync('ordered-addresses2.json')) {
                    let finalRaw = fs.readFileSync('ordered-addresses2.json');
                    final = JSON.parse(finalRaw.toString());
                }
                
                results.map((res) => {
                    if (!final[res.address]) {
                        final[res.address] = [];
                    }
                    
                    final[res.address].push(res.arweave);
                });
                
                console.log(final);
                fs.writeFile('ordered-addresses2.json', JSON.stringify(final), async (err) => {
                    if (err) {
                        console.log(err);
                    }

                    if (startIndex + packSize < 19999) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        readArweaveToFile(rawJson, startIndex + packSize, packSize);
                    }
                });
            });
    }