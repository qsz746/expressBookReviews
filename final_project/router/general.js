const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: `User ${username} successfully registred. Now you can login`});
    } else {
      return res.status(404).json({message: `User ${username} already exists!`});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Username and password are required"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookByISBN = books[isbn];
  if(bookByISBN){
    return res.status(300).json(bookByISBN);
  } else {
    return res.status(300).json({message: "could not find the book by given isbn"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.trim().toLowerCase().replaceAll(" ", "");
  let bookByAuthor = {};
  for (const [key, value] of Object.entries(books)) {
    if(value.author.trim().toLowerCase().replaceAll(" ", "") === author){
      bookByAuthor = value;
    }
  }
  console.log(bookByAuthor);
  return res.status(300).json(bookByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.trim().toLowerCase().replaceAll(" ", "");
  let bookByTitle = {};
  for (const [key, value] of Object.entries(books)) {
    if(value.title.trim().toLowerCase().replaceAll(" ", "") === title){
      bookByTitle = value;
    }
  }
  console.log(bookByTitle);
  return res.status(300).json(bookByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
