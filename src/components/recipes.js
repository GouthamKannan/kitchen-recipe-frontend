import { React, Component } from "react";
import Cookies from 'js-cookie';
import configs from "../config";
import Header from "./header";

class Recipes extends Component {
    constructor(props) {
        super(props)
    }

    update_recipe = (id) => {
        this.props.onUpdate(id)
    }

    delete_recipe = (id) => {
        this.props.onDelete(id)
    }

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

    get_recipe = () => {
        console.log(this.props.recipe)
        return(
            <section>
                <div className="card my-3 bg-light" style={{"width":"80%", "margin-left":"10%", "margin-right":"10%"}}>
                    <div className="card-body" style={{"display" : "block", "align-content" : "left"}}>
                        {/* <!-- Data --> */}
                        <div className="d-flex mb-3">
                            <i class="fa fa-user mx-2 my-1"></i>
                            <div className="text-dark mb-0">
                                <strong>{this.props.recipe.user_name}</strong>
                            </div>
                        </div>
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
                        {/* <!-- Description --> */}
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
                    {/* <!-- Media --> */}
                    {(this.props.recipe.image.length > 0) &&
                        <div className="mx-3">
                        <h5>Recipe Image</h5>
                        <div className="bg-image hover-overlay ripple rounded-0" data-mdb-ripple-color="light">
                        <img src={`${this.props.recipe.image}`} height="100" width="100" />
                        </div>
                        </div>
                    }

                    {/* <a href="#!">
                        <div className="mask" style={{"background-color": "rgba(251, 251, 251, 0.2)"}}></div>
                    </a>
                    </div> */}
                    {/* <!-- Media --> */}
                    {/* <!-- Interactions --> */}
                    <div className="card-body">
                    {/* <!-- Reactions --> */}

                        <div class="d-flex justify-content-between text-center border-top border-bottom mb-4 py-2">
                            <a  style={{"cursor" : "pointer"}} onClick={() => this.update_recipe(this.props.recipe._id)}><i className="fa-solid fa-pen mx-2"></i>Edit</a>
                            <a style={{"cursor" : "pointer"}} onClick={() => this.delete_recipe(this.props.recipe._id)}><i className="fa-regular fa-trash-can mx-2"></i>delete</a>
                        </div>

                    </div>
                </div>
            </section>
        )
    }


    render() {
        return (
            <>
                {/*
                    For each recipe in props.recipes
                    if props.type==="all_recipes" add a component with upvote, downvote and comment button
                    else add a componete with delete and update button
                */}
                {this.get_recipe()}
            </>
        )
    }
}

export default Recipes;