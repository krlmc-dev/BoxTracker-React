import TextField from '@material-ui/core/TextField';
import React from 'react';
import ReactTable from 'react-table';
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import "react-table/react-table.css";
import '../customers.css';
import '../Menu.css';
import ContinueDialogue from './ContinueDialogue';



class ScanBarcode extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          box: [],
          boxes: [],
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
    //ReactDOM.findDOMNode(this.refs.divFocus).focus();
    //this.getBoxes()
  }

  componentDidUpdate()
  {
    const {go, box, show, isShown} = this.state
    if(go){this.goStep()}
    if(isShown && !show){
      this.setState({
        isShown:false,
        box: []
      })
    }
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

    handleSubmit(e) {
      this.getBox(this.state.value)
      this.setState({
        value: "",
        go: true
      })
      e.preventDefault();
    }
    
  goStep()
  {
    const {box, show, isShown} = this.state
    box.map((data, i) => {
      let step = data.box_step
      //if current workstation = the step the box is up to, continue
      if(localStorage.getItem("Workstation")==step){
        var path = "/box/"+data.box_id+"/"+step
        this.props.history.push(path);
      }
      else
      {
        if(!isShown){this.setState({show:true, isShown:true})}
      }
    })
  }

  render(){
    const { show, isShown, box, boxes, boxID} = this.state
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
        
        <div className="Menu">
          {show && <ContinueDialogue onClick={(e)=>{
            this.setState({show:false})
              alert(e.currentTarget.id)
          }}/>}
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
            <p>Scan Barcode</p>
          </header>
          <form onSubmit={this.handleSubmit}>
           <br/>
           <label for="barcode-input">Barcode</label>
            <TextField autoFocus  value={this.state.value} onChange={this.handleChange} />
          </form>
          <ReactTable
          getTrGroupProps={(state, rowInfo) => {
            if (rowInfo !== undefined) {
              return {
                  onClick: () => {
                    var path = "/dashboard/"+rowInfo.row.box_id
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
          data={boxes}
          columns={[
            {
              Header: "Box",
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
              this.setState({
                  box : response
              })
            }
            return response;
        });
}

getBoxes()
{
    //alert(boxID)
    //boxID = 6
    var path = "http://localhost:52773/BoxTracker/boxes"
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
                  boxes : response
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
  

export default ScanBarcode;
