***************************

Carta Bus Three-js Project

Goals:
  - Plot current bus locations on google maps in real time
  - Plot the routes that each bus takes over the map
  - Plot the bus stops that are on each line
  - Click on bus to see bus's stats: speed, id, etc
  - Single page application using the following tools: 
    - node server
    - express
    - three.js
    - dat.gui.js
    - socket.io
    - bustracker api


API Calls that need to be implemented: /bustime/api/v1
  
  - /gettime: 
      args: none
      return: current system time

  - /getvehicles: 
      args: vid - comma delimited list of vehicle IDs
            rt - comma delimited list of rt IDs
      return: vid, tmstmp, lat, lon, hdg, pid, pidlist, des, dly

  - /getroutes:
      args: none
      return: rt, rtnm

  - /getdirections
      args: rt
      return: dir (EastBound, WestBound, etc.)

  - /getstops
      args: rt, dir
      return: stopid, stopnm, lat, lon

  - /getpatterns
      args: pid -or- rt
      response: tldr
      comments: Use the getpatterns request to retrieve the set of geo-positional points and stops that when connected can be used to construct the geo-positional layout of a pattern (ie. route variation).

  - /getpredictions

  - /getservicebulletins

  
