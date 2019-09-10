import React from 'react';
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
    return (
      <div>
        <div className="Menu">
          <header className="Menu-header">
            <h1>Box Tracker</h1>
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
