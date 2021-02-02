import express from "express";

// const express = require('express');  //exprees에서 필요한 파일을 node_module에서 불러오는 것
const app = express();               //app을 만드는 과정
 
const handleListening = () => console.log('Listening on: http://localhost:4000');

const handleHome = (req, res) => res.send('Hello from home');

const handleProfile = (req, res) => res.send("You are on my Profile");

app.get("/", handleHome);
app.get("/profile", handleProfile);

app.listen(4000, handleListening);