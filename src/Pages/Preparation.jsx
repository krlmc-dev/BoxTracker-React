import React from 'react';
import ReactTable from 'react-table';
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import "react-table/react-table.css";
import '../customers.css';
import '../Menu.css';
import ConfirmDialogue from './ConfirmDialogue';

class Preparation extends React.Component{
  constructor(props)
  {
      super(props);
      this.params = {};
      this.state = {
          user: {},
          box: [],
          boxID: "",
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
        this.setState({boxID: data.box_id})
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

    const { ...rest } = this.props;
    return (
        
        <div className="MenuPrep">
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
          defaultPageSize={8}
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
        body: JSON.stringify({'box_id': this.state.boxID, 'task_action': "Completed", 'box_location': "Workstation", "box_operator": localStorage.getItem("operator_id"), "box_step":"Scanning"})
        };
    return fetch(path, requestOptions)
    .then(this.handleResponse).then(response => {
            if(response)
            {   
              alert("Completed")
              var path = "/box"
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
