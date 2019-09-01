import React from 'react';

//import userService from '../Services/userService';
import '../App.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      submitted: false,
      loading: false,
      error: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
}

handleSubmit(e)
{
  e.preventDefault();
  this.setState({ submitted: true });
  const { username, password, returnUrl } = this.state;
  
  // stop here if form is invalid
  if (!(username && password))
  {
    
    return;
  }
  
  this.setState({ loading: true });
  this.login(username, password)
  .then
  (
    
    user =>
      {
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        this.props.history.push(from);
        
      },
      error => this.setState({ error, loading: false })
    );
}

  render()
  {
    const { username, password, submitted, loading, error } = this.state;
    return (
      <div className="App">
        <header className="App-header">
        <h1>Box Tracker Login</h1>        
        <form name="form" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={this.handleChange} />
          </div>
          <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={this.handleChange} />
          </div>
          <div className="form-group">
              <button className="btn btn-primary" disabled={loading}>Login</button>
              {loading &&
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              }
          </div>
          </form>
        </header>
      </div>
    );
  }

  login(username, password) {
    //alert("Start login method")

    const requestOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            },
        body: JSON.stringify({'username': username, 'password': password})
        };
    return fetch("http://localhost:52773/BoxTracker/login", requestOptions)
        .then(this.handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                //alert(JSON.stringify(user))
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('operator_id', user.user_id);
                localStorage.setItem('operator_name', user.user_name);
                //alert("Logged In!")
            }

            return user;
        });
}

logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('operator_id');
}

handleResponse(response) {
    //alert("Response")
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            //alert("test")
            if (response.status === 401) {
                //alert("not OK, 401")
                // auto logout if 401 response returned from api
                this.logout();
                this.props.history.push('/login');
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

}

  export default LoginForm;