import React, { Component } from 'react';

import './Layers.css';

export default class Layers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            layersList: {},
        }

        this.getLayersList = this.getLayersList.bind(this);
        this.addLayer = this.addLayer.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getLayersList() {
        this.setState({ layersList: localStorage.getItem('LayersList') });
        return localStorage.getItem('LayersList');
    }

    addLayer(id, url, name){
        //access.post(url)
        localStorage.setItem('LayersList', JSON.stringify({ id, url, name }));
        this.setState({ layersList: localStorage.getItem('LayersList') });
    }

    getLayerData() {

    }

    render() {
        return (
            <div className='layers'>
                <p>{this.state.layersList[0]}</p>
            </div>
        );
    }
}
