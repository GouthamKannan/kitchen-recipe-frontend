import { React, Component } from "react";
import Cookies from 'js-cookie';
import configs from "../config";
import Header from "./header";
import AllRecipes from "./all_recipes";

/**
 * Component for HomePage application
 */
class HomePage extends Component {

    /**
     * Intialize the task list of the component
     */
    constructor(props) {
    super(props);
    this.state = {
        user_name : "",
        all_recipes : [],
        show_recipes : [],
        search_text : ""
    };
    }

    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
        this.state.search_text = value;
        this.search();
      };

    componentDidMount = async() => {

        // Get user name from URL
        const windowUrl = window.location;
        var user_name = windowUrl.toString().split('/').pop().replace("?", "").replace("#", "")
        if(user_name === Cookies.get("user_name"))
            this.setState({user_name : user_name});
        else{
            alert("Session expired")
            window.location = "/"
        }

        // Get the tasks of the user from API
        var response = await fetch(configs.api_url + "/recipe/get_recipes", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
        var data = await response.json()
        this.setState({
            all_recipes : data.data,
            show_recipes : data.data
        })
    }

    search = () => {
        if(this.state.search_text.length === 0) {
            this.setState({
                show_recipes : this.state.all_recipes
            })
        }
        else {
            this.setState({
                show_recipes : this.state.all_recipes.filter((recipe) =>
                    recipe.user_name.toLowerCase().indexOf(this.state.search_text.toLowerCase()) !== -1 ||
                    recipe.recipe_name.toLowerCase().indexOf(this.state.search_text.toLowerCase()) !== -1 ||
                    recipe.description.toLowerCase().indexOf(this.state.search_text.toLowerCase()) !== -1
                )
            })
        }
    }

    upvote = async(_id) => {
        var response = await fetch(configs.api_url + "/recipe/inc_upvote_recipe", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
                _id : _id,
                user_name : this.state.user_name
            })
        })
        var data = await response.json()
        if (data.success === true) {
            // Update the upvote symbol
            return true
        }
        else{
            return false
        }
    }

    remove_upvote = async(_id) => {
        var response = await fetch(configs.api_url + "/recipe/dec_upvote_recipe", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
                _id : _id,
                user_name : this.state.user_name
            })
        })
        var data = await response.json()
        if (data.success === true) {
            // Update the upvote symbol
            return true
        }
        else{
            return false
        }
    }

    downvote = async(_id) => {
        var response = await fetch(configs.api_url + "/recipe/inc_downvote_recipe", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
                _id : _id,
                user_name : this.state.user_name
            })
        })
        var data = await response.json()
        if (data.success === true) {
            // Update the downvote symbol
            return true
        }
        else{
            return false
        }
    }

    remove_downvote = async(_id) => {
        var response = await fetch(configs.api_url + "/recipe/dec_downvote_recipe", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
                _id : _id,
                user_name : this.state.user_name
            })
        })
        var data = await response.json()
        if (data.success === true) {
            // Update the downvote symbol
            return true
        }
        else{
            return false
        }
    }

    get_recipes = () => {
        var recipes_data = []
        this.state.show_recipes.forEach(recipe => {
            recipes_data.push(
                <AllRecipes
                    recipe={recipe}
                    OnUpvote={this.upvote}
                    OnDownvote={this.downvote}
                    RemoveUpvote={this.remove_upvote}
                    RemoveDownvote={this.remove_downvote}
                    user_name={this.state.user_name}
                />
            )
        });

        if(this.state.show_recipes.length===0)
        {
            return <center><br/><span>No recipes found</span></center>
        }
        else
        {
            return recipes_data
        }
    }


    // Render the input text field and list of tasks
    render() {
        console.log(Cookies.get("session_id"))
        // alert("here")
        if(Cookies.get("session_id").length > 0) {
            console.log(this.state.show_recipes)
            return (
            <>
                <div>
                    <Header
                        user_name={this.state.user_name}
                    />
                </div>
                <div className="text-center">
                    <input  className="my-3" type = "text" name="search_text" value={this.state.search_text} onChange={evt => this.handleChange(evt)} placeholder="Enter text to search"></input>
                    <button onClick={this.search}>search</button>
                </div>
                <div style={{"margin-top":"5%", "margin-bottom":"5%"}}>
                    {this.get_recipes()}
                </div>
            </>
            );
        }
        else {
            window.location = "/";
        }
    }
}

export default HomePage;
