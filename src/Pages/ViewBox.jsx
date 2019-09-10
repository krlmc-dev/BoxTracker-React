import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import '../customers.css';
import '../Menu.css';
import ContinueDialogue from './ContinueDialogue';



export default class Viewbox extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          box: [],
          stats: [],
          loading: false,
          go: false,
          show: false,
          isShown: false
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }
  componentDidMount()
  {
    this.getBox(this.props.match.params.id)
    this.getStats(this.props.match.params.id)
  }

  componentDidUpdate()
  {
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

    handleSubmit(e) {
      this.setState({
        value: "",
        go: true
      })
      e.preventDefault();
    }

  render(){
    const { show, isShown, box, stats, boxID} = this.state
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
          {show && <ContinueDialogue onClick={(e)=>{
            this.setState({show:false})
              alert(e.currentTarget.id)
          }}/>}
            <header className="Menu-header">
            <h1>Box Tracker</h1>
          </header>
          <ReactTable
          data={box}
          columns={[
            {
              Header: "",
              columns: [
                {
                  Header: "Box ID",
                  accessor: "box_id"
                },
                {
                  Header: "Job ID",
                  accessor: "job_id"
                },
                {
                  Header: "Customer",
                  accessor: "customer_name"
                },
                {
                  Header: "Location",
                  accessor: "box_location"
                },
                {
                  Header: "Operator",
                  accessor: "box_operator"
                },
                {
                  Header: "Step",
                  accessor: "box_step"
                },
                {
                  Header: "State",
                  accessor: "box_state"
                },
                {
                  Header: "Dispatch",
                  accessor: "job_dispatch"
                }
              ]
            }
          ]}
          defaultPageSize={1}
          showPagination = {false}
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

          <ReactTable
          data={stats}
          columns={[
            {
              Header: "Statistics",
              columns: [
                {
                  Header: "Step Name",
                  accessor: "step_name"
                },
                {
                  Header: "Step Operator",
                  accessor: "step_operator"
                },
                {
                  Header: "Step Start Time",
                  accessor: "step_start_time"
                },
                {
                  Header: "Step Finish Time",
                  accessor: "step_finish_time"
                },
                {
                  Header: "Step Duration",
                  accessor: "step_duration"
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
getBox(boxID)
{
    //alert(boxID)
    //boxID = 6
    var path = "http://localhost:52773/BoxTracker/boxes/"+boxID
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
              //alert(JSON.stringify(response))
              this.setState({
                  box : response
              })
            }
            return response;
        });
}

getStats(boxID)
{
    var path = "http://localhost:52773/BoxTracker/boxes/stats/"+boxID
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
              this.setState({
                  stats : response
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