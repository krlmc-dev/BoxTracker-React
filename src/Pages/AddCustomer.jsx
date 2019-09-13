import React from 'react';
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import '../index.css';
import '../Menu.css';

class AddCustomer extends React.Component{
  constructor(props)
  {

      super(props);
      this.params = {};
      this.state = {
          user: {},
          customer_name: '',
          customer_email:'',
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
        const { customer_name,customer_email, returnUrl } = this.state;
  
        // stop here if form is invalid
        if (!(customer_name))
        {
            return;
        }
  
        this.setState({ loading: true });
        this.addCustomer(customer_name, customer_email)
        .then(
            response => {
                this.setState({loading: false});
            },
            error => this.setState({ error, loading: false })
        );
        this.props.history.push('/customers');
    }
  
  render(){
    const { user, customer_name,customer_email, submitted, loading } = this.state;
    const { ...rest } = this.props;
    return (
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
            <p>Add New Customer</p>
          </header>
          <div className="content">
          <form name="form" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !customer_name ? ' has-error' : '')}>
              <label htmlFor="customer_name">Customer Name:</label>
              <input
                type="text"
                className="form-control"
                name="customer_name"
                value={customer_name}
                onChange={this.handleChange} />
          </div>
          <div className={'form-group' + (submitted && !customer_name ? ' has-error' : '')}>
              <label htmlFor="customer_email">Customer Email:</label>
              <input
                type="text"
                className="form-control"
                name="customer_email"
                value={customer_email}
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

    addCustomer(customer_name, customer_email)
    {
        const requestOptions = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
                },
            body: JSON.stringify({'customer_name': customer_name, 'customer_email': customer_email})
            };
        return fetch("http://localhost:52773/BoxTracker/customers", requestOptions)
        .then(this.handleResponse).then(response => {
                if(response)
                {   
                    alert("Customer Successfully Created")
                }
                return response;
            }
        )
            
    }
  }
  

export default AddCustomer;
