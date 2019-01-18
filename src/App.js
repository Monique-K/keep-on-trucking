import React, { Component } from 'react';
import './App.scss';

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
    this.getLegCoordinates();
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
    const array = this.state.legs.map(item => {
        return (<div value={item.legID} key={item.legID}>{item.legID}</div>)
      })
    return array
  }

  handlePercentChange = (e) => {
    this.setState({ updatePercent: e.target.value})
  }

  // ------------------------------------------------------------------
  showDriver = () => {
    let activeLeg = this.state.driver.activeLegID
    let start = ""
    if (activeLeg) {
      for (let i = 0; i < this.state.allStops.length; i ++) {
        if (activeLeg[0] === this.state.allStops[i].name) {
          start = activeLeg[0]
          return (<i className="fas fa-truck"></i>)
        }
      }
      return 
    }
    // find use percent finished to place along leg div


    // Temporary - show driver at start of leg
    // let top = stop.y * 3
    // let left = stop.x * 3
    // return (<i className="fas fa-truck"></i>)
  }

  showStops = () => {
      let array = this.state.allStops.map(stop => {
        let top = stop.y * 3
        let left = stop.x * 3
        return (
          <div className={stop.name} key={stop.name} style={{position: 'absolute', top: top, left: left}}>
            {stop.name} &nbsp;
            <i className="fas fa-circle fa-xs"></i>
          </div>
        )
      })
      return array
  }

  connectStops = () => {
    let legLines = []
    if(this.state.allStops.length !== 0) {
      for (let i = 0; i < this.state.allStops.length - 1; i++) {
        let current = this.state.allStops[i]
        let next = this.state.allStops[i + 1]
        let a = next.x - current.x;
        let b = next.y - current.y;
        let hypot = Math.hypot(a * 3, b * 3).toFixed(2);
        let angle = Math.ceil((Math.atan2(b, a) * 180 / Math.PI))
        let lineCol = this.state.driver.activeLegID > current.name ? "green" : "yellow"
  
        let line = (<div className={`leg-line ${current.name}`} style={{height: '2.5px', width: `${hypot}px`, backgroundColor: lineCol, position: 'absolute', transform: `rotate(${angle}deg)`, transformOrigin: 'top left', top: `${current.y * 3 + 10}px`, left: `${current.x * 3 + 20}px`}}></div>)
        console.log(line)
        legLines.push(line)
      }
    }
  return legLines 
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
            {this.connectStops()}
            {this.showStops()}
            {this.showDriver()}
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
- highlight complete legs ---- 
- hightlight completed section of current leg
- add form to change driver's position
    - select leg via dropdown
    - select percent progress via textbox


*/