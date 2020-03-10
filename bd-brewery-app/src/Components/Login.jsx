import React from 'react';
import { Redirect } from 'react-router';
import {Image} from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';
import '../index.css';


//Login in component which uses Okta to ensure user logs in before being allowed access to data
// adapted from https://developer.okta.com/blog/2018/12/20/crud-app-with-python-flask-react
class Login extends React.Component {
    //setup constructor
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

    //function to set login route
    async login(e) {
      this.props.auth.login('/home');
    }
    //elements to display to user
    render() {
      if (this.state.authenticated) {
        return <Redirect to='/home'/>
      } else {
        return (
          <div>
            <h2 style={{color: "white"}}>Login with OKTA</h2>
            <Image bg="light" onClick={this.login} src={require("../Images/okta.png")} height="275"></Image>
            <h2 style={{color: "white"}}>Press above logo to login</h2>
          </div>
        )
      }
    }
   }
   //Export component for use
   export default withAuth(Login);