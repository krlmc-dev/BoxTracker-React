//core React imports
import React, { PureComponent } from 'react';
import ReactTable from 'react-table';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
//@material-react imports
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
//App imports
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import ContinueDialogue from './ContinueDialogue';
//css imports
import "react-table/react-table.css";
import '../customers.css';
import '../Menu.css';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  }
}))

export default class Dashboard extends React.Component {
  constructor(props) {

    super(props);
    this.params = {};
    this.state = {
      user: {},
      boxes: [],
      avg: [],
      stepNums: [],
      stepTimes: [],
      loading: false,
      go: false,
      show: false,
      isShown: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  componentDidMount() {
    //ReactDOM.findDOMNode(this.refs.divFocus).focus();
    this.getBox()
    this.getAvg()
  }

  componentDidUpdate() {
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    this.setState({
      value: "",
      go: true
    })
    e.preventDefault();
  }

  render() {
    const { show, isShown, boxes, avg, stepNums, stepTimes, boxID } = this.state
    const colors = []
    const style = {
      top: 0,
      left: 350,
      lineHeight: '24px',
    };
    var menuStyle = {
      margin: 'auto',
      padding: 40,
      // width: 700,
      height: 400,
      overflow: 'auto',
    };
    var customerStyle = {
      margin: 'auto',
      padding: 20,
      overflow: 'auto',
    };
    const { ...rest } = this.props;
    return (
      <div classname={useStyles.root}>
        <div className="Menu">
          {show && <ContinueDialogue onClick={(e) => {
            this.setState({ show: false })
            alert(e.currentTarget.id)
          }} />}
          <Header
            absolute
            fixed
            color="dark"
            brand="Box Tracker"
            rightLinks={<HeaderLinks />}
            {...rest}
          />
          <Toolbar />
          <header className="Menu-header">Dashboard</header>
          <h2>Average Job Completion Time: 
            {avg.map((data, i) => {
              return (
                <div>
                  {data.average_job_length}
                </div>
              )
            })
            }
            </h2>
          <Paper className={useStyles.paper}>
            <Grid container justify={"center"}>
              <Grid>
                <h2>Boxes At Each Workstation</h2>
                <BarChart
                  width={500}
                  height={300}
                  data={[stepNums[4], stepNums[5], stepNums[6], stepNums[7]]}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Number of Boxes">
                    {
                      
                      colors[0] = "#2b9900",
                      colors[1] = "#006399",
                      colors[2] = "#e59400",
                      colors[3] = "#f00",
                      stepNums.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]}  strokeWidth={index === 2 ? 4 : 1}/>
                      ))
                    }
                  </Bar>
                </BarChart>
              </Grid>
              <Grid item>
                <h2>Average Time Per Step</h2>
                <p>Preparation: {stepTimes.map((data, i) => {return (<div>{data.Preparation}</div>)})}</p>
                <p>Scanning: {stepTimes.map((data, i) => {return (<div>{data.Scan}</div>)})}</p>
                <p>Quality Control: {stepTimes.map((data, i) => {return (<div>{data.Quality_Control}</div>)})}</p>
                <p>Dispatch: {stepTimes.map((data, i) => {return (<div>{data.Dispatch}</div>)})}</p>
              </Grid>
            </Grid>
          </Paper>
          
        </div>
      </div>
    );
  }
  ///
  /// HTTP GET/POST METHODS
  ///
  getBox() {
    //alert(boxID)
    //boxID = 6
    var path = "http://localhost:52773/BoxTracker/boxes"
    //TEMPORARY
    //jobID = "1"
    const requestOptions = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Basic U3VwZXJVc2VyOlBBU1M=',
      }
    };
    return fetch(path, requestOptions)
      .then(this.handleGetResponse)
      .then(response => {
        if (response) {
          //alert(JSON.stringify(response))
          this.setState({
            boxes: response
          })
        }
        return response;
      });
  }

  getAvg() {
    var path = "http://localhost:52773/BoxTracker/stats"
    const requestOptions = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Basic U3VwZXJVc2VyOlBBU1M=',
      }
    };
    return fetch(path, requestOptions)
      .then(this.handleGetResponse)
      .then(response => {
        if (response) {
          this.setState({
            avg: response,
            stepNums: response[1],
            stepTimes: response[2]
          })
        }
        return response;
      });
  }

  handleResponse(response) {

    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if (response.status === 401) {
          alert("not OK, 401")
          // auto logout if 401 response returned from api
          Location.reload(true);
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  }

  handleGetResponse(response) {

    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  }
}