
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {signin, authenticate} from '../auth';

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectTo: false, // to redirect to other page after login
            loading: false
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
        this.setState({loading: true}); // when the submit button is clicked, loading page activate
        const { email, password} = this.state;//we can't send this.state directly as it contains other fields
        const user = {
            email,
            password
        };
        //console.log(user);
        signin(user).then(data => {
                if(data.error)
                    this.setState({error: data.error, loading: false});//if error, no need of loading page
                else
                {
                    //authenticate the user and redirect
                    //data frm backend contains the json webtoken
                    authenticate(data, () => {
                        this.setState({redirectTo: true});
                    });

                }// end of else
            });
    }; // end of onClickSubmit method





    //code refactoring -- moving form from render method to here
    signInForm = (email, password) => {
        return(
            <form>
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
        );
    }; //end of signInForm


    //once there is some change in (email, password} fields they get populated we can
    // store it in value
    render() {
        const {email, password, error, redirectTo,loading} = this.state;
        if(redirectTo) //if redirect is true
        {
            return <Redirect to="/"/>
        }
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">signin</h2>
                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading ... </h2></div>: ""
                }

                {this.signInForm(email, password)}
            </div>
        );
    }
}
export default Signin;