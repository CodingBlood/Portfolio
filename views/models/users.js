const express = require("express");
const app = express();
const mongoose = require("mongoose");
//User  Database Schema
const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "usename cannot be left Blanck"]
    },
    password : {
        type : String,
        required : [true, "password cannot be left Blanck"]
    },
    fname : {
        type : String,
        required : [true, "fname cannot be left Blanck"]
    },
    lname : {
        type : String,
        required : [true, "lname cannot be left Blanck"]
    },
    email : {
        type : String,
        required : [true, "email cannot be left Blanck"]
    }
})
module.exports = mongoose.model('User', UserSchema);