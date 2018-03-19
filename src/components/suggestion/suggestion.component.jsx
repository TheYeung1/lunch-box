import React, { Component } from 'react';

export class SuggestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = props;

    this.voteFoodSuggestion = this.voteFoodSuggestion.bind(this);
  }

  voteFoodSuggestion() {
    this.props.socket.emit('voteFoodSuggestion', this.state.food)
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