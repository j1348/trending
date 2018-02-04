import React, { Component } from 'react';
import { Card } from './Card';

export class Cards extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    return <div class="cards">
            {this.props.cards.map(card => <Card {...card} />)}
        </div>;
  }
}
