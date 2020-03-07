import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import {Button, Card} from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';

//Login in component which uses Okta to ensure user logs in before being allowed access to data
// adapted from https://developer.okta.com/blog/2018/12/20/crud-app-with-python-flask-react

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authenticated: null };
      this.checkAuthentication = this.checkAuthentication.bind(this);
      this.login = this.login.bind(this);
    }
    // Method to check if user is authenticated
    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }
   
    //check authentication when page loaded
    async componentDidMount() {
      this.checkAuthentication()
    }
   
    async login(e) {
      this.props.auth.login('/home');
    }
   
    render() {
      if (this.state.authenticated) {
        return <Redirect to='/home'/>
      } else {
        return (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Card bg="light" onClick={this.login}>  
                <Card.Title>Login with OKTA</Card.Title>        
                <Card.Body>
                    <Card.Img src={require("../Images/login.png")} height="275"/>
                </Card.Body>
                </Card>
          </div>
        )
      }
    }
   }
   
   export default withAuth(Login);