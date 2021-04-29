import React, {Component} from 'react';
import {singlePost, remove} from "./apiPost";
import defaultPostImage from "../images/default-post-image.jpeg";
import {Link, Redirect} from "react-router-dom";
import {isAuthenticated} from "../auth";

class SinglePost extends Component {
    state= {
        post: "",
        redirectToHome: false  //after deleting post redirect to home page where all posts are present
    }

    componentDidMount() {
        const postId= this.props.match.params.postId;
        singlePost(postId).then(data => {
            if(data.error)
                console.log(data.error);
            else
                this.setState({post: data});
        })
    }; // end of componentDidMount method

    deletePost = () => {
        const postId= this.props.match.params.postId;
        const token= isAuthenticated().token;
        remove(postId, token).then(data => {
            if(data.error)
                console.log(data.error);
            else
                this.setState({redirectToHome: true});
        })

    } // end of deletePost method

    deleteConfirmed= () => {
        let answer= window.confirm("Are you sure you want to delete the current post?");
        if(answer)
            this.deletePost(); //call to backend api to delete post

    };// end of deleteConfirmed method

    renderPost = (post) => {
        //console.log("printing post: ", post);
        const posted_user_id = post.postedBy ? `/user/${post.postedBy._id}` : ""; // id of person who has posted
        const posted_user_name = post.postedBy ? post.postedBy.name : "unknown"; // name of person who has posted
        //we use above 2 variables to create a link to the user profile
        return (
            <div className="card-body" align="center">
                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                     alt={post.title}
                     onError={i => i.target.src = `${defaultPostImage}`}
                     className="img-thumbnail mb-3"
                     style={{height: "300px", width: "500px", objectFit: "cover"}}
                />
                <p className="card-text">{post.body}</p>
                <br/>
                <p className="font-italic mark">
                    posted by <Link to={posted_user_id}>{posted_user_name} </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`}
                          className="btn btn-raised btn-primary bt-sm mr-5">
                        back to posts
                    </Link>
                    {isAuthenticated().user && isAuthenticated().user._id===post.postedBy._id && (
                        <>
                            <Link to={`/post/edit/${post._id}`}
                                  className="btn btn-raised btn-info mr-5">
                                update post
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-warning">
                                delete post
                            </button>
                        </>
                        )
                    }
                </div>
            </div>

        ) //end of return statement
    }; // end of renderPost method

    render() {
        if(this.state.redirectToHome)
            return <Redirect to={`/`} />;

        const {post}= this.state;
        return (
            <div className="container">
                <h2 className="display-4 mt-3" align="center">{post.title}</h2>
                {/*if post is not populated yet, then display loading */}
                { !post ? (
                    <div className="jumbotron text-center">
                    <h2>Loading ... </h2></div>
                    ):
                    (this.renderPost(post))
                }
            </div>
        );
    }
} // end of SinglePost component

export default SinglePost;