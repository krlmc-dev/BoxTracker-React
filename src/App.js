import React from 'react';
import { Route, NavLink, HashRouter} from 'react-router-dom';
import PrivateRoute from './PrivateRoute'

import Home from './Pages/Home';
import AddCustomer from './Pages/AddCustomer';
import ViewCustomers from './Pages/ViewCustomers';
import ViewCustomer from './Pages/ViewCustomer';
import AddJob from './Pages/AddJob';
import ViewJob from './Pages/ViewJob';
import ViewJobs from './Pages/ViewJobs';
import LoginForm from './Pages/LoginForm';
import LoggedOut from './Pages/LoggedOut';
import ScanBarcode from './Pages/ScanBarcode';
import EditBox from './Pages/EditBox';
import TaskList from './Pages/TaskList';

import "./index.css";

class App extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user: {}
        };
    }
    render() {
        
        return (
            <HashRouter>
                <ul className = "header">
                    <li><NavLink exact to='/'>Home</NavLink></li>
                    <li><NavLink to='/boxes'>Box</NavLink></li>
                    <li><NavLink to='/addcustomer'>Add Customer</NavLink></li>
                    <li><NavLink to='/customers'>View Customers</NavLink></li>
                    <li><NavLink to='/jobs'>View Jobs</NavLink></li>
                    <li><NavLink to='/logout'>Log Out</NavLink></li>
                </ul>
                <div align='center'>{localStorage.getItem("operator_name")}</div>
                <div>
                        <PrivateRoute exact path="/" component={Home} />
                        <Route path="/login" component={LoginForm} />
                        <Route path="/logout" component={LoggedOut} />                        
                        <PrivateRoute path="/addcustomer" component={AddCustomer} />
                        <PrivateRoute path="/customers" component={ViewCustomers} />
                        <PrivateRoute path="/jobs" component={ViewJobs}/>
                        <PrivateRoute path="/addjob/:id" component={AddJob} />
                        <PrivateRoute path="/customer/:id" component={ViewCustomer} />
                        <PrivateRoute path="/job/:id" component={ViewJob} />
                        <PrivateRoute path="/boxes" component={ScanBarcode} />
                        <PrivateRoute path="/box/:id" component={EditBox}/>
                        <PrivateRoute path="/tasks" component={TaskList}/>
                        
                </div>
            </HashRouter>
            
        );
    }
}

export default App ;