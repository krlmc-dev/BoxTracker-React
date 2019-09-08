export const userService = {
    login,
    logout
};

function login(username, password) {
    //alert("Start login method")

    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch("http://localhost:52773/csp/BoxTracker/jobs", requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                alert(JSON.stringify(user))
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
                //alert("Logged In!")
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('operator_name');
    localStorage.removeItem('Workstation');
}

function handleResponse(response) {
    alert("Response")
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            //alert("test")
            if (response.status === 401) {
                //alert("not OK, 401")
                // auto logout if 401 response returned from api
                logout();
                this.props.history.push('/login');
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
export default userService;
