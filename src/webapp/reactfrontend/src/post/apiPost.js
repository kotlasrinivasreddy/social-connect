
export const create = (userId, token, post) => {
    //See the back end api calls we have created and call them appropriately
    return fetch(`${process.env.REACT_APP_API_URL}/createPost/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post

    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of create method

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/getPosts`, {
        method: "GET"
        //we don't need headers or authorization as anyone can see all users' posts
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of list method

export const singlePost = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of singlePost method

export const allPostsByUser = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/getPostsByUser/${userId}`, {
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
}; // end of allPostsByUser method

//apply necessary headers and params by looking at already implemented postman deletePostById back end call
export const remove = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/deletePostById/${postId}`, {
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

export const update = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/updatePostById/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json", //make sure we don't have content type as this is form data
            Authorization: `Bearer ${token}`
        },
        body: post //form is already key value pair, no need to json stringify

    })
        .then(response => {   // this converts the response to json
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of update method
