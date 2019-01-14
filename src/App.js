import React, { Component } from 'react';
import './App.scss';
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
  
  makeGrid() {
    const grid = []
    for (let i = 0; i < 10; i++) {
      let id = "box" + i 
      grid.push(<div key={id} className={`box ${id}`}></div>)
      }
      console.log(grid)
      grid.forEach(div => {
        return div
      })
      // for (let i = 0; i < grid.length; i++) {
      //   if (i) {
      //     return grid[i]
      //   }
      // }
  }

  dropDown() {
    const items = this.state.allStops
    items.forEach(item => {
      return (<option value={item.name} x={item.x} y={item.y}>{item.name}</option>)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="map">
          {this.makeGrid()}
        </div>
        <div className="drop-down">
        <select>
          {this.dropDown()}
        </select>
        </div>
      </div>
    );
  }
}

export default App;
