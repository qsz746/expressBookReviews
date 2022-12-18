const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in, username and password are required"});
  }
  if (authenticatedUser(username, password)) {
    //If the username and password match data in users
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
  }
  console.log(req.session.authorization);
  return res.status(200).send("User successfully logged in");
  } else {
    //If not
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if(books[isbn]){
    books[isbn].reviews[username] = review;
    return res.status(300).json(`Added review '${review}' posted by ${username} to ${JSON.stringify(books[isbn])}`);
  } else {
    return res.status(400).json({message: `Can not find book with isbn ${isbn}`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  console.log("username", username);
  if(books[isbn]){
    for(const [key, value] of Object.entries(books[isbn].reviews)){
      console.log(`key: ${key}, value: ${value}`);
      if(key === username){
        delete books[isbn].reviews[key];
        return res.status(300).json(`Deleted review posted by ${username} in ${JSON.stringify(books[isbn])}`);
      }
    }
    return res.status(300).json(`No review posted by ${username} for ${JSON.stringify(books[isbn])}`);
  } else {
    return res.status(400).json({message: `Can not find book with isbn ${isbn}`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
