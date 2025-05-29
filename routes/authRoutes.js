import express from 'express';
import { login, logout, register } from '../controllers/authControllers.js';

const authroutes = express.Router();

authroutes.post("/register",register)
authroutes.post("/login",login)
authroutes.post("/logout",logout)

export default authroutes
