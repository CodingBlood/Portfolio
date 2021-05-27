const express = require("express");
const app = express();
const mongoose = require("mongoose");
//User  Database Schema
const PostSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "usename cannot be left Blanck"]
    },
    Tittle : {
        type : String,
        required : [true, "Tittle cannot be left Blanck"]
    },
    Description : {
        type : String,
        required : [true, "Description cannot be left Blanck"]
    },
    Stars : {
        type : Number,
        required : [true, "Stars cannot be left Blanck"]
    },
    DownStars : {
        type : Number,
        required : [true, "Stars cannot be left Blanck"]
    },
    Time : {
      type: Date,
      default: Date.now
    },
    visibility : {
        type : String,
        required : [true, "visibility cannot be left Blanck"]
    }
})
module.exports = mongoose.model('BlogPost', PostSchema);