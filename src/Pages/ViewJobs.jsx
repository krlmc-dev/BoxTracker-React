import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import '../Menu.css';

class ViewJobs extends React.Component{
  
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          jobs: [],
          loading: false
      };
    

    this.handleChange = this.handleChange.bind(this);

  }
  componentWillMount()
  {
    this.getJobs()
  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    

  render(){
    var tableWidth = '450'
    var cellWidth = '150'
    const {jobs} = this.state
    var menuStyle = {
      margin: 'auto',
      padding: 50,
     // width: 700,
      height: 400,
      overflow: 'auto',
    };
    const { ...rest } = this.props;
    return (
        <div align='center'>
        <div className="Menu">
        <Header
                absolute
                fixed
                color="dark"
                brand="Box Tracker"
                rightLinks={<HeaderLinks />}
                {...rest}
            />
        </div>
        <Toolbar />
        <div className="Menu-header">
          <p>View Jobs</p>
        </div>
          <ReactTable
          getTrGroupProps={(state, rowInfo) => {
            if (rowInfo !== undefined) {
              return {
                  onClick: () => {
                    var path = "/job/"+rowInfo.row.job_id
                    this.props.history.push(path);
                  },
                  style: {
                      cursor: 'pointer',
                      background: rowInfo.original.id === this.state.selectedIndex ? '#00afec' : 'white',
                      color: rowInfo.original.id === this.state.selectedIndex ? 'white' : 'black'
                              }
                          }
                    }}
                }
          data={jobs}
          columns={[
            {
              Header: "Job ID",
              accessor: "job_id"
            },
            {
              Header: "Customer Name",
              accessor:"customer_name"
            },
            {
              Header: "Number of Boxes",
              accessor:"job_numboxes"
            }
          ]}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        >
           {(state, makeTable, instance) => {
              return (
                <div>
                  {makeTable()}
                </div>
              )
            }}
          </ReactTable>
        </div>
      );
    }

  getJobs()
  {
      const requestOptions = {
          method: 'GET',
          headers: {
              'content-type': 'application/json',
              'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
              }
          };
      return fetch("http://localhost:52773/BoxTracker/jobs", requestOptions)
          .then(this.handleGetResponse)
          .then(response => {
              if (response) {
                  this.setState({
                    jobs: response
                  })
              }
              return response;
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
  

export default ViewJobs;
