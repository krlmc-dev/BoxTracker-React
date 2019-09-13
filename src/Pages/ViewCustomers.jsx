import React from 'react';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Header from "./../Components/Headers/Header";
import HeaderLinks from "./../Components/Headers/HeaderLinks";
import Toolbar from "@material-ui/core/Toolbar";
import '../customers.css';
import '../index.css';
import '../Menu.css';

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

class ViewCustomers extends React.Component{
  constructor(props)
  {
      
      super(props);
      this.params = {};
      this.state = {
          user: {},
          customers: [],
          loading: false,
          
      };
    

    this.handleChange = this.handleChange.bind(this);

  }
  componentWillMount()
  {
    this.getCustomers()
  }

    handleChange(e) 
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

  render(){
    const {  customers } = this.state
    const { ...rest } = this.props;
    return (
        
        <div className="Menu">
            <Header
                absolute
                fixed
                color="dark"
                brand="Box Tracker"
                rightLinks={<HeaderLinks />}
                {...rest}
            />
            <Toolbar/>
        <div className="Menu-header">
          <p>View Customers</p>
        </div>
          <ReactTable

        getTrGroupProps={(state, rowInfo) => {
        if (rowInfo !== undefined) {
          return {
              onClick: () => {
                var path = "/customer/"+rowInfo.row.customer_id
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

          data={customers}
          columns={[
            {
              Header: "Customer ID",
              accessor: "customer_id"
            },
            {
              Header: "Customer Name",
              accessor:"customer_name"
            }
          ]}
          filterable
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

    getCustomers()
{
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch("http://localhost:52773/BoxTracker/customers", requestOptions)
        .then(this.handleGetResponse)
        .then(response => {
            if (response) {
                this.setState({customers: response});
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
  

export default ViewCustomers;
