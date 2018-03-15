import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');


class FoodSuggestion extends Component {
  constructor(props) {
    super(props);
    this.state = props;

    this.voteFoodSuggestion = this.voteFoodSuggestion.bind(this);
  }

  voteFoodSuggestion() {
    socket.emit('voteFoodSuggestion', this.state.food)
  }

  render() {
    return(
      <div>{this.props.food} {this.props.votes} <button onClick={this.voteFoodSuggestion}>+1</button></div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      foodSuggestions: null,
      currentInputFoodSuggestion: ''
    };

    this.handleEnterNewFoodSuggestion = this.handleEnterNewFoodSuggestion.bind(this);
    this.handleInputFoodSuggestion = this.handleInputFoodSuggestion.bind(this);
  }

  componentWillMount() {
    socket.on('latestFoodMap', foodMap => {
      console.log("Food map loaded: " + foodMap);
      this.setState({
        loading: false,
        foodSuggestions: JSON.parse(foodMap)
      });
      socket.on('foodSuggestionAdded', newFoodSuggestion => this.putSuggestion(newFoodSuggestion))
      socket.on('foodSuggestionUpdated', updatedFoodSuggestion => this.putSuggestion(updatedFoodSuggestion))
    });
    socket.emit('newConnection');
  }

  putSuggestion(suggestion) {
    console.log(suggestion);
    let foodSuggestions = Object.assign({}, this.state.foodSuggestions);
    foodSuggestions[suggestion.food] = suggestion.votes;
    this.setState({
      foodSuggestions: foodSuggestions
    });
  }

  handleInputFoodSuggestion(event) {
    this.setState({
      currentInputFoodSuggestion: event.target.value
    });
  }

  handleEnterNewFoodSuggestion(event) {
    event.preventDefault();

    socket.emit('newFoodSuggestion', this.state.currentInputFoodSuggestion)
    this.setState({
      currentInputFoodSuggestion: ''
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>Loading</div>
      )
    }
    const foodSuggestions = Object.entries(this.state.foodSuggestions).map((suggestion, i) => {
      return (
          <FoodSuggestion
            food={suggestion[0]}
            votes={suggestion[1]} 
          />
      );
    });
    

    return (
      <div>
        <form onSubmit={this.handleEnterNewFoodSuggestion}>
          <input onChange={this.handleInputFoodSuggestion} value={this.state.currentInputFoodSuggestion}></input>
        </form>
        {foodSuggestions}
      </div>
    );
  }
}

export default App;
