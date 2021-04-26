

export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/getSingleUser/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of read method

export const update = (userId, token, user) => {
    console.log(user);
    return fetch(`${process.env.REACT_APP_API_URL}/updateUser/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user  //form is already key value pair, no need to json stringify

    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of update method


export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/getAllUsers`, {
        method: "GET",
        //we don't need headers or authorization as anyone can see all users' profile
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
};

//apply necessary headers and params by looking at postman deleteUser back end call
export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of read method