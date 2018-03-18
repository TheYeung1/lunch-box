import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import 'bulma/css/bulma.css';

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
    const voteText = this.props.votes.toString() + ' vote' + (this.props.votes > 1 ? 's' : '');

    return(
      <div class="column is-one-third-widescreen is-one-quarter-fullhd is-half-desktop is-half-tablet is-three-quarters-mobile">
        <div class="card">
          <div class="card-header">
            <p class="card-header-title">{this.props.food}</p>
          </div>
          <div class="card-content">
            <p>{voteText}</p>
            <button class="button is-small" onClick={this.voteFoodSuggestion}>+1</button>
          </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      foodSuggestions: null,
      currentInputFoodSuggestion: '',
      location: null
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
    navigator.geolocation.getCurrentPosition(function(position){
      this.setState({
        location: {latitude: position.coords.latitude, longitude: position.coords.longitude}
      });
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
            key={i}
          />
      );
    });
    

    return (
      <section class="section">
        <div class="container is-widescreen control">
          <form onSubmit={this.handleEnterNewFoodSuggestion}>
            <input class="input" placeholder="Suggest something!" onChange={this.handleInputFoodSuggestion} value={this.state.currentInputFoodSuggestion}></input>
          </form>
          <div class="columns is-multiline is-mobile">
            {foodSuggestions}
          </div>
        </div>
      </section>
    );
  }
}

export default App;
