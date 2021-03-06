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
      updateLeg: "Select Leg",
      formError: null,
    }
  }

  //  *** GET REQUESTS FOR JSON API ***
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

  // *** CALL FETCH FUNCTIONS BEFORE PAGE LOADS ***
  componentWillMount = () => {
    this.getStops();
    this.getLegs();
    this.getDriver();
  }

  // *** CREATE GRID TO SHOW DRIVER AND STOPS ***
  makeGrid = () => {
    const grid = []
    for (let i = 0; i < 100; i++) {
      let id = "box" + i 
      grid.push(<div key={id} className={`box ${id}`}></div>)
      }
      return grid
  }

  // *** RENDER THE STOPS INSIDE THE GRID ***
  showStops = () => {
    let array = this.state.allStops.map(stop => {
      let top = stop.y * 4
      let left = stop.x * 4
      return (
        <div className={stop.name} key={stop.name} style={{position: 'absolute', top: top, left: left, color: 'rgb(41, 39, 39)'}}>
            {stop.name} &nbsp;
            <i className="fas fa-circle fa-xs"></i>
          </div>
        )
      })
      return array
    }
    
    // *** DRAW LEGS AND DRIVER ON GRID ***
    connectStops = () => {
      let legLines = []
      // only run this function once stops and driver position are loaded from API
      if(this.state.allStops.length !== 0 && this.state.driver.activeLegID) {
        let driver = null
        let line
        let progress = this.state.driver.legProgress
        for (let i = 0; i < this.state.allStops.length - 1; i++) {
          let current = this.state.allStops[i]
          let next = this.state.allStops[i + 1]
          let a = next.x - current.x;
          let b = next.y - current.y;
          let hypot = Math.hypot(a * 4, b * 4).toFixed(2);
          let angle = Math.floor((Math.atan2(b, a) * 180 / Math.PI))

          // If the driver is going left to right on the map, flip the truck icon so 
          // it appears upright
          let rotateStyle = current.x > next.x ? 'scaleY(-1)' : null

          

          // set colours for complete and incomplete legs
          let lineCol = this.state.driver.activeLegID > current.name ? "rgb(55, 179, 55)" : "yellow"
          
          // if this is the leg that the driver is in, show the driver's position and the complete and incomplete
          // sections of the leg
          if (this.state.driver.activeLegID.charAt(0) === current.name) {
            driver = (<i className="fas fa-truck fa-lg" style={{
                  position: 'absolute', 
                  top: '-3px',
                  left: `${progress * hypot / 100}px`,
                  transform: rotateStyle 
                }}></i>)

            line = (
              <div 
                key={current.name}
                className={`leg-line ${current.name}`}
                hypot={current.hypot} 
                style={{height: '2.5px', 
                width: `${hypot}px`, 
                position: 'absolute', 
                transform: `rotate(${angle}deg)`, 
                transformOrigin: 'top left', 
                top: `${current.y * 4 + 10}px`, 
                left: `${current.x * 4 + 20}px`}}
              >
              <div className="first" style={{backgroundColor: 'rgb(55, 179, 55)', height: '2.5px', 
                width: `${hypot * (progress / 100)}px`}}></div>
              {driver}
              <div className="second" style={{backgroundColor: 'yellow', height: '2.5px', 
                width: `${hypot * ((100 - progress) / 100)}px`, float: "right"}}></div>
              </div>
            )
          } else {
            // if this is not the driver's current leg, return just the leg line
            driver = null
            line = (
              <div 
                key={current.name}
                className={`leg-line ${current.name}`}
                hypot={current.hypot} 
                style={{height: '2.5px', 
                width: `${hypot}px`, 
                backgroundColor: lineCol, 
                position: 'absolute', 
                transform: `rotate(${angle}deg)`, 
                transformOrigin: 'top left', 
                top: `${current.y * 4 + 10}px`, 
                left: `${current.x * 4 + 20}px`}}
              >
          </div>
        )
      }
      // add each legline to an array
      legLines.push(line)
      }
    }
    return legLines 
  }
  
  // *** POPULATE DROP DOWN WITH STOP LIST FROM STATE ***
  dropDown = () => {
    const array = this.state.legs.map(item => {
        return (<div id={item.legID} key={item.legID} className="dropdown-item" onClick={ e => this.handleLegChange(e) }>{item.legID}</div>)
      })
    return array
  }

  // *** UPDATE PERCENTAGE OF LEG COMPLETED ***
  handlePercentChange = (e) => {
    this.setState({ formError: "" })
    this.setState({ updatePercent: e.target.value})
  }

  // *** UPDATE LEG SELECTION ***
  handleLegChange = (e) => {
    this.setState({ formError: "" })
    this.setState({ updateLeg: e.target.id})
  }

  // *** HANDLE ERRORS ON FORM SUBMISSION ***
  errorCheck = () => {
    let percent = Number(this.state.updatePercent)
    // check for incomplete submission
    if (this.state.updatePercent === "" || this.state.updateLeg === "Select Leg") {
      this.setState({ formError: "Please enter a leg and percentage complete" }) 
      //check for numbers not in range
    } else if (isNaN(percent) || percent > 100 || percent < 0) {
      this.setState({ formError: "Please enter a percentage from 0 to 100" })
    }
  }

  // *** SUBMIT THE NEW LEG AND PERCENTAGE TO API ***
  handleFormSubmit = (e) => {
    this.errorCheck()
    const updatedDriver = {
      activeLegID: this.state.updateLeg,
      legProgress: this.state.updatePercent
    }
    fetch('http://localhost:8080/driver', {
      method: 'PUT', 
      body: JSON.stringify(updatedDriver),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      console.log('Success:', JSON.stringify(response))
    })
    // Reset the update form to its original state
    this.setState({
      updatePercent: "",
      updateLeg: "Select Leg",
    })
  }
  
  render() {
    return (
      <div className="App">

        <div className="navbar">
          <div className="title">
          Keep on Truckin'
          </div>
        </div>
        
        <div className="main">

          <div className="map-section">
            <div className="map">
              {this.makeGrid()}
              {this.connectStops()}
              {this.showStops()}
            </div>
          </div>

          <div className="section-2">

            <div className="form-section">
              <form className="form">
                <div className="update-form">
                  <div className="form-title">Update Driver Position</div>

                    <div className="position-section">
                      <div className="position-title">Current:</div>
                      <div className="position-items">
                        <div className="position-leg">Leg: {this.state.driver.activeLegID}</div>
                        <div className="position-percent">Leg Progress: {this.state.driver.legProgress}%</div>
                      </div>
                    </div>

                    <div className="dropdown-and-input">
                      <div className="dropdown" id="dropdown-container">
                        <div className="dropbtn drop-down button">{this.state.updateLeg}</div>
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
                    </div>
                  <button type="submit" className="button update-btn" onClick={this.handleFormSubmit}>Update</button>
                  <div className="form-error">{this.state.formError}</div>
                </div>
              </form>
            </div>
            
            <div className="legend">
              <div className="legend-section">
                <div className="legend-text">Complete:</div>
                <div className="legend-item complete"></div>
              </div>
              <div className="legend-section">
                <div className="legend-text">Incomplete:</div>
                <div className="legend-item incomplete"></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
}

export default App;
