import React from 'react';
import ReactDOM from 'react-dom';
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

class ViewJob extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          customer: [],
          customerJobs: [],
          job: [],
          jobDetails: [],
          loading: false
      };
    this.handleChange = this.handleChange.bind(this);

  }
  componentDidMount()
  {
    this.getJobByID(this.props.location.pathname)
  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    

  render(){
    const { job, jobDetails} = this.state
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
              {jobDetails.map((data, i) => {
                  return (
                    <table align='center'>
                        <tr key={i}>
                          <td className='link'>Job ID: {data.job_id}</td>
                          <td className='link'>Customer: {data.customer_name}</td>
                          <td className='link'>Number of Boxes: {data.job_numboxes}</td>
                          <td className='link'>State: {data.job_state}</td>
                          <td className='link'>Dispatch: {data.job_dispatch}</td>
                        </tr>
                    </table>
                  )})
                  }
              </div>
          </header>
          
          <ReactTable
          data={job}
          columns={[
            {
              Header: "Job",
              columns: [
                {
                  Header: "Box ID",
                  accessor: "box_id"
                },
                {
                  Header: "Location",
                  accessor: "box_location"
                },
                {
                  Header: "Step",
                  accessor: "box_step"
                }
              ]
            }
          ]}
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
getJobByID(jobID)
{
    var path = "http://localhost:52773/BoxTracker"+jobID
    //TEMPORARY
    //jobID = "1"
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
              let jobReturn = JSON.parse(JSON.stringify(response))
              let JDetails = []
              JDetails[0]=jobReturn[0]
              //</header>alert(JSON.stringify(jobReturn[1]))
              this.setState({
                  jobDetails: JDetails,
                  job : jobReturn[1]
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
  

export default ViewJob;
