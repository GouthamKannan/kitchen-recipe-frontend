import { React, Component } from "react";
import Cookies from 'js-cookie';
import configs from "../config";
import Header from "./header";

class AllRecipes extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.user_name)
        this.state = {
            upvoted : this.props.recipe.upvotes.includes(this.props.user_name),
            downvoted : this.props.recipe.downvotes.includes(this.props.user_name),
            upvote_count : this.props.recipe.upvotes.length,
            downvote_count : this.props.recipe.downvotes.length,
        }
    }

    upvote = async(id) => {
        if(this.state.upvoted) {
            var removed = await this.props.RemoveUpvote(id)
            if(removed)
            {
                this.state.upvote_count -= 1
                this.setState({
                    upvoted : false
                })
            }
        }
        else
        {
            var upvoted = await this.props.OnUpvote(id)
            if(upvoted)
            {
                this.state.upvote_count += 1
                if(this.state.downvoted) {
                    this.state.downvote_count -=1
                }
                this.setState({
                    upvoted : true,
                    downvoted : false
                })
            }
        }

        console.log(this.state)

    }

    downvote = async(id) => {
        if(this.state.downvoted) {
            var removed = await this.props.RemoveDownvote(id)
            if(removed)
            {
                this.state.downvote_count -= 1
                this.setState({
                    downvoted : false
                })
            }
        }
        else
        {
            var downvoted = await this.props.OnDownvote(id)
            if(downvoted)
            {
                this.state.downvote_count += 1
                if(this.state.upvoted) {
                    this.state.upvote_count -=1
                }
                this.setState({
                    downvoted : true,
                    upvoted : false
                })
            }
        }
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
                            <div>
                                <a  style={{"cursor" : "pointer"}} onClick={() => this.upvote(this.props.recipe._id)}>
                                    upvote
                                    {(this.state.upvoted) &&
                                        <i className="fa-solid fa-circle-up mx-2"></i>
                                    }
                                    {
                                        (!this.state.upvoted) &&
                                        <i className="fa-regular fa-circle-up mx-2"></i>
                                    }
                                </a>
                                <span>{this.state.upvote_count}</span>
                            </div>
                            <div>
                                <a style={{"cursor" : "pointer"}} onClick={() => this.downvote(this.props.recipe._id)}>
                                    downvote
                                    {(this.state.downvoted) &&
                                        <i className="fa-solid fa-circle-down mx-2"></i>
                                    }
                                    {
                                        (!this.state.downvoted) &&
                                        <i className="fa-regular fa-circle-down mx-2"></i>
                                    }
                                </a>
                                <span>{this.state.downvote_count}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        )
    }


    render() {
        console.log(this.props.recipe)
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


export default AllRecipes;