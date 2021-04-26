import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {Link, Redirect} from "react-router-dom";
import {read} from "./apiUser";
import defaultImage from '../images/default_profile_image.png';
import DeleteUser from "./DeleteUser";

class Profile extends Component
{
    constructor() {
        super();
        this.state={
            user: "",
            redirectToSignin: false //when the user is not loggedin
        }
    }

    init = userId => {
        //passing the userId passed from componentDidMount method
        read(userId, isAuthenticated().token)
            .then(data => {
                if(data.error) //if we get any error in the response from back end
                    this.setState({redirectToSignin: true});
                else
                    this.setState({user: data});
            });
    }

    componentDidMount()
    {
        const userId= this.props.match.params.userId;
        this.init(userId);

    } //end of componentDidMount method

    //this method will be executed when the props changes
    componentWillReceiveProps(props)
    {
        const userId= props.match.params.userId; //this is the userId after we click on profile
        this.init(userId);

    } //end of componentDidMount method

    render(){
        const {redirectToSignin, user} = this.state;
        if(redirectToSignin) // if true, then we have to sign in
            return <Redirect to="/signin" />
        const photoUrl= user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : defaultImage;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">profile</h2>
                <div className="row">
                    <div className="col-md-6">
                        <img src={photoUrl} style={{height: "200px", width: "auto"}}
                             onError={i => (i.target.src= `${defaultImage}`)}
                             className="img-thumbnail" alt={user.name}/>
                    </div>
                    <div className="col-md-6">
                        <div className="lead mt-2">
                            <p>{user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>joined on: {new Date(user.created).toDateString()}</p>
                        </div>
                        {isAuthenticated().user && isAuthenticated().user._id===user._id && (
                            <div className="d-inline-block">
                                <Link className="btn btn-raised btn-success mr-5"
                                      to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        )}
                    </div>
                    <div className="row">
                        <div className="col md-12 mt-5 mb-5">
                            <hr/>
                                <p className="lead">{user.about}</p>
                            <hr/>
                        </div>
                    </div>
                </div>
            </div>
        );
    };// end of render method
} // end of class profile

export default Profile;