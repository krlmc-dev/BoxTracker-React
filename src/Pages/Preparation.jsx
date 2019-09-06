import React from 'react';
import ReactTable from 'react-table';
import ConfirmDialogue from './ConfirmDialogue';
import "react-table/react-table.css";
import '../Menu.css';
import '../customers.css';

class Preparation extends React.Component{
  constructor(props)
  {
      super(props);
      this.params = {};
      this.state = {
          user: {},
          box: [],
          taskID: "",
          loading: false
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //called first time component loads
  componentDidMount()
  {
      this.getBox(this.props.match.params.id)
  }

  //called when input changed
  handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

  //called when input submitted
  handleSubmit(e)
  {
    e.preventDefault();
  }
  
  /*
    Used to transform JSON from a format suitable for a borizontal table
    to a format suitable for a vertical table
  */ 
  getVertical(vBox)
  {
    let newBox = []
    vBox.map((data, i) => {
        newBox = [
            {"Property": "Box ID",
             "Value": data.box_id},
             {"Property": "Job ID",
             "Value": data.job_id},
             {"Property": "Customer",
             "Value": data.customer_name},
             {"Property": "Location",
             "Value": data.box_location},
             {"Property": "Operator",
             "Value": data.box_operator},
             {"Property": "State",
             "Value": data.box_state},
             {"Property": "Step",
             "Value": data.box_step},
             {"Property": "Dispatch",
             "Value": data.job_dispatch}
        ]
    })
    return newBox
  }

  //renders component on webpage
  render(){
    const { vBox, boxID, loading} = this.state
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
        
        <div className="MenuPrep">
            <header className="Menu-header">
            <h1>Box Tracker</h1>
            <p>Preparation</p>
          </header>
          <ReactTable 
          data={vBox}
          columns={[
            {
              Header: "Box",
              columns: [
                {
                  accessor: "Property"
                },
                {
                  accessor: "Value"
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
          <div>
              <ConfirmDialogue onClick={()=>this.completeStep()}/>
          </div>
        </div>
      );
    }
/*
  HTTP GET/POST METHODS
*/

//gets a single box by box ID
getBox(boxID)
{
    if(boxID=="$36"){boxID=6}
    var path = "http://localhost:52773/BoxTracker/boxes/"+boxID
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
              let vBox = this.getVertical(response)
              this.setState({
                  vBox : vBox,
                  box : response
              })
            }
            return response;
        });
}

/*
  Called when user presses "completed", and then 'yes' on the 'Are You Sure' dialogue.
  Updates task status and box details.
*/
completeStep()
{

  var path = "http://localhost:52773/BoxTracker/task"
    const requestOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            },
        body: JSON.stringify({'task_id': this.state.taskID, 'task_action': "Completed", 'box_location': "Workstation", "box_operator": localStorage.getItem("operator_id"), "box_step":"Scanning"})
        };
    return fetch(path, requestOptions)
    .then(this.handleResponse).then(response => {
            if(response)
            {   
              alert("Completed")
              var path = "/boxes"
              this.props.history.push(path);
            }
            return response;
        }
    )
}

//handles response from POST HTTP requests
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

//handles response from GET HTTP requests
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
  

export default Preparation;
