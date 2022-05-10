import React, { Component } from "react";
import configs from "../config";
import Cookies from 'js-cookie';

// Sign Up component
class UpdateRecipe extends Component {
    constructor(props) {
        super(props)
        var max_ingredient_count = 0
        for (let ingredient in this.props.data.ingredients){
            if(parseInt(ingredient._id) > max_ingredient_count){
                max_ingredient_count = parseInt(ingredient._id)
            }
        }
        this.state = {
            user_name : this.props.user_name,
            _id : this.props.data._id,
            recipe_name: this.props.data.recipe_name,
            description: this.props.data.description,
            image: this.props.data.image,
            is_veg: this.props.data.is_veg,
            instructions: this.props.data.instructions,
            ingredients: this.props.data.ingredients,
            ingredient_count : max_ingredient_count
        }
        console.log(this.props)
        console.log(this.props.data.instruction)
        console.log(this.props.data.ingredients)
        this.update_recipe = this.update_recipe.bind(this)
    }

    // Handle change in input and store in state
    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
    };

    handleFoodType = ({ target: { name, value } }) => {
        if(value === "veg")
            this.setState({ "is_veg" : true });
        else
            this.setState({ "is_veg" : false });
    };

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

    handleFileUpload = async(e) => {
        console.log("Here")
        console.log(e.target.files)
        var files = e.target.files
        console.log(files[0])
        const file = files[0]
        const base64 = await this.convertToBase64(file)
        this.setState({image : base64})
        console.log(base64)
    }

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

    add_ingredient = () => {
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

    delete_ingredient = (_id) => {
        var cur_ingredients = this.state.ingredients.filter(ingredient => ingredient._id !== _id)
        this.setState({
            ingredients : cur_ingredients
        })
    }

    get_ingredients = () => {
        var ingredient_comp = []
        ingredient_comp.push(<div className="my-2" />)
        this.state.ingredients.map(ingredient => {
            console.log(ingredient)
            ingredient_comp.push(
                <div className="my-1" key={ingredient._id}>
                    <div className="mx-1" style={{"display":"inline"}}>
                    <input name="ingredient" onChange={(e) => this.handleChangeIngredient(ingredient._id, e.target.name, e.target.value)} value={ingredient.ingredient} placeholder="ingredient"></input>
                    </div>
                    <div className="mx-1" style={{"display":"inline"}}>
                    <input name="quantity" onChange={(e) => this.handleChangeIngredient(ingredient._id, e.target.name, e.target.value)} value={ingredient.quantity} placeholder="quantity"></input>
                    </div>
                    <div className="mx-1" style={{"display":"inline"}}>
                    <a style={{"cursor" : "pointer"}} onClick={() => this.delete_ingredient(ingredient._id)}><i className="fa-regular fa-trash-can"></i></a>
                    </div>
                </div>
            )
        });
        ingredient_comp.push(<div className="my-2" />)
        ingredient_comp.push(
            <a className="btn btn-secondary" onClick={this.add_ingredient}>+ Add Ingredient</a>
        )

        return ingredient_comp
    }

    // Handle register user button click
    update_recipe = async(e) => {
        e.preventDefault();

        // Call signup API to register user
        const response = await fetch(configs.api_url + "/recipe/update_recipe", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                _id : this.state._id,
                recipe_name: this.state.recipe_name,
                description: this.state.description,
                image: this.state.image,
                instructions : this.state.instructions,
                ingredients : this.state.ingredients,
                is_veg : this.state.is_veg
            })
        })

        const data = await response.json();

        // If signup is successful
        if (data.success === true) {
            alert("Recipe updated successfully")
            window.location = "/my-recipes/" + this.state.user_name;
        }

        // If signup failed
        else
            alert("Cannot update recipe")
    }

    close = (e) => {
        e.preventDefault();
        window.location = "/my-recipes/" + this.state.user_name;
    }

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


    render() {
        if(Cookies.get("session_id")) {
            return (
                <div style={{"overflow" : "hidden"}}>
                {this.state.show_icon && (<center><i className="fa fa-spinner fa-pulse fa-2x mt-5 center"></i></center>)}
                <div className = "auth-wrapper"  style = {{"margin-top": "1%", "margin-bottom": "1%" } } >
                    <div className = "auth-inner" style = {{"width" : "70%"}}>
                        <form onSubmit = { this.update_recipe } >
                            <h3 > Update Recipe </h3>
                            <div className = "form-group my-1" >
                                <label className = "my-2" > Recipe Name </label>
                                <input type = "text" name="recipe_name" className = "form-control" placeholder = "Enter recipe name"
                                    value = { this.state.recipe_name } onChange = { evt => this.handleChange(evt) }
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
                                {(this.state.is_veg) &&
                                <>
                                <input className = "my-1" type="radio" value="veg" defaultChecked name="is_veg"/> Veg <br />
                                <input className = "my-1" type="radio" value="non_veg" name="is_veg"/> Non-veg
                                </> 
                                }
                                {(!this.state.is_veg) &&
                                <>
                                <input className = "my-1" type="radio" value="veg" name="is_veg"/> Veg <br />
                                <input className = "my-1" type="radio" value="non_veg" defaultChecked name="is_veg"/> Non-veg
                                </>
                                }
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
                            <button type = "submit" className = "btn btn-primary btn-block w-25 my-3 mx-3" > Update </button>
                            <button onClick={this.close} className = "btn btn-danger btn-block w-25 my-3 mx-3" > Close </button>
                            </div>

                        </form >
                    </div>
                </div >
                </div>
            );
        }
        else {
            window.location = "/";
        }

    }
}

export default UpdateRecipe;