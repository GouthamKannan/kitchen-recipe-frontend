import { React, Component } from "react";
import {Navbar, NavLink} from 'react-bootstrap'
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import configs from "../config";
import Cookies from 'js-cookie';

/**
 * Component for Todo application
 */
class Header extends Component {
    constructor(props){
        super(props)
    }

    // Handling log out
    logout = async() => {
        Cookies.remove("user_name")
        Cookies.remove("session_id")
        await fetch(configs.api_url + "/user/logout", {
            method : "GET",
            credentials: "include",
        })
        window.location = "/"
    }

    render() {
        return (
            <nav className="navbar navbar-light bg-light navbar-expand-lg text-center">
                <div style={{"margin-right" : "50%", "margin-left":"10%"}}>
				<span className=" mx-5 nav-link">{this.props.user_name}</span>
                </div>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">

                        <li className="nav-item">
							<a href={"/home-page/" + this.props.user_name} onlyActiveOnIndex={true} className="nav-link" activeClassName="active">
								Home
							</a>
						</li>
						<li classNam="nav-item ">
							<a href={"/add-recipe/" + this.props.user_name} className="nav-link" activeClassName="active">
								New Recipe
							</a>
						</li>
                        <li className="nav-item">
                            <a href={"/my-recipes/" + this.props.user_name} className="nav-link" activeClassName="active">
                                My Recipes
                            </a>
                        </li>
						<><li className="nav-item"><button className="btn btn-danger" onClick={this.logout} value="logout">Logout</button></li></>
					</ul>
				</div>
			</nav>
        )
    }
}

export default Header;