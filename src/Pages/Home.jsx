import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, HashRouter} from 'react-router-dom';
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
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        localStorage.setItem("Workstation", value)
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
                <p>My Current Workstation</p><br/>
                <select workstation={localStorage.getItem("Workstation")} onChange={this.handleChange}>
                  <option Workstation="Preparation">Preparation</option>
                  <option Workstation="Scanning">Scanning</option>
                  <option Workstation="Quality Control">Quality Control</option>
                  <option Workstation="Dispatch">Dispatch</option>
                </select>
                <br/>
                <br/>
                <p>Preview Pages</p>
                <ul className>
                    <li><NavLink to='/box/7/preparation'>Preparation</NavLink></li>
                    <li><NavLink to='/box/7/scanning'>Scanning</NavLink></li>
                    <li><NavLink to='/box/7/Quality Control'>Quality Control</NavLink></li>
                    <li><NavLink to='/box/7/dispatch'>Dispatch</NavLink></li>
                    
                </ul>
            </div>
        </div>
      </div>
      );
    }
  }
  

export default Home;
