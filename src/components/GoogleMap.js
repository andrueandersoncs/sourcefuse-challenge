import React, { Component } from 'react';

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount = () => {
    const map = new google.maps.Map(this.ref.current, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10
    });
    if (this.props.onMapInitialized) {
      this.props.onMapInitialized(map);
    }
  }

  render() {
    return (
      <div style={{ height: '75vh', width: '100%' }} ref={this.ref}>THE MAP</div>
    );
  }
}

export default GoogleMap;
