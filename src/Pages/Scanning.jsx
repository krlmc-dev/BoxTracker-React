import React from 'react';
import ReactTable from 'react-table';
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import "react-table/react-table.css";
import '../customers.css';
import '../Menu.css';
import ConfirmDialogue from './ConfirmDialogue';


export default class Scanning extends React.Component{
  constructor(props)
  {
      super(props);
      this.params = {};
      this.state = {
          user: {},
          box: [],
          loading: false,
          boxID: ""
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
  }
  componentDidMount()
  {
      this.getBox(this.props.match.params.id)
     // ReactDOM.findDOMNode(this.refs.focusButton).focus();
  }

  handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
      e.preventDefault();
      
    }
    

    renderEditable(cellInfo) {
        return (
          <div
            style={{ backgroundColor: "black" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
              const box = [...this.state.box];
              box[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
              this.setState({ box });
            }}
            dangerouslySetInnerHTML={{
              __html: this.state.box[cellInfo.index][cellInfo.column.id]
            }}
          />
        );
      }
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
        <div className="MenuScan">
            <Header
                absolute
                fixed
                color="dark"
                brand="Box Tracker"
                rightLinks={<HeaderLinks />}
                {...rest}
            />
            <Toolbar />
            <div className="Menu-header">
              <p>Scanning</p>
            </div>
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
///
/// HTTP GET/POST METHODS
///
getBox(boxID)
{
    if(boxID=="$36"){boxID=6}
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
              let vBox = this.getVertical(response)
              this.setState({
                  vBox : vBox,
                  box : response
              })
            }
            return response;
        });
}

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

updateBox()
{
    const {box} = this.state
    box.map((data, i) => {
      let tBox = {
        box_location : data.box_location,
        box_step : data.box_step,
        box_state : data.box_state
      }
      alert("Box Updated: "+JSON.stringify(tBox))
    })
}
completeStep()
{
  var path = "http://localhost:52773/BoxTracker/task"
    const requestOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            },
        body: JSON.stringify({'box_id': this.state.boxID, 'task_action': "Completed", 'box_location': "Workstation", "box_operator": localStorage.getItem("operator_id"), "box_step":"Quality Control"})
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
