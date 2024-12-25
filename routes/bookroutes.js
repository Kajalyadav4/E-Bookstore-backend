const express = require('express');
const multer = require('multer');
const Book = require('../model/bookSchema');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // Folder to store uploaded files
});

router.post('/create', upload.single('pdf'), async (req, res) => {
  const { image, title, author, description, price, amazonLink,pdf} = req.body;
  

  try {
    // Check if required fields are present
    if (!image || !title || !author || !description || !price || !amazonLink || !pdf) {
      return res.status(400).json({ message: 'All fields are required, including the PDF file' });
    }

    // Create a new book with the provided data
    const newBook = new Book({
      image,
      title,
      author,
      description,
      price,
      amazonLink,
      pdf, // Save the file path of the uploaded PDF
    });

    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json(book);
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })


module.exports = router;
