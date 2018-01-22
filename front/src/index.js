import css from 'tachyons/css/tachyons.css';

import axios from 'axios';
function trending() {
    return axios.get('http://127.0.0.1:3000/trending');
};

import { Card } from './Card';

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
            this.setState({ card: data[0] });
        });
    }
    render() {
        if (!this.state.card) {
            return null;
        }
        return <Card {...this.state.card} />;
    }
}


render(<App />, document.getElementById('root'));
