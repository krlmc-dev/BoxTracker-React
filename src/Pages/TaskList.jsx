import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import JSONTree from 'react-json-tree'
import '../Menu.css';
import '../customers.css';
import '../index.css';


class TaskList extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          tasks: [],
          loading: false,
          
      };
    

    this.handleChange = this.handleChange.bind(this);

  }
  componentWillMount()
  {
    this.getTasks()
  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

  render(){
    const {  tasks } = this.state
    return (
        
        <div className="Menu">
            <header className="Menu-header">
            <h1>Box Tracker</h1>
            <p>View Tasks</p>
          </header>
          <ReactTable
            getTrGroupProps={(state, rowInfo) => {
                if (rowInfo !== undefined) {
                  return {
                      onClick: () => {
                        var path = "/box/"+rowInfo.row.subject+"/"+this.parseStep(rowInfo.row.message)
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
          data={tasks}
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

    getTasks()
{
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch("http://localhost:52773/BoxTracker/tasks", requestOptions)
        .then(this.handleGetResponse)
        .then(response => {
            if (response) {
                this.setState({tasks: response});
            }
            return response;
        });
}
parseStep(msg)
{
  if(msg="Preparation"){return "preparation"}
  if(msg="Scanning"){return "scanning"}
  if(msg="Quality Control"){return "qualityControl"}
  if(msg="Dispatch"){return "dispatch"}
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
  

export default TaskList;
