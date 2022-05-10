import { React, Component } from "react";
import Cookies from 'js-cookie';
import configs from "../config";
import Header from "./header";
import Recipes from "./recipes";
import UpdateRecipe from "./update_recipe";

// MyRecipe component
class MyRecipe extends Component {

    constructor(props) {
        super(props);

        // Initialize state variables
        this.state = {
            user_name : "",
            all_recipes : [],
            show_recipes : [],
            show_data : true,
            update_data : {},
            search_text : ""
        };
    }

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

        // Get the recipes of current user from API
        var response = await fetch(configs.api_url + "/recipe/get_recipe/" + user_name, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
        var data = await response.json()

        // Update the state variable
        if (data.data.length > 0) {
            this.setState({
                show_data : true,
                all_recipes : data.data,
                show_recipes : data.data
            })
        }
    }

    // When search button is clicked
    search = () =>{

        // Empty search string
        if(this.state.search_text.length === 0) {
            this.setState({
                show_recipes : this.state.all_recipes
            })
        }

        // Filter based on search string
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

    // Handle search input change and store in state
    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
        this.state.search_text = value;
        this.search();
      };


    // Show update form when update button is clicked
    update = async(id) => {
        this.setState({
            show_data : false,
            update_data : this.state.show_recipes.filter(data => data._id === id)[0]
        })

    }

    // Delete the recipe using API
    delete = async(id) => {
        console.log(id)
        var response = await fetch(configs.api_url + "/recipe/delete_recipe/", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({_id : id})
        })
        var data = await response.json()

        // Redirect
        if(data.success === true) {
            alert("Recipe deleted successfully")
            window.location = "/my-recipes/" + this.state.user_name
        }
    }

    // Create component for each recipe
    get_recipes = () => {

        var recipes = []
        this.state.show_recipes.forEach(recipe => {
            recipes.push(
                <Recipes
                    recipe={recipe}
                    onDelete={this.delete}
                    onUpdate={this.update}
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
            return recipes
        }
    }


    // Render the component
    render() {
        console.log(this.state.user_name)
        if(Cookies.get("session_id")) {
            return (
            <>
                {(this.state.show_data===true) &&
                    <div style={{"overflow" : "hidden"}}>

                    {/* Header component */}
                    <div>
                        <Header user_name={this.state.user_name}/>
                    </div>

                    <div className="text-center">
                        <div className="my-3">
                            <span><h1>MY RECIPES</h1></span>
                        </div>

                        {/* Search input */}
                        <input  className="my-3" type = "text" name="search_text" value={this.state.search_text} onChange={evt => this.handleChange(evt)} placeholder="Enter text to search"></input>
                        <button onClick={this.search}>search</button>
                    </div>

                    {/* Recipes */}
                    <div style={{"margin-top":"5%", "margin-bottom":"5%"}}>
                        {this.get_recipes()}
                    </div>
                </div>}

                {/* Update from */}
                {
                    (this.state.show_data===false) &&
                    <UpdateRecipe
                        data={this.state.update_data}
                        user_name={this.state.user_name}
                    />
                }
            </>
            );
        }

        // Redirect when not logged in
        else {
            window.location = "/";
        }
    }
}

export default MyRecipe;
