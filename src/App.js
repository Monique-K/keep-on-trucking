import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      allStops: []
    }
  }

  componentWillMount() {
    fetch('http://localhost:8080/stops', {
      method: 'GET', 
    })
    .then(function(response) {
      console.log("received")
      response.text()
      .then(function(data) {
        console.log("DATA:", data);
      });
    })
  }
    // .then(function(myJson) {
    //   console.log("myjson", myJson)
    //   console.log(JSON.stringify(myJson));
    // })
    // .then(results => {
    //   console.log("results", results)
    //   const allStops = results;
    //   this.setState({allStops: [...this.state.allStops, allStops]})
    //   return allStops;
    // }).then(data => {
    //   console.log("dataaaaa", data)
      // data.forEach(person => {
      //   this.setState({ 
      //     isLoaded: true,
      //     candidates: [...this.state.candidates, person] })
      // })
    // })
  

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
