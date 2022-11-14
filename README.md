# ECE-M119-Labs

M3: Created a game to simulate Marco/Polo on the Arduino Nano 33 IoT. The program only measures the X component of the Arduino IMU. Each round (aka each 
time the program is run), a new random value is set as the "Correct Position". 
Users navigate the Arduino to find this position, indicated by the screen turning pink. As they go closer to the right tilt, the screen turns green.
The farther they go, the more blue it becomes. See results @: http://127.0.0.1:3000. 

To run code: 
(1) Connect Arduino Nano 33 IoT & upload .ino file
(2) Open terminal, move to the m3 directory. 
(3) Enter 'node central.js'

M4: 

To run: 
(1) clone the project
(2) Download cors -- npm install cors
(3) To start game -- node central.js
