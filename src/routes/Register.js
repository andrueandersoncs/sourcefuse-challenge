import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Alert } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';

class Register extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: '',
    password: '',
    passwordConfirmation: ''
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  }

  handlePasswordConfirmationChange = e => {
    this.setState({ passwordConfirmation: e.target.value });
  }

  handleRegistration = () => {
    if (!this.isFormValid()) return;

    firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password)
      .then(() => {
        this.props.history.push('/history');
      })
      .catch((error) => {
        var errorMessage = error.message;
        this.setState({ errorMessage });
      });
  }

  isFormValid = () => {

    // each must contain something
    if (!(this.state.username && this.state.password && this.state.passwordConfirmation)) {
      this.setState({ errorMessage: 'Each field must contain text.' });
      return false;
    }

    // email must contain @ symbol and . symbol
    if (!(this.state.username.indexOf('@') !== -1)) {
      this.setState({ errorMessage: 'Email must contain @' });
      return false;
    }
    
    if (!(this.state.username.indexOf('.') !== -1)) {
      this.setState({ errorMessage: 'Email must contain .' });
      return false;
    }

    // password and password confirmation must match
    if (!(this.state.password === this.state.passwordConfirmation)) {
      this.setState({ errorMessage: 'Password and Password Confirmation must match.' });
      return false;
    }

    return true;
  }

  render() {
    return (
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col sm={2}>
            <Row>
              <h3 className="w-100 text-center">User Registration</h3>
              <Input className="mb-2" placeholder="Username" onChange={this.handleUsernameChange} />
              <Input className="mb-2" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
              <Input className="mb-2" type="password" placeholder="Confirm Password" onChange={this.handlePasswordConfirmationChange} />
              <Button
                className="float-right"
                color="primary"
                onClick={this.handleRegistration}
              >Register</Button>
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

export default Register;
