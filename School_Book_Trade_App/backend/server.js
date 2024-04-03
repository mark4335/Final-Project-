// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage });


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mark1234',
  database: 'appdb',
  insecureAuth: true,
});
db.query(`SHOW TABLES LIKE 'users'`, (err, result) => {
  if (err) {
    console.error('Error checking for users table:', err);
  } else {
    if (result.length === 0) {
      createUsersTable();
    } else {
      createBooksTable();
      createMessagesTable(); //  line
    }
  }
});


function createUsersTable() {
  db.query(
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL
    )`,
    (err, result) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table created or already exists');
        createBooksTable();
    
      }
    }
  );
}
function createBooksTable() {
  db.query(
    `CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      useremail VARCHAR(255) NOT NULL,
      school VARCHAR(255),
      subject VARCHAR(255),
      book VARCHAR(255),
      book_condition VARCHAR(255),
      price DECIMAL(10, 2), 
      image BLOB
    )`,
    (err, result) => {
      if (err) {
        console.error('Error creating books table:', err);
      } else {
        console.log('Books table created or already exists');
      }
    }
  );
}


// Massage table
function createMessagesTable() {
  db.query(
    `CREATE TABLE IF NOT EXISTS messages (
      message_id INT AUTO_INCREMENT PRIMARY KEY,
      sender_email VARCHAR(255) NOT NULL,
      receiver_email VARCHAR(255) NOT NULL,
      book_id INT NOT NULL,
      message_content TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_email) REFERENCES users(email),
      FOREIGN KEY (receiver_email) REFERENCES users(email),
      FOREIGN KEY (book_id) REFERENCES books(id)
    )`,
    (err, result) => {
      if (err) {
        console.error('Error creating messages table:', err);
      } else {
        console.log('Messages table created or already exists');
      }
    }
  ); 
}




//End points
// Endpoint to handle user signup

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Store the user data in the database
      db.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, hash],
        (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(201).json({ message: 'User created successfully' });
          }
        }
      );
    }
  });
});



// Endpoint to handle user signin

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        // Compare passwords
        bcrypt.compare(password, result[0].password_hash, (err, match) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            if (match) {
              // User authenticated successfully
              res.status(200).json({ message: 'Authentication successful' });
            } else {
              // Incorrect password
              res.status(401).json({ error: 'Incorrect password' });
            }
          }
        });
      }
    }
  });
});


// Get all books
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, result) => {
    if (err) {
      console.error('Error retrieving books:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});



// Endpoint to handle creating a new book entry
app.post('/createBook', upload.single('image'), (req, res) => {
  const { name, userEmail, school, subject, book, condition, price } = req.body;

  // Debugging: Log the received data
  console.log('Received data:', req.body);

  // Check if userEmail exists and is not 'undefined'
  if (!userEmail || userEmail === 'undefined') {
    console.error('Invalid userEmail:', userEmail);
    return res.status(400).send('Invalid userEmail');
  }

  // Check if the user exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [userEmail], (userErr, userResults) => {
    if (userErr) {
      console.error('Error checking user:', userErr);
      return res.status(500).send('Error creating book');
    }

    // Debugging: Log the user query results
    console.log('User Query:', userResults);

    if (userResults.length === 0) {
      return res.status(404).send('User not found');
    }

    // User exists, proceed to insert the book
    const image = req.file ? req.file.buffer : null;

    db.query(
      `INSERT INTO books (name, useremail, school, subject, book, book_condition, price, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, userEmail, school, subject, book, condition, price, image],
      (err, result) => {
        if (err) {
          console.error('Error creating book:', err);
          res.status(500).send('Error creating book');
        } else {
          console.log('Book created successfully');
          res.status(200).send('Book created successfully');
        }
      }
    );
  });
});


// Delete a specific book by ID and currentUser
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const currentUser = req.headers.useremail; // Get the useremail from the request headers

  

  // Log for debugging
  console.log(`Deleting book with ID ${bookId} for user: ${currentUser}`);

  // Perform the database query to delete the book with the specified ID and currentUser
  db.query('DELETE FROM books WHERE id = ? AND useremail = ?', [bookId, currentUser], (err, result) => {
    if (err) {
      // If there's an error, log it and send an error response
      console.error('Error deleting book:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.affectedRows === 0) {
      // If no rows were affected (book not found), send a 404 response
      res.status(404).json({ error: 'No book found with the specified ID for the current user' });
    } else {
      // If deletion was successful, send a success response
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});


//----------------------------------------------

app.post('/messages', (req, res) => {
  const { sender_email, receiver_email, book_id, message_content } = req.body;

  // Check if all required fields are provided
  if (!sender_email || !receiver_email || !book_id || !message_content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert the new message into the messages table
  db.query(
    `INSERT INTO messages (sender_email, receiver_email, book_id, message_content) VALUES (?, ?, ?, ?)`,
    [sender_email, receiver_email, book_id, message_content],
    (err, result) => {
      if (err) {
        console.error('Error sending message:', err);
        return res.status(500).json({ error: 'Error sending message' });
      } else {
        console.log('Message sent successfully');
        return res.status(200).json({ message: 'Message sent successfully' });
      }
    }
  );
});




// Endpoint to fetch message_content based on sender_email
app.get('/offers/:currentUser', (req, res) => {
  const currentUser = req.params.currentUser;

  db.query(
    `SELECT m.sender_email, m.message_content, m.timestamp, b.book AS book_name, b.id AS book_id
    FROM messages m
    INNER JOIN books b ON m.book_id = b.id
    WHERE (m.sender_email = ? OR m.receiver_email = ?) AND (m.receiver_email = ? OR m.sender_email = ?)`,
    [currentUser, currentUser, currentUser, currentUser],
    (err, results) => {
      if (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Error fetching messages' });
      } else {
        res.status(200).json(results);
      }
    }
  );
});







//---------------------------------------------------------------------------------------




// Endpoint to send email
const nodemailer = require('nodemailer');

// Create a nodemailer transporter with your SMTP configuration
let transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Your SMTP server host
  port: 587, // SMTP port (587 is commonly used for TLS)
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your_email@example.com', // Your email address
    pass: 'your_password' // Your email password (consider using app-specific password)
  }
});

// Ex to send email
app.post('/send-email', async (req, res) => {
  const { sender_email, receiver_email, subject, text } = req.body;

  try {
    // Send email using the configured transporter
    let info = await transporter.sendMail({
      from: sender_email,
      to: receiver_email,
      subject: subject,
      text: text
    });
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal server error');
  }
});
// ... (remaining server code)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});