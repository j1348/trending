import 'tachyons/css/tachyons.css';
import '../css/index.scss';
import '../public/img/edit-cursor.svg';

import axios from 'axios';
function trending() {
    return axios.get('http://127.0.0.1:3000/trending');
};

import { Cards } from './Cards';

import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        this.setState({});

        trending().then(({ data }) => {
            this.setState({ cards: data });
        });
    }
    render() {
        if (!this.state.cards) {
            return null;
        }
        return <Cards cards={this.state.cards} />;
    }
}


render(<App />, document.getElementById('root'));
