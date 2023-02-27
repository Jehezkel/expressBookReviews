const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const getAllBooks = () =>
  new Promise((res, _rej) => {
    process.nextTick(() => res(books));
  });
const getBooksByIsbn = (isbn) =>
  getAllBooks().then((books) => Object.values(books)[isbn]);

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Request needs to contain username and password" });
  if (users.findIndex((u) => u.username === username) !== -1)
    return res
      .status(409)
      .json({
        message: `User with username: ${username} - already exists. Please login or reset password if needed`,
      });
  users.push({ username: username, password: password });
  console.log(users);
  return res
    .status(201)
    .json({ message: `User ${username} registered succesfully` });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  getAllBooks().then((books) => {
    return res.status(200).json(books);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //   const result = books[isbn]
  getBooksByIsbn(isbn).then((result) => {
    if (!result)
      return res
        .status(404)
        .json({ message: `Book with isbn: ${$isbn} - not found.` });
    return res.status(200).json(result);
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  getAllBooks()
    .then((allbooks) => {
      return Object.values(allbooks).filter((b) => b.author === author);
    })
    .then((result) => {
      if (!result.length)
        return res
          .status(404)
          .json({ message: `Books with author - ${author} - not found.` });
      return res.status(200).json(result);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  getAllBooks()
    .then((allbooks) => {
      return Object.values(allbooks).filter((b) => b.title === title);
    })
    .then((result) => {
      if (!result.length)
        return res
          .status(404)
          .json({ message: `Books with title: ${title} - not found.` });
      return res.status(200).json(result);
    });
  // const result = Object.values(books).filter(b => b.title === title)
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const result = books[isbn];
  if (!result)
    return res
      .status(404)
      .json({ message: `Books with isbn: ${isbn} - not found.` });
  return res.status(200).json({ reviews: result.reviews });
});

module.exports.general = public_users;
