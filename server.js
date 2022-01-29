const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// send file to notes.html
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// link to the notes db api
app.get('/api/notes', (req,res) => {
    res.json(db);
})

// link to post notes
app.post('/api/notes', (req,res) => {
    // Create (persist) data
    const {title, text} = req.body;

    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid4(),
      };

      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);

          // Add a new note
          parsedNotes.push(newNote);

          // Add new note to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 3),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });

      const response = {
        status: 'success',
        body: newNote,
      };

      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }

});


// Link for deleting note

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
