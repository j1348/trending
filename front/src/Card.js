import React, { Component } from 'react';

export class Card extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <article className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
              <div className="pa2 ph3-ns pb3-ns">
                <div className="dt w-100 mt1">
                  <div className="dtc">
                    <h1 className="f5 f4-ns mv0"><a target="_blank" href={this.props.href}>{this.props.name}</a></h1>
                  </div>
                  <div className="dtc tr">
                    <h2 className="f5 mv0">{this.props.language}</h2>
                  </div>
                </div>
                <p className="f6 lh-copy measure mt2 mid-gray">
                  {this.props.description}
                </p>
              </div>
            </article>
        )
    }
}
