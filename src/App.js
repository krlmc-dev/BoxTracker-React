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
import TaskList from './Pages/TaskList';
import Task from './Pages/Task';
import Preparation from './Pages/Preparation';
import Scanning from './Pages/Scanning';
import QualityControl from './Pages/QualityControl';
import Dispatch from './Pages/Dispatch';
import Dashboard from './Pages/Dashboard';
import ViewBox from './Pages/ViewBox';

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
            <div >
            <HashRouter>
                {/*
                <ul className = "header">
                    <li><NavLink exact to='/'>Home</NavLink></li>
                    <li><NavLink to='/box'>Box</NavLink></li>
                    <li><NavLink to='/addcustomer'>Add Customer</NavLink></li>
                    <li><NavLink to='/customers'>View Customers</NavLink></li>
                    <li><NavLink to='/jobs'>View Jobs</NavLink></li>
                    <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
                    <li><NavLink to='/logout'>Log Out</NavLink></li>
                </ul>
                */}
                <div>
                        <PrivateRoute exact path="/" component={Home} />
                        <Route path="/login" component={LoginForm} />
                        <Route path="/logout" component={LoggedOut} />                        
                        <PrivateRoute path="/addCustomer" component={AddCustomer} />
                        <PrivateRoute path="/customers" component={ViewCustomers} />
                        <PrivateRoute path="/jobs" component={ViewJobs}/>
                        <PrivateRoute path="/addJob/:id" component={AddJob} />
                        <PrivateRoute path="/customer/:id" component={ViewCustomer} />
                        <PrivateRoute path="/job/:id" component={ViewJob} />
                        <PrivateRoute exact path="/box" component={ScanBarcode} />
                        <PrivateRoute path="/tasks" component={TaskList}/>
                        <PrivateRoute path="/task/:id" component={Task}/>
                        <PrivateRoute exact path="/box/:id/preparation" component={Preparation}/>
                        <PrivateRoute exact path="/box/:id/scanning" component={Scanning}/>
                        <PrivateRoute exact path="/box/:id/Quality Control" component={QualityControl}/>
                        <PrivateRoute exact path="/box/:id/dispatch" component={Dispatch}/>
                        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                        <PrivateRoute exact path="/dashboard/:id" component={ViewBox}/>
                        
                </div>
            </HashRouter>
            </div>
            
        );
    }
}

export default App ;