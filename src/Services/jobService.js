export const jobService = {
    //addJob,
    getJobs,
    getJobByID
}

function getJobs()
{
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch("http://localhost:52773/csp/BoxTracker/jobs", requestOptions)
        .then(handleGetResponse)
        .then(response => {
            if (response) {
                localStorage.setItem('jobs', JSON.stringify(response));
            }
            return response;
        });
}

function getJobByID(jobID)
{
    //TEMPORARY
    jobID = "1"
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization':'Basic U3VwZXJVc2VyOlBBU1M=',
            }
        };
    return fetch("http://localhost:52773/csp/BoxTracker/job/",{jobID}, requestOptions)
        .then(handleGetResponse)
        .then(response => {
            if (response) {
                localStorage.setItem('job', JSON.stringify(response));
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
export default jobService;