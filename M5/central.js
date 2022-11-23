const noble = require('@abandonware/noble');
var cors = require('cors')

player1uuid = "e98909451bd60df2c0af684c4281ab2b";
player2uuid = "9a593618ebed3379163555439109ad87";

const uuid_service = ["2222", "1111"];
const uuid_value = "2140";

let sensorValue1 = NaN;
let sensorValue2 = NaN;

noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
        console.log("start scanning")
         await noble.startScanningAsync(["2222"], false);
    }
});

peripheralID1 = "";
peripheralID2 = "";

noble.on('discover', async (peripheral) => {
    await noble.stopScanningAsync();
    if (peripheral.connectable) {
        console.log(peripheral.uuid);
        /*const {
            characteristics
        } = await peripheral.discoverAllServicesAndCharacteristicsAsync();

        if (oldid == "" && peripheral.uuid != ""){
            oldid = peripheral.uuid;
            readData(characteristics[0]);
            await noble.startScanningAsync("1339", false);
        } else if (newid == "" && peripheral.uuid != "") {
            newid = peripheral.uuid
            readData1(characteristics[0]);
        }*/

        
        if ((peripheral.uuid == player1uuid) || (peripheral.uuid == player2uuid)) {

            if ((peripheralID1 == "") || (peripheralID2 == ""))
                await peripheral.connectAsync();
            const {
                characteristics
            } = await peripheral.discoverAllServicesAndCharacteristicsAsync();
            if (peripheral.uuid == player1uuid) {
                peripheralID1 = peripheral.uuid;
            } else if (peripheral.uuid == player2uuid) {
                peripheralID2 = peripheral.uuid;
            }
            if (peripheralID1 != "") {
                readData1(characteristics[0]);
                peripheralID1 = peripheral.uuid;
            } else if (peripheralID2 != "") {
                readData(characteristics[0]);
                peripheralID2 = peripheral.uuid;
            }
        }
    }
    // if there is anything left, that has not been connected
    if (peripheralID1 == "" || peripheralID2 == ""){
        await noble.startScanningAsync("1111", false);
    }
    
});


//
// read data periodically
// readData --> Player 1, readData1 --> Player 2
//


let readData = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValue1 = value.readFloatLE(0);
   // console.log(characteristic._serviceUuid);
    console.log("     " + sensorValue1);

    // read data again in t milliseconds
    setTimeout(() => {
        readData(characteristic)
    }, 10);
}
let readData1 = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValue2 = value.readFloatLE(0);
    
   console.log(sensorValue2);

    // read data again in t milliseconds
    setTimeout(() => {
        readData1(characteristic)
    }, 10);
}


// Broadcasting to server
const express = require('express')
const app = express()
const port = 3000
//const port1 = 4000

app.use(cors())
app.set('view engine', 'ejs');

// does not update the values to the game if express.static is used
//app.use(express.static(__dirname + '../public'));
app.get('/', (req, res) => {
    res.render('m5')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        sensorValue1: sensorValue1, 
        sensorValue2: sensorValue2
    }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/*
app.listen(port1, () => {
    console.log(`Example app listening on port ${port1}`)
})*/