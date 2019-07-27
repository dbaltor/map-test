# Denis map-test 2018
Test map application developed on Node.js.
<br>It requires the MAP_KEY environment variable set to the LocationIQ API token. 

A small application that updates the UK map based on 2 independent continuous streams of events: 
1) around 2000 risk areas (Heat map) updated every second 
2) 100 moving vehicles updated every 2 seconds.

*Server command line:
=====================
./readfile.sh {heatmapfile} | node server.js {lab} {vehicles} {rate} 
<br>*Lab = Type of simulation. Valid Values: 1, 2, both. Default: both
<br>*Vehicles = Number of vehicles to track. Defaul: 10
<br>*Rate = Vehicles real refresh interval in seconds. Default: 60
<br>*example: ./readfile.sh test.csv | node server.js both 10 2

*Client URL:
============
localhost:8080

*Cloud URL:
===========

<a href="https://secure-atoll-96979.herokuapp.com/" target="_blank">Running on Heroku</a>

*Architectural decisions:
=========================
1) Event-driven architecture (EDA) chosen rather than one-thread-per-connection. I have opted for implementing this sample application using Node.js because all that must be done is handling data streams. For such I/O-bound scenarios, I believe an EDA will be more scalable whilst lightweight.

2) Push notifications using WebSockets. I believe only WebSockets (or Server-Sent Events) are viable options to meet the required UI update rate.

3) Binary protocol. Protbuf is used for client-server communication to optmise the bandwidth.