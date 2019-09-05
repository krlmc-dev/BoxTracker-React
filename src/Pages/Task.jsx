import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import JSONTree from 'react-json-tree'
import '../Menu.css';
import '../customers.css';
import '../index.css';

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

class Task extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          task: [],
          loading: false,
          
      };
    

    this.handleChange = this.handleChange.bind(this);

  }
  componentWillMount()
  {
    this.getTask(this.props.match.params.id)
  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

  render(){
    const {  task } = this.state
    return (
        
        <div className="Menu">
            <header className="Menu-header">
            <h1>Box Tracker</h1>
            <p>View Tasks</p>
          </header>
          <ReactTable

          data={task}
          columns={[
            {
              Header: "Task ID",
              accessor: "id"
            },
            {
              Header: "Priority",
              accessor:"priority"
            },
            {
              Header: "Box Number",
              accessor:"subject"
            },
            {
              Header: "Task Description",
              accessor:"message"
            },
            {
              Header: "Time Created",
              accessor:"timeCreated"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        >
           {(state, makeTable) => {
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

    getTask(taskID)
{
    var path = "http://localhost:52773/BoxTracker/task/"+taskID
    //alert(path)
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
                this.setState({task: response});
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
  

export default Task;
