import React, { Component } from 'react';
import { Container, Row, Col, Input, Button } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    username: '',
    password: ''
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  }

  handleLogin = () => {
    // normal login to my service
    this.props.firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
    .then(resp => {
      console.log(resp);
    })
    .catch(err => {
      console.error(err);
    });
    
    // if fail, redirect to Uber login
  }

  render() {
    return (
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col sm={2}>
            <h3 className="w-100 text-center">Log In</h3>
            <Input className="mb-2" placeholder="Username" onChange={this.handleUsernameChange} />
            <Input className="mb-2" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
            <Button
              className="float-right"
              color="primary"
              disabled={!this.state.username || !this.state.password}
              onClick={this.handleLogin}
            >Submit</Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Login;
