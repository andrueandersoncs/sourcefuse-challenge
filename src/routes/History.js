import React, { Component } from 'react';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
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
      viewMap: true
    }
    this.db = firebase.firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }

  componentDidMount = () => {
    if (!firebase.auth().currentUser) {
      this.props.history.push('/login');
      return;
    }

    this.registerHistoryUpdatedHandler();
    //this.handleSyncHistoryClicked();
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

  handleSyncHistoryClicked = async () => {
    return;

    // request sync uber history
    const token = await firebase.auth().currentUser.getIdToken();
    axios({
      method: 'GET',
      url: 'https://us-central1-sourcefuse-challenge-2.cloudfunctions.net/api/sync',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(resp => {
        window.location.href = resp.data.location;
      })
      .catch(err => {
        this.setError('Failed to sync uber history.');
      });
  }

  handleToggleView = () => {
    this.setState(prev => ({ viewMap: !prev.viewMap }));
  }

  handleMapInitialized = map => {
    if (!firebase.auth().currentUser) {
      this.props.history.push('/login');
    }

    const userId = firebase.auth().currentUser.uid;
    const docRef = this.db.collection('uberHistories').doc(userId);
    docRef.onSnapshot((snapshot) => {
      const uberHistory = snapshot.data();
      uberHistory.history.forEach(item => {
        const latLng = new google.maps.LatLng(item['start_city'].latitude, item['start_city'].longitude);
        const marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
      });
    });
  }

  render() {
    return (
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col md={8}>
            <Row className="d-flex justify-content-between mb-4 mt-4">
              <Button onClick={this.handleToggleView}>Map / Table</Button>
              {
                this.state.errorMessage &&
                <Alert color="danger" style={{ marginBottom: 0 }}>
                  {this.state.errorMessage}
                </Alert>
              }
              <Button onClick={this.handleSyncHistoryClicked} color="link">Sync History</Button>
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
