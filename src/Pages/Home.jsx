import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { NavLink } from 'react-router-dom';
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
    const classes = makeStyles(theme => ({
      formControl: {
        margin: theme.spacing(3),
      },
    }));
    return (
      <div>
        <div className="Menu">
          <header className="Menu-header">
            <h1>Box Tracker</h1>
            <p>Welcome, {localStorage.getItem("operator_name")}</p>
          </header>
            <div>
            <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Current Workstation</FormLabel>
        <RadioGroup aria-label="workstations" name="workstations" value={localStorage.getItem("Workstation")} onChange={this.handleChange}>
          <FormControlLabel
            value="Preparation"
            control={<Radio color="primary" />}
            label="Preparation"
            labelPlacement="start"
          />
          <FormControlLabel
            value="Scanning"
            control={<Radio color="primary" />}
            label="Scanning"
            labelPlacement="start"
          />
          <FormControlLabel
            value="Quality Control"
            control={<Radio color="primary" />}
            label="Quality Control"
            labelPlacement="start"
          />
          <FormControlLabel
            value="Dispatch"
            control={<Radio color="primary" />}
            label="Dispatch"
            labelPlacement="start"
          />
        </RadioGroup>
      </FormControl>
                <br/>
                <br/>
                <p>Preview Pages</p>
                <ul className>
                    <li><NavLink to='/box/1/preparation'>Preparation</NavLink></li>
                    <li><NavLink to='/box/1/scanning'>Scanning</NavLink></li>
                    <li><NavLink to='/box/1/Quality Control'>Quality Control</NavLink></li>
                    <li><NavLink to='/box/1/dispatch'>Dispatch</NavLink></li>
                    
                </ul>
            </div>
        </div>
      </div>
      );
    }
  }
  

export default Home;
