import { React, Component } from "react";

// Recipe component
class Recipes extends Component {
    constructor(props) {
        super(props)
    }

    // When update button is clicked
    update_recipe = (id) => {
        this.props.onUpdate(id)
    }

    // When delete button is clicked
    delete_recipe = (id) => {
        this.props.onDelete(id)
    }

    // Create tags for the ingredients
    get_ingredients = () => {
        var ing_tags = []
        console.log(this.props.recipe.ingredients)
        for(let ingredient in this.props.recipe.ingredients) {
            console.log(ingredient)
            ing_tags.push(
                <>
                    <p>{this.props.recipe.ingredients[ingredient].ingredient + "  -  " + this.props.recipe.ingredients[ingredient].quantity}</p>
                </>
            )
        }
        return ing_tags
    }

    // Create tag for the recipe
    get_recipe = () => {
        console.log(this.props.recipe)
        return(
            <section>
                <div className="card my-3 bg-light" style={{"width":"80%", "margin-left":"10%", "margin-right":"10%"}}>
                    <div className="card-body" style={{"display" : "block", "align-content" : "left"}}>
                        <div className="d-flex mb-3">
                            <i class="fa fa-user mx-2 my-1"></i>
                            <div className="text-dark mb-0">
                                <strong>{this.props.recipe.user_name}</strong>
                            </div>
                        </div>
                        {/* Recipe details */}
                        <div>
                            <h2><u>{this.props.recipe.recipe_name}</u></h2>
                            {(this.props.recipe.is_veg) &&
                                <div className="green-box mx-2">
                                    <div className="green-dot"></div>
                                </div>
                            }
                            {(!this.props.recipe.is_veg) &&
                                <div className="brown-box mx-2">
                                    <div className="brown-dot"></div>
                                </div>
                            }
                        </div>
                        <div>
                            <h5>Description</h5>
                            <p>{this.props.recipe.description}</p>
                        </div>
                        <hr />
                        <div>
                            <h5>Ingredients</h5>
                            { this.get_ingredients()}
                        </div>
                        <hr />
                        <div>
                            <h5>Cooking Instruction</h5>
                            <p>{this.props.recipe.instructions}</p>
                        </div>
                        <hr />
                    </div>
                    {/* Image */}
                    {(this.props.recipe.image.length > 0) &&
                        <div className="mx-3">
                        <h5>Recipe Image</h5>
                        <div className="bg-image hover-overlay ripple rounded-0" data-mdb-ripple-color="light">
                        <img src={`${this.props.recipe.image}`} height="100" width="100" />
                        </div>
                        </div>
                    }
                    {/* Buttons */}
                    <div className="card-body">
                        <div class="d-flex justify-content-between text-center border-top border-bottom mb-4 py-2">
                            <a  style={{"cursor" : "pointer"}} onClick={() => this.update_recipe(this.props.recipe._id)}><i className="fa-solid fa-pen mx-2"></i>Edit</a>
                            <a style={{"cursor" : "pointer"}} onClick={() => this.delete_recipe(this.props.recipe._id)}><i className="fa-regular fa-trash-can mx-2"></i>delete</a>
                        </div>

                    </div>
                </div>
            </section>
        )
    }


    // Render the component
    render() {
        return (
            <>
                {this.get_recipe()}
            </>
        )
    }
}

export default Recipes;