import React, { Component } from "react";
import configs from '../config'

// Forget password component
export default class ForgetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            error: '',
            show_icon : false
        }
        this.send_link = this.send_link.bind(this);
    }

    // Handle changes in input fields and store them in state
    handleChange = ({ target: { name, value } }) => {
        this.setState({[name]: value });
      };

    // Handle send Link button
    send_link = async(e) => {
        e.preventDefault();

        this.setState({show_icon: true})
        if (this.state.email.length > 0 ) {

            // Get reset link in mail using api
            const response = await fetch(configs.api_url + "/user/send_reset_link", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: this.state.email
                })
            })

            const data = await response.json();

            // Link is sent to mail
            if (data.success === true) {
                this.setState({show_icon : false})
                alert("Password reset link is sent to email")
                window.location = "/"
            }
            else{
                this.setState({
                    email: "",
                    error : data.data,
                    show_icon : false
                });
            }
        } else {
            this.setState({
                error : "Email cannot be empty",
                show_icon : false
            });
        }
    }

    render() {
        return (
            <>
            {this.state.show_icon && (<center><i className="fa fa-spinner fa-pulse fa-2x mt-5 center"></i></center>)}
            <div className = "auth-wrapper"  style = {{"margin-top": "5%", "margin-bottom": "5%" } } >
                <div className = "auth-inner" >
                    <form onSubmit = { this.send_link } >
                        {
                            <div>
                                <h3 > Forget Password </h3>
                                <div className = "form-group my-1" >
                                    <label className = "my-2" > Email ID </label>
                                    <input type = "text" name="email" className = "form-control" placeholder = "Enter email ID"
                                        value = { this.state.email } onChange = { evt => this.handleChange(evt) } required
                                    />
                                </div>
                                <span className="alert-danger">{this.state.error}</span>
                                <button type="submit" className = "btn btn-primary btn-block w-100 my-3" > Get password reset link </button>
                            </div>
                        }
                        <p>Already have an account? <a href="/">login</a></p>
                        <p>Create a new account? <a href="/sign-up">Signup</a></p>
                    </form >
                </div>
            </div >
            </>
        );
    }
}