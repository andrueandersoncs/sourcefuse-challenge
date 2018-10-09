import React, { Component } from 'react';
import { Container, Row, Col, Input, Button } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: '',
    password: '',
    errorMessage: ''
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  }

  handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(() => {
        this.props.history.push('/history')
      })
      .catch(err => {
        this.setState({ errorMessage: err.errorMessage });
      });
  }

  render() {
    return (
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col sm={2}>
            <Row>
              <h3 className="w-100 text-center">Log In</h3>
              <Input className="mb-2" placeholder="Username" onChange={this.handleUsernameChange} />
              <Input className="mb-2" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
              <Row noGutters className="w-100 d-flex justify-content-between">
                <Button
                  color="link"
                  onClick={() => this.props.history.push('/register')}
                >Register</Button>
                <Button
                  className="float-right"
                  color="primary"
                  disabled={!this.state.username || !this.state.password}
                  onClick={this.handleLogin}
                >Submit</Button>
              </Row>
            </Row>
            <Row className="mt-2">
              {
                this.state.errorMessage &&
                <Alert color="danger">
                  {this.state.errorMessage}
                </Alert>
              }
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Login;
