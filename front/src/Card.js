import React, { Component } from 'react';

export class Card extends Component {
    render() {
        return (
            <div class="card">
              <div class="card__title">
                <a target="_blank" href={this.props.href}>{this.props.name}</a>
                <span>{this.props.language}</span>
              </div>
              <div class="card__content">
                <p class="measure">
                  {this.props.description}
                </p>
              </div>
            </div>
        )
    }
}

