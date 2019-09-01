import React from 'react';
import ReactDOM from 'react-dom';
import AddCustomer from './AddCustomer'
import ViewCustomers from './ViewCustomers'
import ViewJobs from './ViewJobs';
import Menu, { Item } from 'rc-menu'
import '../Menu.css';

class Home extends React.Component{
  constructor(props)
  {
      super(props);
      this.state = {
          user: {}
      };
  }

  render(){
    
    const { user } = this.state;
    return (
      <div>
        <div className="Menu">
          <header className="Menu-header">
            <h1>Box Tracker</h1>
            <p>Welcome, {localStorage.getItem("operator_name")}</p>
          </header>
            <div>
                Home Page
            </div>
        </div>
      </div>
      );
    }
  }
  

export default Home;
