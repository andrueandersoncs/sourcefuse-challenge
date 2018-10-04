import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import firebase from 'firebase/app';
import Login from './routes/Login';
import History from './routes/History';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  state = {
    firebase: null
  };

  componentDidMount = () => {
    this.setState({
      firebase: firebase.initializeApp({
        apiKey: "AIzaSyCmSfqCcViO_ZdiipamXdtpbHtvyeArbpQ",
        authDomain: "sourcefuse-challenge-2.firebaseapp.com",
        // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
        projectId: "sourcefuse-challenge-2",
        // storageBucket: "<BUCKET>.appspot.com",
        // messagingSenderId: "<SENDER_ID>",
      })
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact render={(props) => <Login {...props} firebase={this.state.firebase} />} />
          <Route path="/history" exact render={(props) => <History {...props} firebase={this.state.firebase} />} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
