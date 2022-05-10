import { React, Component } from "react";
import Cookies from 'js-cookie';
import configs from "../config";
import Header from "./header";
import Recipes from "./recipes";
import UpdateRecipe from "./update_recipe";

/**
 * Component for HomePage application
 */
class MyRecipe extends Component {

    /**
     * Intialize the task list of the component
     */
    constructor(props) {
    super(props);
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

        console.log(user_name)
        // Get the tasks of the user from API
        var response = await fetch(configs.api_url + "/recipe/get_recipe/" + user_name, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
        var data = await response.json()
        console.log(data)
        if (data.data.length > 0) {
            this.setState({
                show_data : true,
                all_recipes : data.data,
                show_recipes : data.data
            })
        }
    }

    search = () =>{
        console.log(this.state.search_text)
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

    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
        this.state.search_text = value;
        this.search();
      };


    update = async(id) => {
        this.setState({
            show_data : false,
            update_data : this.state.show_recipes.filter(data => data._id === id)[0]
        })

    }

    delete = async(id) => {
        console.log(id)
        var response = await fetch(configs.api_url + "/recipe/delete_recipe/", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({_id : id})
        })
        var data = await response.json()
        if(data.success === true) {
            alert("Recipe deleted successfully")
            window.location = "/my-recipes/" + this.state.user_name
        }
    }

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

        if(this.state.show_recipes.length===0)
        {
            return <center><br/><span>No recipes found</span></center>
        }
        else
        {
            return recipes
        }
    }


    // Render the input text field and list of tasks
    render() {
        console.log(this.state.user_name)
        if(Cookies.get("session_id")) {
            return (
            <>
                {(this.state.show_data===true) &&
                    <div style={{"overflow" : "hidden"}}>
                    <div>
                        <Header user_name={this.state.user_name}/>
                    </div>
                    <div className="text-center">
                    <div className="my-3">
                        <span><h1>MY RECIPES</h1></span>
                    </div>
                    <input  className="my-3" type = "text" name="search_text" value={this.state.search_text} onChange={evt => this.handleChange(evt)} placeholder="Enter text to search"></input>
                    <button onClick={this.search}>search</button>
                    </div>
                    <div style={{"margin-top":"5%", "margin-bottom":"5%"}}>
                    {this.get_recipes()}
                    </div>
                </div>}
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
        else {
            window.location = "/";
        }
    }
}

export default MyRecipe;
