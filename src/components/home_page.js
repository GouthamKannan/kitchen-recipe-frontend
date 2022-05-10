import { React, Component } from "react";
import Cookies from 'js-cookie';
import configs from "../config";
import Header from "./header";
import AllRecipes from "./all_recipes";

// Home page component
class HomePage extends Component {

    constructor(props) {
    super(props);

    // Initialize state variables
    this.state = {
        user_name : "",
        all_recipes : [],
        show_recipes : [],
        search_text : ""
    };
    }

    // Handle search input changes
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

        // Get all recipes from API
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

    // When search button is clicked
    search = () => {

        // Search text is empty
        if(this.state.search_text.length === 0) {
            this.setState({
                show_recipes : this.state.all_recipes
            })
        }

        // Filter the recipes based on search text
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

    // Upvote the recipe and store in db using API
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
            return true
        }
        else{
            return false
        }
    }

    // Remove upvote from the recipe and store in db using API
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
            return true
        }
        else{
            return false
        }
    }

    // Downvote the recipe and store in db using API
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

    // Remove downvote from the recipe and store in db using API
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

    // Create component for each recipe
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

        // When no recipe is found
        if(this.state.show_recipes.length===0)
        {
            return <center><br/><span>No recipes found</span></center>
        }
        else
        {
            return recipes_data
        }
    }


    // Render the component
    render() {
        if(Cookies.get("session_id").length > 0) {
            console.log(this.state.show_recipes)
            return (
            <>
                {/* Header component */}
                <div>
                    <Header user_name={this.state.user_name} />
                </div>

                {/* Search input */}
                <div className="text-center">
                    <input  className="my-3" type = "text" name="search_text" value={this.state.search_text} onChange={evt => this.handleChange(evt)} placeholder="Enter text to search"></input>
                    <button onClick={this.search}>search</button>
                </div>

                {/* Recipes */}
                <div style={{"margin-top":"5%", "margin-bottom":"5%"}}>
                    {this.get_recipes()}
                </div>
            </>
            );
        }

        // Redirect when not logged in
        else {
            window.location = "/";
        }
    }
}

export default HomePage;
