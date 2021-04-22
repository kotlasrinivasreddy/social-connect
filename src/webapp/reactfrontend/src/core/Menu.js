
import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated} from "../auth";

const isActive = (history, path) => {
    if(history.location.pathname === path)
        return {color: "#a52a2a"};
    else
        return {color: "#ffffff"};
}; // end of isActive method



const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
            <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
            </li>
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Sign-Up</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Sign-In</Link>
                    </li>
                </>
            )}

            {isAuthenticated() && (
                <>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        style={( isActive(history, "/signout"), {cursor: "pointer", color:"#fff"} )}
                        onClick={ () => signout( () => history.push('/') ) }
                      >
                      Sign-Out
                      </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link">
                            {isAuthenticated().user.name}
                        </a>
                    </li>
                </>
            )}
        </ul>
    </div>
);

export default withRouter(Menu);



