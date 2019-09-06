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
import Task from './Pages/Task';
import Preparation from './Pages/Preparation';
import Scanning from './Pages/Scanning';
import QualityControl from './Pages/QualityControl';
import Dispatch from './Pages/Dispatch';

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
                <ul className = "header">
                    <li><NavLink exact to='/'>Home</NavLink></li>
                    <li><NavLink to='/tasks'>Tasks</NavLink></li>
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
                        <PrivateRoute path="/addCustomer" component={AddCustomer} />
                        <PrivateRoute path="/customers" component={ViewCustomers} />
                        <PrivateRoute path="/jobs" component={ViewJobs}/>
                        <PrivateRoute path="/addJob/:id" component={AddJob} />
                        <PrivateRoute path="/customer/:id" component={ViewCustomer} />
                        <PrivateRoute path="/job/:id" component={ViewJob} />
                        <PrivateRoute path="/boxes" component={ScanBarcode} />
                        <PrivateRoute exact path="/box/:id" component={EditBox}/>
                        <PrivateRoute path="/tasks" component={TaskList}/>
                        <PrivateRoute path="/task/:id" component={Task}/>
                        <PrivateRoute path="/box/:id/preparation" component={Preparation}/>
                        <PrivateRoute path="/box/:id/scanning" component={Scanning}/>
                        <PrivateRoute path="/box/:id/Quality Control" component={QualityControl}/>
                        <PrivateRoute path="/box/:id/dispatch" component={Dispatch}/>
                        
                </div>
            </HashRouter>
            </div>
            
        );
    }
}

export default App ;