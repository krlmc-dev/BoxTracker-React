import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import JSONTree from 'react-json-tree'
import '../Menu.css';

const JSONtheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}
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
    return (
        <div align='center'>
        <div className="Menu">
            <header className="Menu-header">
            <h1>Box Tracker</h1>
            <p>View Jobs</p>
          </header>
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
