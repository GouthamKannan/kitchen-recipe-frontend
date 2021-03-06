import React, { Component } from "react";
import configs from "../config";
import Header from "./header";
import Cookies from 'js-cookie';

// Add Recipe component
class AddRecipe extends Component {
    constructor(props) {
        super(props)

        // Initialize state variable
        this.state = {
            user_name: '',
            recipe_name: '',
            description: '',
            image: '',
            is_veg: true,
            instructions: '',
            ingredients: [],
            ingredient_count : 0
        }
        this.add_recipe = this.add_recipe.bind(this)
    }

    componentDidMount() {

        // Get username from URL
        const windowUrl = window.location;
        var user_name = windowUrl.toString().split('/').pop().replace("?", "").replace("#", "")
        if(user_name === Cookies.get("user_name"))
            this.setState({user_name : user_name});
        else{
            alert("Session expired")
            window.location = "/"
        }

    }

    // Handle change in input and store in state
    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
    };

    // Handle food type input change and store in state
    handleFoodType = ({ target: { name, value } }) => {
        if(value === "veg")
            this.setState({ "is_veg" : true });
        else
            this.setState({ "is_veg" : false });
    };

    // Conver the file contents to base64
    convertToBase64 = async(file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
    });
    }

    // Handle file upload input
    handleFileUpload = async(e) => {
        var files = e.target.files
        const file = files[0]
        const base64 = await this.convertToBase64(file)
        this.setState({image : base64})
    }

    // Handle change ingredient input
    handleChangeIngredient = (_id, name, value) => {
        var cur_ingredients = this.state.ingredients.map(ingredient =>
            ingredient._id === _id ?
            {
                ...ingredient,
                [name] : value,
            } :
            ingredient
        )
        this.setState({
            ingredients : cur_ingredients
        })
    }

    // Add new ingredient field to the input
    add_ingredient = (e) => {
        e.preventDefault();
        var cur_ingredients = this.state.ingredients;
        var ingredient_count = this.state.ingredient_count
        cur_ingredients.push({
            _id : ingredient_count.toString(),
            ingredient : "",
            quantity : ""
        })

        this.setState({
            ingredients : cur_ingredients,
            ingredient_count : ingredient_count + 1
        })
    }

    // Delete ingredient filed from input
    delete_ingredient = (_id) => {
        var cur_ingredients = this.state.ingredients.filter(ingredient => ingredient._id !== _id)
        this.setState({
            ingredients : cur_ingredients
        })
    }

    // Create tag for each ingredient
    get_ingredients = () => {
        var ingredient_comp = []
        ingredient_comp.push(<div className="my-2" />)
        this.state.ingredients.map(ingredient => {
            ingredient_comp.push(
                <div className="my-1" key={ingredient._id}>
                    <div className="mx-1" style={{"display":"inline"}}>
                    <input name="ingredient" onChange={(e) => this.handleChangeIngredient(ingredient._id, e.target.name, e.target.value)} placeholder="ingredient"></input>
                    </div>
                    <div className="mx-1" style={{"display":"inline"}}>
                    <input name="quantity" onChange={(e) => this.handleChangeIngredient(ingredient._id, e.target.name, e.target.value)} placeholder="quantity"></input>
                    </div>
                    <div className="mx-1" style={{"display":"inline"}}>
                    <a style={{"cursor" : "pointer"}} onClick={() => this.delete_ingredient(ingredient._id)}><i className="fa-regular fa-trash-can"></i></a>
                    </div>
                </div>
            )
        });
        ingredient_comp.push(<div className="my-2" />)
        ingredient_comp.push(
            <button className="btn btn-secondary" onClick={this.add_ingredient}>+ Add Ingredient</button>
        )

        return ingredient_comp
    }

    // Handle add recipe button click
    add_recipe = async(e) => {
        e.preventDefault();

        // Call add recipe API to add recipe to database
        const response = await fetch(configs.api_url + "/recipe/add_recipe", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_name: this.state.user_name,
                recipe_name: this.state.recipe_name,
                description: this.state.description,
                image: this.state.image,
                instructions : this.state.instructions,
                ingredients : this.state.ingredients,
                is_veg : this.state.is_veg
            })
        })

        const data = await response.json();

        // If add recipe is successful
        if (data.success === true) {
            alert("Recipe added successfully")
            window.location = "/my-recipes/" + this.state.user_name;
        }

        // If add recipe failed
        else
            alert(data.data)
    }

    // Get the image from base64 data
    get_image = () => {
        if(this.state.image.length > 0)
        {
            var binary_data = this.state.image;
            return <img width="100" height="100" src={`${binary_data}`} />

        }
        else
        {
            return <></>
        }
    }

    // Render add recipe component
    render() {
        if(Cookies.get("session_id")) {
            return (
                <>
                {/* Header component */}
                <div>
                    <Header user_name={this.state.user_name} />
                </div>
                <div style={{"overflow" : "hidden"}}>
                {this.state.show_icon && (<center><i className="fa fa-spinner fa-pulse fa-2x mt-5 center"></i></center>)}

                {/* Input fields */}
                <div className = "auth-wrapper" style= {{"margin-top": "1%", "margin-bottom":"3%"}}>
                    <div className = "auth-inner" style= {{"width" : "70%"}}>
                        <form onSubmit = { this.add_recipe } >
                            <h3 > New Recipe </h3>
                            <div className = "form-group my-1" >
                                <label className = "my-2" > Recipe Name </label>
                                <input type = "text" name="recipe_name" className = "form-control" placeholder = "Enter recipe name"
                                    value = { this.state.recipe_name } onChange = { evt => this.handleChange(evt) } required
                                />
                            </div>
                            <div className = "form-group my-1" >
                                <label className = "my-2" > Description </label>
                                <input type = "text" name="description" className = "form-control" placeholder = "Describe the recipe"
                                    value = { this.state.description } onChange = { evt => this.handleChange(evt) } required
                                />
                            </div>
                            <div className = "form-group my-1" >
                                <label className = "my-2" > Ingredients </label>
                                {this.get_ingredients()}
                            </div>
                            <div className = "form-group my-1" >
                                <label className = "my-2" > Cooking instructions </label>
                                <textarea rows="10" type = "text" name="instructions" className = "form-control" placeholder = "Enter cooking instruction"
                                    value = { this.state.instructions } onChange = { evt => this.handleChange(evt) } required
                                />
                            </div >
                            <div className = "form-group my-1" onChange = { evt => this.handleFoodType(evt) }>
                                <label className = "my-2" > Food Type </label><br/>
                                <input className = "my-1" type="radio" value="veg" defaultChecked name="is_veg"/> Veg <br />
                                <input className = "my-1" type="radio" value="non_veg" name="is_veg"/> Non-veg
                            </div>
                            <div className = "form-group my-1" >
                                <label className = "my-2" > Recipe image (Max 5 mb) </label>
                                <input type = "file" name="image" className = "form-control" accept=".jpeg, .png, .jpg"
                                onChange = { evt => this.handleFileUpload(evt) }
                                />
                            </div >
                            {this.get_image()}

                            <span className="alert-danger">{this.state.error}</span>
                            <div className="text-center">
                            <button type = "submit" className = "btn btn-primary btn-block w-25 my-2" > Add </button>
                            </div>
                        </form >
                    </div>
                </div >
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

export default AddRecipe;