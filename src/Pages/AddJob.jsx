import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import '../index.css';
import '../Menu.css';

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));
class AddJob extends React.Component{
 
  constructor(props)
  {
      super(props);
      
      this.params = {};
      this.state = {
          
          user: {},
          customer_name: '',
          numBoxes:'',
          jobLocation:'Loading Dock',
          jobDispatch:'Archive / Storage',
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
        const { customer_id, numBoxes, jobLocation, jobDispatch, returnUrl } = this.state;
  
        // stop here if form is invalid
        if (!(numBoxes))
        {
            return;
        }
        this.setState({ loading: true });
        
        this.addJob(this.props.match.params.id, numBoxes, jobLocation, jobDispatch)
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
    const { user, customerID, numBoxes, jobLocation, jobDispatch, otherLocation, submitted, loading } = this.state;
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
            <h2>{localStorage.getItem('customer_name') }
            </h2>
            <p>Add New Job</p>
          </header>
          <div className="content">
          <form className={useStyles.root} autoComplete="off" onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !customerID ? ' has-error' : '')}>
              <label htmlFor="numBoxes">Number of Boxes:</label><br/>
              <input
                type="text"
                className="form-control"
                name="numBoxes"
                value={numBoxes}
                onChange={this.handleChange} />
          </div>
            <FormControl className={useStyles.margin}>
              <InputLabel htmlFor="location-customized-select">Location</InputLabel>
              <Select
                value={jobLocation}
                onChange={this.handleChange}
                input={<BootstrapInput name="jobLocation" id="location-customized-select" />}
              >
                <MenuItem value={"Loading Dock"}>Loading Dock</MenuItem>
                <MenuItem value={"Front Door"}>Front Door</MenuItem>
                <MenuItem value={"Staging Area"}>Staging Area</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={useStyles.margin}>
              <InputLabel htmlFor="dispatch-customized-select">Dispatch</InputLabel>
              <Select
                value={jobDispatch}
                onChange={this.handleChange}
                input={<BootstrapInput name="jobDispatch" id="dispatch-customized-select" />}
              >
                <MenuItem value={"Archive / Storage"}>Archive / Storage</MenuItem>
                <MenuItem value={"Destroy"}>Destroy</MenuItem>
              </Select>
            </FormControl>
          <div className="form-group">
              <button className="btn btn-primary">Create</button>
          </div>
          </form>
          </div>
          
        </div>
      );
    }

    addJob(customer_id, job_numboxes, job_location, job_dispatch)
    {
      var path = "http://localhost:52773/BoxTracker/jobs"
        const requestOptions = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
                },
            body: JSON.stringify({'customer_id': customer_id, 'job_numboxes': job_numboxes, 'job_location': job_location, 'operator_id':localStorage.getItem("operator_id"), 'job_dispatch': job_dispatch})
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
