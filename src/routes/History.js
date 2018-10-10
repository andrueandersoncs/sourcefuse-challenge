import React, { Component } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Alert } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import axios from 'axios';
import GoogleMap from '../components/GoogleMap';
import RideHistoryTable from '../components/RideHistoryTable';

class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uberHistory: null,
      errorMessage: '',
      notification: '',
      viewMap: true
    }
    this.markers = [];
    this.db = firebase.firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }

  componentDidMount = () => {
    if (!firebase.auth().currentUser) {
      return this.props.history.push('/login');
    }

    this.registerHistoryUpdatedHandler();
    this.sync();
  }

  registerHistoryUpdatedHandler = () => {
    const userId = firebase.auth().currentUser.uid;
    const docRef = this.db.collection('uberHistories').doc(userId);
    docRef.onSnapshot((snapshot) => {
      const uberHistory = snapshot.data();
      this.setState({ uberHistory });
    });
  }

  setError = message => {
    this.setState({ errorMessage: message });
  }

  setNotification = message => {
    this.setState({ notification: message });
  }

  sync = async () => {
    const token = await firebase.auth().currentUser.getIdToken();
    return axios({
      method: 'GET',
      url: 'https://us-central1-sourcefuse-challenge-2.cloudfunctions.net/api/sync',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((resp) => {
      if (resp.data.location) {
        window.location.href = resp.data.location;
      }
    });
  }

  handleSyncHistoryClicked = () => {
    this.setState({ syncing: true });
    this.sync()
      .then(resp => {
        this.setNotification('Successfully synced uber history!');
        window.setTimeout(() => {
          this.setNotification('');
        }, 5000);
      })
      .catch(err => {
        this.setError('Failed to sync uber history.');
        window.setTimeout(() => {
          this.setError('');
        }, 5000);
      })
      .finally(() => {
        this.setState({ syncing: false });
      });
  }

  handleToggleMap = () => {
    this.setState({ viewMap: true });
  }

  handleToggleTable = () => {
    this.setState({ viewMap: false });
  }

  handleMapInitialized = map => {
    if (!firebase.auth().currentUser) {
      return this.props.history.push('/login');
    }

    const userId = firebase.auth().currentUser.uid;
    const docRef = this.db.collection('uberHistories').doc(userId);
    docRef.onSnapshot((snapshot) => {

      // remove previous markers
      this.markers.forEach(marker => {
        marker.setMap(null);
      });

      const data = snapshot.data() || { history: [] };
      const uberHistory = data.history;
      this.markers = uberHistory.map(item => {
        const latLng = new google.maps.LatLng(item['start_city'].latitude, item['start_city'].longitude);
        return new google.maps.Marker({
          position: latLng,
          map: map
        });
      });

      // pan to the first history point (or Jacksonville)
      const firstPoint = uberHistory[0] || { 'start_city': { latitude: 30.33, longitude: -81.65 } };
      const panTo = firstPoint['start_city'];
      map.panTo(new google.maps.LatLng(panTo.latitude, panTo.longitude));
    });
  }

  render() {
    return (
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col md={8}>
            <Row className="d-flex justify-content-between mb-4 mt-4">
              <ButtonGroup>
                <Button color="primary" onClick={this.handleToggleMap} active={this.state.viewMap}>Map</Button>
                <Button color="primary" onClick={this.handleToggleTable} active={!this.state.viewMap}>Table</Button>
              </ButtonGroup>
              {
                this.state.errorMessage &&
                <Alert color="danger" style={{ marginBottom: 0 }}>
                  {this.state.errorMessage}
                </Alert>
              }
              {
                this.state.notification &&
                <Alert color="success" style={{ marginBottom: 0 }}>
                  {this.state.notification}
                </Alert>
              }
              <Button
                onClick={this.handleSyncHistoryClicked}
                color="link"
                className={this.state.syncing ? 'loader' : ''}
              >Sync History</Button>
            </Row>
            <Row>
              {
                this.state.viewMap &&
                <GoogleMap onMapInitialized={this.handleMapInitialized} />
              }
              {
                !this.state.viewMap &&
                <RideHistoryTable uberHistory={this.state.uberHistory} />
              }
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default History;
