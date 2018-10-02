import React, { Component } from 'react';

import './Layers.css';

export default class Layers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            layersList: []
        };

        this.getLayersList = this.getLayersList.bind(this);
        this.addLayer = this.addLayer.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getLayersList();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getLayersList() {
        let layersList = JSON.parse(localStorage.getItem('LayersList'));
        console.log(localStorage.getItem('LayersList'));
        this.setState({ layersList: layersList});
        return layersList;
    }

    addLayer(id, url, name){
        this.getLayersList();
        this.setState( {layersList: this.state.layersList.concat({ id:'404', url:'http://www.google.com', name:'saranga' })});
        localStorage.setItem('LayersList', JSON.stringify(this.state.layersList));
    }

    getLayerData() {

    }

    render() {
        return (
            <div className='layers'>
                <button onClick={this.addLayer}>add layer</button>
                { this.state.layersList.map( layer => <p>{layer.id}</p>)}
            </div>
        );
    }
}

/*this.state.layersList[0]?
<div>
<p>{this.state.layersList[0].id}</p>
<p>{this.state.layersList[0].url}</p>
<p>{this.state.layersList[0].name}</p>
</div>
: null*/

//('614','http://www.google.com','saranga')