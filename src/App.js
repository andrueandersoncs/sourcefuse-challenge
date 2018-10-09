import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import Register from './routes/Register';
import Login from './routes/Login';
import History from './routes/History';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact render={() => <Redirect to="/login" />} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/history" exact component={History} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
