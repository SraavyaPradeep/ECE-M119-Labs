const noble = require('@abandonware/noble');

const uuid_service = "1101";
const uuid_value = ["2101", "2102", "2103"]


noble.on('stateChange', async(state) => {
    if (state == 'poweredOn'){
        console.log("start scanning")
        await noble.startScanningAsync([uuid_service], false);
    }
});
noble.on('discover',  async(peripheral) => {
   await noble.stopScanningAsync();
    await peripheral.connectAsync();
    const {characteristics} = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], uuid_value);
    
    readData(characteristics[0], characteristics[1], characteristics[2]);
    
});

let readData = async(characteristic0, characteristic1, characteristic2) => {
    
    const value0 = (await characteristic0.readAsync());
    const value1 = (await characteristic1.readAsync());
    const value2 = (await characteristic2.readAsync());
    console.log("X axis: " + value0.readFloatLE(0) + ", Y axis: " + value1.readFloatLE(0) + ", Z axis: " + value2.readFloatLE(0));
    
    setTimeout(() => {
        readData(characteristic0, characteristic1, characteristic2)
    }, 10);
    //}
}
