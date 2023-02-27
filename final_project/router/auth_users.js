const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "NewUser", password: "secretPassword" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Request must contain username and password in body" });
  if (users.findIndex((u) => u.username === username) === -1)
    return res
      .status(404)
      .json({
        message: `User with username ${username} - not found. Please register first`,
      });
  const requestedUser = users.find((u) => u.username === username);
  if (requestedUser.password !== password)
    return res.status(401).json({ message: "Incorrect Password." });
  const accessToken = jwt.sign(
    { data: { username: username } },
    "SecretPassword",
    { expiresIn: 3600 }
  );
  req.session.authorization = { accessToken, username };
  console.log(req.session.authorization);
  return res.status(200).json({ message: "Logged in!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  console.log("Username ", username);
  const review = req.body.review;
  if (!review)
    return res
      .status(400)
      .json({ message: "Request needs to contain review in body" });

  const bookResult = books[isbn];
  if (!bookResult)
    return res
      .status(404)
      .json({ message: `Book with isbn: ${isbn} - not found` });
  const reviewResult = bookResult.reviews[username];
  let isNewReview = true;
  if (reviewResult) isNewReview = false;
  books[isbn].reviews[username] = review;
  console.log(books[isbn]);
  const myStatusCode = isNewReview ? 201 : 200;
  return res
    .status(myStatusCode)
    .json({
      message: `Review for book ${bookResult.title} ${
        isNewReview ? "created" : "updated"
      } successfully!`,
    });
});
// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  console.log("Username ", username);

  const bookResult = books[isbn];
  if (!bookResult)
    return res
      .status(404)
      .json({ message: `Book with isbn: ${isbn} - not found` });
  const reviewResult = bookResult.reviews[username];
  if (!reviewResult)
    return res
      .status(404)
      .json({ message: `No reviews for user ${username} and isbn ${isbn}` });
  const reviews = books[isbn].reviews;
  delete reviews[username];
  books[isbn].reviews = reviews;
  console.log(books[isbn]);
  return res
    .status(202)
    .json({
      message: `Review for book ${bookResult.title} deleted successfully!`,
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
