import React, { Component } from 'react';
import './App.scss';

// Importing api data as json files temporarily 
const stopsJson = require('./json-api/stops');
const legsJson = require('./json-api/legs');
const driverJson = require('./json-api/driver');

class App extends Component {
  constructor() {
    super();
    this.state = {
      allStops: stopsJson,
      legs: legsJson,
      driver: driverJson
    }
  }

  //  GET REQUESTS FOR JSON API *****************
  // getStops() {
  //   fetch('http://localhost:8080/stops', {
  //     method: 'GET', 
  //   })
  //   .then(function(response) {
  //     response.text()
  //     .then(function(data) {
  //       console.log("stops:", JSON.parse(data))
  //       return JSON.parse(data)
  //     });
  //   })
  // }

  // getLegs() {
  //   fetch('http://localhost:8080/legs', {
  //     method: 'GET', 
  //   })
  //   .then(function(response) {
  //     response.text()
  //     .then(function(data) {
  //       console.log("legs:", JSON.parse(data))
  //       return JSON.parse(data)
  //     });
  //   })
  // }

  // getDriver() {
  //   fetch('http://localhost:8080/driver', {
  //     method: 'GET', 
  //   })
  //   .then(function(response) {
  //     response.text()
  //     .then(function(data) {
  //       console.log("driver:", JSON.parse(data))
  //       return JSON.parse(data)
  //     });
  //   })
  // }

  // componentWillMount() {
  //   const stops = this.getStops();
  //   const legs = this.getLegs();
  //   const driver = this.getDriver();
  //   this.setState({
  //     allStops: [...this.state.allStops, stops],
  //     legs: [...this.state.legs, legs],
  //     driver: {0: driver}
  //   });
  // }
  
  // CREATE 200 X 200 GRID **************************
  makeGrid() {
    const grid = []
    for (let i = 0; i < 10; i++) {
      let id = "box" + i 
      grid.push(<div key={id} className={`box ${id}`}></div>)
      }
      grid.forEach(div => {
        return div
      })
      // for (let i = 0; i < grid.length; i++) {
      //   if (i) {
      //     return grid[i]
      //   }
      // }
  }

  // POPULATE DROP DOWN WITH STOP LIST FROM STATE
  dropDown() {
    const items = this.state.allStops
    items.forEach(item => {
      return (<option value={item.name} x={item.x} y={item.y}>{item.name}</option>)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="title">
        Keep on Truckin'
        </div>
        <div className="main">
          <div className="map">
            {this.makeGrid()}
          </div>
          <div class="dropdown" id="dropdown-container">
            <button class="dropbtn drop-down">Select Stop</button>
            <div class="dropdown-content">
              {this.dropDown()}
              {/* Test links until forEach function works */}
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
