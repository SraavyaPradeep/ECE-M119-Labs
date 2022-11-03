// based on the example on https://www.npmjs.com/package/@abandonware/noble

const noble = require('@abandonware/noble');

const uuid_service = "1101"
const uuid_value = "2101"

let sensorValue = NaN
let goalValue = Math.random()
let posNeg = Math.floor(Math.random() * 2) 
let goal = NaN

noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
        console.log("start scanning")
        await noble.startScanningAsync([uuid_service], false);
    }
});

noble.on('discover', async (peripheral) => {
    await noble.stopScanningAsync();
    await peripheral.connectAsync();
    const {
        characteristics
    } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], [uuid_value]);
    readData(characteristics[0])
});

//
// read data periodically
//
let readData = async (characteristic) => {
    const value = (await characteristic.readAsync());
    sensorValue = value.readFloatLE(0);
    if (posNeg == 1){
	goalValue = goalValue * -1
    }
    goal = Math.min(Math.abs(sensorValue - goalValue) * 255, 255)
    console.log(sensorValue);

    
    //console.log(Math.min(Math.floor(Math.abs(Math.abs(sensorValue) - goalValue) * 255), 255))

    // read data again in t milliseconds
    setTimeout(() => {
        readData(characteristic)
    }, 10);
}

//
// hosting a web-based front-end and respond requests with sensor data
// based on example code on https://expressjs.com/
//
const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '../public'));

app.get('/', (req, res) => {
    res.render('test')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        sensorValue: sensorValue,
	goal: goal
    }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})