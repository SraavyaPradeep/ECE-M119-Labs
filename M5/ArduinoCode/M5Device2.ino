#include <ArduinoBLE.h>
#include <Arduino_LSM6DS3.h>
#include <Arduino_LSM6DSOX.h>

#define BLE_UUID_ACCELEROMETER_SERVICE "1101"
#define BLE_UUID_ACCELEROMETER_X "2101"
#define BLE_UUID_ACCELEROMETER_Y "2102"
#define BLE_UUID_ACCELEROMETER_Z "2103"
#define BLE_UUID_GYROSCOPE_SERVICE "1111"
#define BLE_UUID_GYROSCOPE_X "2139"
#define BLE_UUID_GYROSCOPE_Y "2140"
#define BLE_UUID_GYROSCOPE_Z "2141"

#define BLE_DEVICE_NAME "Elfo1"
#define BLE_LOCAL_NAME "Elfo1"

BLEService gyroscopeService(BLE_UUID_GYROSCOPE_SERVICE);

BLEFloatCharacteristic accelerometerCharacteristicX(BLE_UUID_ACCELEROMETER_X, BLERead | BLENotify);
BLEFloatCharacteristic accelerometerCharacteristicY(BLE_UUID_ACCELEROMETER_Y, BLERead | BLENotify);
BLEFloatCharacteristic accelerometerCharacteristicZ(BLE_UUID_ACCELEROMETER_Z, BLERead | BLENotify);
BLEFloatCharacteristic gyroscopeCharacteristicX(BLE_UUID_GYROSCOPE_X, BLERead | BLENotify);
BLEFloatCharacteristic gyroscopeCharacteristicY(BLE_UUID_GYROSCOPE_Y, BLERead | BLENotify);
BLEFloatCharacteristic gyroscopeCharacteristicZ(BLE_UUID_GYROSCOPE_Z, BLERead | BLENotify);

float ax, ay, az;
float gx, gy, gz;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);

  // initialize IMU
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1)
      ;
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println("Hz");

  // initialize BLE
  if (!BLE.begin()) {
    Serial.println("Starting Bluetooth® Low Energy module failed!");
    while (1)
      ;
  }

  // set advertised local name and service UUID
  BLE.setDeviceName(BLE_DEVICE_NAME);
  BLE.setLocalName(BLE_LOCAL_NAME);
  BLE.setAdvertisedService(gyroscopeService);

  /*
  accelerometerService.addCharacteristic(accelerometerCharacteristicX);
  accelerometerService.addCharacteristic(accelerometerCharacteristicY);
  accelerometerService.addCharacteristic(accelerometerCharacteristicZ);
  */

  gyroscopeService.addCharacteristic(gyroscopeCharacteristicX);
  gyroscopeService.addCharacteristic(gyroscopeCharacteristicY);
  gyroscopeService.addCharacteristic(gyroscopeCharacteristicZ);


  BLE.addService(gyroscopeService);

  /*accelerometerCharacteristicX.writeValue(0);
  accelerometerCharacteristicY.writeValue(0);
  accelerometerCharacteristicZ.writeValue(0);*/

  gyroscopeCharacteristicX.writeValue(0);
  gyroscopeCharacteristicY.writeValue(0);
  gyroscopeCharacteristicZ.writeValue(0);
  // start advertising
  BLE.advertise();
  

  /*Serial.println("BLE Accelerometer Peripheral");*/
}

void loop() {
  BLEDevice central = BLE.central();

  

  if (IMU.gyroscopeAvailable()) {
    digitalWrite(LED_BUILTIN, HIGH);
    IMU.readGyroscope(gx, gy, gz);
    /*IMU.readAccelerometer(ax, ay, az);*/

    /*accelerometerCharacteristicX.writeValue(x);
    accelerometerCharacteristicY.writeValue(y);
    accelerometerCharacteristicZ.writeValue(z);*/
    gyroscopeCharacteristicX.writeValue(gx);
    gyroscopeCharacteristicY.writeValue(gy);
    gyroscopeCharacteristicZ.writeValue(gz);
  } else {
    digitalWrite(LED_BUILTIN, LOW);
  }
}