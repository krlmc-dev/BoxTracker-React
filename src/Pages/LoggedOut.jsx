import React from 'react';
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import '../Menu.css';
import userService from '../Services/userService';

class LoggedOut extends React.Component{
  constructor(props)
  {
      super(props);
      this.state = {
          user: {}
      };
  }

  render(){
    userService.logout()
    const { user } = this.state;
    const { ...rest } = this.props;
    return (
      <div>
        <div className="Menu">
        <Header
                absolute
                fixed
                color="dark"
                brand="Box Tracker"
                rightLinks={<HeaderLinks />}
                {...rest}
            />
            <Toolbar />
          <header className="Menu-header">
            <p>You are logged out.{user.Name}</p>
          </header>
            <div>
                <i>Your Company Logo Goes Here!!</i>
            </div>
        </div>
      </div>
      );
    }
  }
  

export default LoggedOut;
