
import React, {Component} from 'react';
import {signup} from '../auth';

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false  // initially no error
        };
    } // end of constructor
    //curried function -- on calling function with one parameter name it will return another function
    // which requires event as input and sets the state
    handleChange = name => event => {
        this.setState({error: ""});
        this.setState({open: false}); //to deactivate the div element once user starts signup again
        this.setState({[name]: event.target.value});
    };

    //onClickSubmit will get an event upon clicking
    onClickSubmit = event => {
        //preventing default behaviour of the browser. i.e reloading on click
        event.preventDefault();
        const {name, email, password} = this.state;
        const user = {
            name,
            email,
            password
        };
        //console.log(user);
        signup(user).then(data => {
                if(data.error)
                    this.setState({error: data.error});
                else //clearing the object of state -- old values to empty string
                    this.setState({
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        open: true //on successful user creation. to activate div element to show in frontend
                    });
            });
    }; // end of onClickSubmit method




    //code refactoring -- moving form from render method to here
    signUpForm = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}></input>
            </div>
            <button onClick={this.onClickSubmit} className="btn btn-raised btn-primary">submit</button>

        </form>
    ); //end of signUpForm


    //once there is some change in (name, email, password} fields they get populated we can
    // store it in value
    render() {
        const {name, email, password, error, open} = this.state;
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">signup</h2>
                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>
                <div className="alert alert-info" style={{display: open? "":"none"}}>
                    New user account is successfully created. Use registered email and password to sign in.
                </div>
                {this.signUpForm(name, email, password)}
            </div>
        );
    }
}
export default Signup;