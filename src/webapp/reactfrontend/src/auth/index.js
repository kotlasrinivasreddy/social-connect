
export const signup = user => {
    //now we need to make post request to /signup method in the backend
    // we can use axios or fetch
    return fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user) //sending entire user object to the backend
    })
        .then(response => {
            return response.json();
        })
        .catch( error => console.log(error));
}; // end of signup method

export const signin = user => {
    //now we need to make post request to /signin method in the backend
    // we can use axios or fetch
    return fetch("http://localhost:3001/signin", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user) //sending entire user object to the backend
    })
        .then(response => {
            return response.json();
        })
        .catch( error => console.log(error));
}; // end of signin method


//authenticate method
export const authenticate = (data, next) => {
    if(typeof window !== "undefined") //checking browser window in not undefined
    {
        localStorage.setItem("jwt", JSON.stringify(data));
        next(); //moves the middleware to next instruction - moves to else & set redirctTo to true
    }
}; //end of authenticate method

export const signout = (next) => {
    if( typeof window !== "undefined")
        localStorage.removeItem("jwt"); //this will remove the token on the client side
    next();
    return fetch("http://localhost:3001/signout", {
        method: "GET"
    })
        .then(response => {
            console.log('signout' ,response);
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}; // end of signout method


//method is authenticated
export const isAuthenticated = () => {

    if(typeof window == "undefined")
        return false;
    if(localStorage.getItem("jwt"))
        return JSON.parse(localStorage.getItem("jwt"));
    else
        return false;

};
