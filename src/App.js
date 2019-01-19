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
      updateLeg: "",
      formError: null
    }
  }

  //  *** GET REQUESTS FOR JSON API *****************
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

  // *** CALL FETCH FUNCTIONS BEFORE PAGE LOADS *****************
  componentWillMount = () => {
    this.getStops();
    this.getLegs();
    this.getDriver();
  }
  

  // *** CREATE 200 X 200 GRID *****************
  makeGrid = () => {
    const grid = []
    for (let i = 0; i < 100; i++) {
      let id = "box" + i 
      grid.push(<div key={id} className={`box ${id}`}></div>)
      }
      return grid
  }

  // *** RENDER THE STOPS INSSIDE THE GRID *****************
  showStops = () => {
    let array = this.state.allStops.map(stop => {
      let top = stop.y * 5
      let left = stop.x * 5
      return (
        <div className={stop.name} key={stop.name} style={{position: 'absolute', top: top, left: left}}>
            {stop.name} &nbsp;
            <i className="fas fa-circle fa-xs"></i>
          </div>
        )
      })
      return array
    }
    
    // *** DRAW LEGS  AND DRIVER ON GRID *****************
    connectStops = () => {
      let legLines = []
      if(this.state.allStops.length !== 0 && this.state.driver.activeLegID) {
        let driver = null
        let line
        let progress = this.state.driver.legProgress
        for (let i = 0; i < this.state.allStops.length - 1; i++) {
          let current = this.state.allStops[i]
          let next = this.state.allStops[i + 1]
          let a = next.x - current.x;
          let b = next.y - current.y;
          let hypot = Math.hypot(a * 5, b * 5).toFixed(2);
          let angle = Math.ceil((Math.atan2(b, a) * 180 / Math.PI))

          let lineCol = this.state.driver.activeLegID > current.name ? "green" : "yellow"
          
          if (this.state.driver.activeLegID.charAt(0) === current.name) {
            driver = (<i className="fas fa-truck fa-lg" style={{
                  position: 'absolute', 
                  top: '-3px',
                  left: `${progress * hypot / 100}px`
                }}></i>)

            line = (
              <div 
                key={current.name}
                className={`leg-line ${current.name}`} 
                style={{height: '2.5px', 
                width: `${hypot}px`, 
                position: 'absolute', 
                transform: `rotate(${angle}deg)`, 
                transformOrigin: 'top left', 
                top: `${current.y * 5 + 10}px`, 
                left: `${current.x * 5 + 20}px`}}
              >
              <div className="first" style={{backgroundColor: 'green', height: '2.5px', 
                width: `${hypot * (progress / 100)}px`}}></div>
              {driver}
              <div className="second" style={{backgroundColor: 'yellow', height: '2.5px', 
                width: `${hypot * ((100 - progress) / 100)}px`, float: "right"}}></div>
              </div>
            )
          } else {
            driver = null
            line = (
              <div 
                key={current.name}
                className={`leg-line ${current.name}`} 
                style={{height: '2.5px', 
                width: `${hypot}px`, 
                backgroundColor: lineCol, 
                position: 'absolute', 
                transform: `rotate(${angle}deg)`, 
                transformOrigin: 'top left', 
                top: `${current.y * 5 + 10}px`, 
                left: `${current.x * 5 + 20}px`}}
              >
          </div>
        )
      }
      legLines.push(line)
      }
    }
    return legLines 
  }
  
  // *** POPULATE DROP DOWN WITH STOP LIST FROM STATE *****************
  dropDown = () => {
    const array = this.state.legs.map(item => {
        return (<div id={item.legID} key={item.legID} className="dropdown-item" onClick={this.handleLegChange}>{item.legID}</div>)
      })
    return array
  }

  // *** UPDATE PERCENTAGE OF LEG COMPLETED *****************
  handlePercentChange = (e) => {
    this.setState({ updatePercent: e.target.value})
  }

  handleLegChange = (e) => {
    this.setState({ updateLeg: e.target.id})
  }

  handleFormSubmit = () => {
    // const updatedDriver = JSON.stringify({
    //   activeLegID: this.state.updateLeg,
    //   legProgress: this.state.updatePercent
    // })

    // fetch('http://localhost:8080/driver', {
    //   method: 'PUT',
    //   body: updatedDriver,
    // })
    // .then(function (response) {
    //   console.log("API response:", response)
    //   return response.json();
    // })
  
  }
  
  render() {
    return (
      <div className="App">
      <div className="banner">
        {/* <img src={require('./images/banner-truck.jpg')} alt="truck" /> */}
      </div>
        <div className="title">
        Keep on Truckin'
        </div>
        <div className="main">

          <div className="position-section">
            <div className="position-title">Driver Position:</div>
            <div className="position-leg">Leg: {this.state.driver.activeLegID}</div>
            <div className="position-percent">Leg Progress: {this.state.driver.legProgress}%</div>
          </div>

          <div className="map-section">
            <div className="map">
              {this.makeGrid()}
              {this.connectStops()}
              {this.showStops()}
            </div>
            <div className="legend">
              <div className="legend-text">Complete:</div>
              <div className="legend-item complete"></div>
              <div className="legend-text">Incomplete:</div>
              <div className="legend-item incomplete"></div>
            </div>
          </div>

          <div className="form-section">
            <form className="form">
              <div className="update-form">
                <div className="form-title">Update Driver Position</div>
                  <div className="dropdown" id="dropdown-container">
                    <div className="dropbtn drop-down button">Select Leg</div>
                    <div className="dropdown-content">
                      {this.dropDown()}
                    </div>
                    <br />
                  </div>
                  <input 
                    type="text" 
                    className="input button"
                    value={this.state.updatePercent} 
                    placeholder="Percent complete"
                    onChange={this.handlePercentChange}
                    >
                  </input>
                <button type="submit" className="button">Update</button>
                <div className="form-error">{this.state.formError}</div>
              </div>
            </form>
          </div>


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
- show driver position on grid ----
- highlight complete legs ---- 
- hightlight completed section of current leg ----
- add form to change driver's position
    - select leg via dropdown
    - select percent progress via slider
- Features.md 

- fix first/last stop overlap
-animate truck movement
- buttons are wrong height

*/