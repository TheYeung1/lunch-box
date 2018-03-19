import React from 'react';
import './suggestion.styles.css';

export const SuggestionComponent = ({
  votes,
  food,
  socket,
}) => (
  <div class="column is-one-third-widescreen is-one-quarter-fullhd is-half-desktop is-half-tablet is-three-quarters-mobile">
    <div class="card">
      <div class="card-header">
        <p class="card-header-title">{food}</p>
      </div>
      <div 
        class="card-content suggestion-card"
        onClick={() => socket.emit('voteFoodSuggestion', food)}>
        <p class="has-text-centered	">
          {`${votes} ${votes > 1 ? 'votes' : 'vote'}`}
        </p>
      </div>
    </div>
  </div>
)