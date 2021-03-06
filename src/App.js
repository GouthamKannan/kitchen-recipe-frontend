import React from 'react';
import './App.css';

//Importing bootstrap and other modules
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Navbar } from 'react-bootstrap'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

// Import components
import Login from './components/login';
import Signup from './components/signup';
import HomePage from './components/home_page';
import ForgetPassword from './components/forget_password';
import Footer from './components/footer';
import ResetPassword from './components/reset_password';
import MyRecipe from './components/my_recipe';
import AddRecipe from './components/add_recipe';

function App() {

    return (

        <BrowserRouter >
        <Routes >
        <Route path = "/" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <span > Kitchen Recipe Management </span>
                    </div>
                </Navbar>
                <Login />
            </div>
        }/>

        <Route path = "/login/:msg" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Kitchen Recipe Management </p>
                    </div>
                </Navbar>
                <Login />
            </div>
        }/>

        <Route path = "/sign-up" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Kitchen Recipe Management </p>
                    </div>
                </Navbar>
                <Signup />
            </div>
        } />

        <Route path = "/forget-password" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Kitchen Recipe Management </p>
                    </div>
                </Navbar>
                <ForgetPassword />
            </div>
        } />

        <Route path = "/reset-password/:id" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Kitchen Recipe Management </p>
                    </div>
                </Navbar>
                <ResetPassword />
            </div>
        } />

        <Route path = "/home-page/:user_name" element = { <HomePage /> } />
        <Route path = "/my-recipes/:user_name" element = { <MyRecipe /> } />
        <Route path = "/add-recipe/:user_name" element = { <AddRecipe /> } />
        </Routes>

        {/* <Footer /> */}
        </BrowserRouter>

    )
};

export default App;