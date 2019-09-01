import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from "react-router";
import jobService from '../Services/jobService';
import PropTypes from 'prop-types';
import '../Menu.css';
import '../index.css'

const propTypes ={
  location: PropTypes.object.isRequired
}
class AddJob extends React.Component{
 
  constructor(props)
  {
      super(props);
      
      this.params = {};
      this.state = {
          
          user: {},
          customer_name: '',
          numBoxes:'',
          jobLocation:'',
          submitted: false,
          loading: false
      };
    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e)
    {
        e.preventDefault();
        this.setState({ submitted: true });
        const { customer_id, numBoxes, jobLocation, returnUrl } = this.state;
  
        // stop here if form is invalid
        if (!(numBoxes))
        {
            return;
        }
        this.setState({ loading: true });
        
        this.addJob(this.props.match.params.id, numBoxes, jobLocation)
        .then(
            response => {
                this.setState({loading: false});
            },
            error => this.setState({ error, loading: false })
        );
        var path = "/customer/"+this.props.match.params.id
        this.props.history.push(path);
    }
  
  render(){
    var path = "/customer/"+this.props.match.params.id
    const { user, customerID, numBoxes, jobLocation, submitted, loading } = this.state;
    return (
        
        <div className="Menu">
          <header className="Menu-header">
            <h1>Box Tracker</h1>
            <h2>{localStorage.getItem('customer_name') }
            </h2>
            <p>Add New Job</p>
          </header>
          <div className="content">
          <form name="form" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !customerID ? ' has-error' : '')}>
              <label htmlFor="numBoxes">Number of Boxes:</label>
              <input
                type="text"
                className="form-control"
                name="numBoxes"
                value={numBoxes}
                onChange={this.handleChange} />
          </div>
          <div className={'form-group' + (submitted && !customerID ? ' has-error' : '')}>
              <label htmlFor="jobLocation">Location:</label>
              <input
                type="text"
                className="form-control"
                name="jobLocation"
                value={jobLocation}
                onChange={this.handleChange} />
          </div>
          <div className="form-group">
              <button className="btn btn-primary" disabled={loading}>Create</button>
              {loading &&
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              }
          </div>
          </form>
          </div>
          
        </div>
      );
    }

    addJob(customer_id, job_numboxes, job_location)
    {
      var path = "http://localhost:52773/BoxTracker/jobs"
        const requestOptions = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
                },
            body: JSON.stringify({'customer_id': customer_id, 'job_numboxes': job_numboxes, 'job_location': job_location, 'operator_id':localStorage.getItem("operator_id")})
            };
        return fetch(path, requestOptions)
        .then(this.handleResponse).then(response => {
                if(response)
                {   
                    alert("Job Successfully Created")
                }
                return response;
            }
        )
            
    }
  }
  

export default AddJob;
