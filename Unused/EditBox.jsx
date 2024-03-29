import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import { Route, Link, HashRouter} from 'react-router-dom';
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

class ScanBarcode extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          box: [],
          loading: false,
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
  }
  componentDidMount()
  {
      this.getBox(this.props.match.params.id)
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
    const { box, boxID, loading} = this.state
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
          </header>
          <ReactTable 
          data={box}
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
                  accessor: "box_location",
                  Cell: this.renderEditable
                  
                },
                {
                  Header: "Operator",
                  accessor: "box_operator"
                },
                {
                  Header: "Step",
                  accessor: "box_step",
                  Cell: this.renderEditable
                },
                {
                  Header: "State",
                  accessor: "box_state",
                  Cell: this.renderEditable
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
          <div>
              <button className="btn btn-primary" disabled={loading} onClick={()=>this.updateBox()}>Update</button>
              {loading &&
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
              }
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
              this.setState({
                  box : response
              })
            }
            return response;
        });
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
