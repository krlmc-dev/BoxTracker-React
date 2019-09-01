export const customerService = {
    addCustomer,
    getCustomers,
    getCustomerByID
}

function addCustomer(customer_name)
{
    const requestOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            },
        body: JSON.stringify({'customer_name': customer_name})
        };
    return fetch("http://localhost:52773/csp/BoxTracker/customers", requestOptions)
    .then(handleResponse).then(response => {
            if(response)
            {   
                alert("Customer Successfully Created")
            }
            return response;
        }
    )
        
}

function getCustomers()
{
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch("http://localhost:52773/csp/BoxTracker/customers", requestOptions)
        .then(handleGetResponse)
        .then(response => {
            if (response) {
                localStorage.setItem('customers', JSON.stringify(response));
            }
            return response;
        });
}

function getCustomerByID(customerID)
{
    var path = "http://localhost:52773/csp/BoxTracker"+customerID
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch(path, requestOptions)
        .then(handleGetResponse)
        .then(response => {
            if (response) {
                let CustomerReturn = JSON.parse(JSON.stringify(response))
                let CustomerDetails = JSON.stringify(CustomerReturn[0])
                let CustomerJobs = JSON.stringify(CustomerReturn[1])
                
                localStorage.setItem('customer', CustomerDetails);
                localStorage.setItem('customerJobs', CustomerJobs)
            }
            return response;
        });
}

function handleResponse(response) {
    
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

function handleGetResponse(response) {
    
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
export default customerService;