import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {remove} from './apiUser';
import {signout} from "../auth";
import {Redirect} from "react-router-dom";

class DeleteUser extends Component {

    state= {
            redirectTo: false // we just need  one variable to save redirect
    }; // end of state

    deleteAccount= () => {
        //console.log("deleting account");
        const token= isAuthenticated().token;
        const userId= this.props.userId;//userId passed from Profile.js while invoking DeleteUser component
        remove(userId, token)
            .then(data => {
                if(data.error)
                    console.log(data.error);
                else
                {
                    //signout method takes function as argument--see next function in the signout declaration
                    signout(() => console.log("user profile deleted"));
                    //redirect
                    this.setState({redirectTo: true});
                }
            })
    }; // end of deleteAccount method

    deleteConfirmed= () => {
        let answer= window.confirm("Are you sure you want to delete your account ?");
        if(answer)
            this.deleteAccount(); //call to backend api to delete user

    };// end of deleteConfirmed method

    render() {
        if(this.state.redirectTo) // redirect to home page
            return <Redirect to="/" />
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;