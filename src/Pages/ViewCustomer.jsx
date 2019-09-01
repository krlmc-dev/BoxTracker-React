import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, HashRouter} from 'react-router-dom';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import JSONTree from 'react-json-tree'
import '../Menu.css';
import '../customers.css';

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

class ViewCustomer extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          customer: [],
          customerJobs: [],
          jobs: [],
          loading: false
      };
    this.handleChange = this.handleChange.bind(this);

  }
  componentDidMount()
  {
    this.getCustomerByID(this.props.location.pathname)
  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    

  render(){
    const { customer, customerJobs } = this.state
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
    
    return (
        
        <div className="Menu">
            <header className="Menu-header">
            <h1>Box Tracker</h1>
            <div className = 'content'>
              {customer.map((data, i) => {
                  return (
                    <div>
                    <table align='center'>
                        <tr key={i}>
                          <td className='link'>Customer ID: {data.customer_id}</td>
                          <td className='link'>Name: {data.customer_name}</td>
                          <td className='link'>Email: {data.customer_email}</td>
                        </tr>
                    </table>
                    <button button onClick={() => {
                      var path = "/addjob/"+data.customer_id
                      localStorage.setItem('customer_name', data.customer_name)
                      this.props.history.push(path)}}>Add Job</button>
                    </div>
                  )})
                  }
              </div>
          </header>
          

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
          data={customerJobs}
          columns={[
            {
              Header: "Jobs",
              columns: [
                {
                  Header: "Job ID",
                  accessor: "job_id"
                },
                {
                  Header: "Number of Boxes",
                  accessor: "job_numboxes"
                }
              ]
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
///
/// HTTP GET/POST METHODS
///
getCustomerByID(customerID)
{
    var path = "http://localhost:52773/BoxTracker"+customerID
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    
    return fetch(path, requestOptions)
        .then(this.handleGetResponse)
        .then(response => {
            if (response) {
              //alert(JSON.stringify(response))

              let CustomerReturn = JSON.parse(JSON.stringify(response))
              let CDetails = []
              CDetails[0]=CustomerReturn[0]
              this.setState({
                  customer: CDetails,
                  customerJobs: CustomerReturn[1]
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
  

export default ViewCustomer;
