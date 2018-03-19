import React, { Component } from 'react';
import openSocket from 'socket.io-client';

import { SuggestionComponent } from '../suggestion/suggestion.component';

class LunchBoxComponent extends Component {
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

    this.socket = openSocket('http://localhost:8000');
  }

  componentWillMount() {
    const setLocation = position => {
      this.setState({
        location: {latitude: position.coords.latitude, longitude: position.coords.longitude}
      });
    }

    const boundSetLocation = setLocation.bind(this);

    this.socket.on('latestFoodMap', foodMap => {
      console.log("Food map loaded: " + foodMap);
      this.setState({
        loading: false,
        foodSuggestions: JSON.parse(foodMap)
      });
      this.socket.on('foodSuggestionAdded', newFoodSuggestion => this.putSuggestion(newFoodSuggestion))
      this.socket.on('foodSuggestionUpdated', updatedFoodSuggestion => this.putSuggestion(updatedFoodSuggestion))
    });
    navigator.geolocation.getCurrentPosition(function(position){
      boundSetLocation(position);
    });
    this.socket.emit('newConnection');
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

    this.socket.emit('newFoodSuggestion', this.state.currentInputFoodSuggestion)
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
          <SuggestionComponent
            food={suggestion[0]}
            votes={suggestion[1]} 
            socket={this.socket}
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

export { LunchBoxComponent };