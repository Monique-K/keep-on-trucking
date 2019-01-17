import React, { Component } from 'react';
import './App.scss';

// Importing api data as json files temporarily 
// const stopsJson = require('./json-api/stops');
// const legsJson = require('./json-api/legs');
// const driverJson = require('./json-api/driver');

class App extends Component {
  constructor() {
    super();
    this.state = {
      allStops: [],
      legs: [],
      driver: {},
      updatePercent: "",
    }
  }

  //  GET REQUESTS FOR JSON API *****************
  getStops = () => {
    fetch('http://localhost:8080/stops', {
      method: 'GET', 
    })
    .then((response) => {
      response.text()
      .then((data) => {
        this.setState({allStops: JSON.parse(data)})
      });
    })
  }

  getLegs = () => {
    fetch('http://localhost:8080/legs', {
      method: 'GET', 
    })
    .then((response) => {
      response.text()
      .then((data) => {
        this.setState({legs: JSON.parse(data)})
      });
    })
  }

  getDriver = () => {
    fetch('http://localhost:8080/driver', {
      method: 'GET', 
    })
    .then((response) => {
      response.text()
      .then((data) => {
        this.setState({ driver: JSON.parse(data)}) 
      });
    })
  }

  componentWillMount = () => {
    this.getStops();
    this.getLegs();
    this.getDriver();
    this.getLegCoordinates()
  }
  
  // CREATE 200 X 200 GRID **************************
  makeGrid = () => {
    const grid = []
    for (let i = 0; i < 100; i++) {
      let id = "box" + i 
      grid.push(<div key={id} className={`box ${id}`}></div>)
      }
      return grid
  }

  // POPULATE DROP DOWN WITH STOP LIST FROM STATE
  dropDown = () => {
    
    const array = this.state.allStops.map(item => {
        return (<div value={item.name} x={item.x} y={item.y} key={item.name}>{item.name}</div>)
      })
    
    return array
  }

  handlePercentChange = (e) => {
    this.setState({ updatePercent: e.target.value})
  }

  // showDriver = () => {
  //   if (this.state.driver !== {}) {
  //     let leg = this.state.driver.activeLegID
  //     console.log("leg", leg)
  //   }
  // }

  showStops = () => {
      let array = this.state.allStops.map(stop => {
        let top = stop.y * 2
        let left = stop.x * 2
        return (<div className="truck-stop" key={stop.name} style={{position: 'absolute', top: top, left: left}}>{stop.name}</div>)
      })
      return array
  }

  connectStops = () => {
    let a 
    let b
    let x
    Math.hypot(a, b);
    Math.atan(x);
    // line is a div with height 1 length hypot, absoulte position absolute, relative to the stop
  }

  getLegCoordinates = () => {
    // get the coordinates from the stops
    const legsWithCoords = []
    console.log("STATE", this.state.legs)
    this.state.legs.map(leg => {
      legsWithCoords.push(leg)
      console.log("!!", leg)
      for (let i = 0; i < this.state.allStops.length; i++) {
        if (leg.startStop === this.state.allStops[i].name) {
          leg.startStopX = this.state.allStops[i].x
          leg.startStopY = this.state.allStops[i].y
        }
      }
      return leg
    })
    this.setState({legsWithCoords: legsWithCoords})
  }


  render() {
    // this.showDriver()

    return (
      <div className="App">
      <div className="banner">
        <img src={require('./images/banner-truck.jpg')} alt="truck" />
      </div>
        <div className="title">
        Keep on Truckin'
        </div>
        <div className="main">
          <div className="map">
            {this.makeGrid()}
            {this.showStops()}
          </div>

          <form className="update-form">
            <div className="dropdown" id="dropdown-container">
              <button className="dropbtn drop-down">Select Stop</button>
              <div className="dropdown-content">
                {this.dropDown()}
              </div>
              <br />
            </div>
            <input 
              type="text" 
              value={this.state.updatePercent} 
              placeholder="Percent complete"
              onChange={this.handlePercentChange}
            >
            </input>
            <button type="submit">Update</button>
          </form>


        </div>
      </div>
    );
  }
}

export default App;

/*
*********** TO DO ***********

- set state with api datan-----
- create 200 x 200 grid -------
- show stops on grid by location ----
- show driver position on grid
- highlight complete legs and completed section of current leg
- add form to change driver's position
    - select leg via dropdown
    - select percent progress via textbox





*/