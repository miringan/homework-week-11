// Import packages
const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3001;
const app = express();
// const PORT = 3001;

// middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET route for notes page
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// GET route to access notes data from db
app.get('/api/notes', async (req,res) => {
  let dbData = [];
  const readFileAsync = util.promisify(fs.readFile);
  const freshDB = await readFileAsync('./db/db.json', 'utf8');
  dbData = [].concat(JSON.parse(freshDB));
  console.log(dbData);
  res.json(dbData);
})

// POST route to add notes to db
app.post('/api/notes', (req,res) => {
  // capture data
  const {title, text} = req.body;
  
  if (title && text) {
      // Create (persist) data
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


// DELETE route
app.delete('/api/notes/:id', (req,res) => {

  const deletion = req.params;

  let newParsedNotes = [];

  // Obtain existing notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      // Find the object in the parsedNotes that has the same ID
      for (var i = 0; i < parsedNotes.length; i++) {
        if (deletion.id !== parsedNotes[i].id){
          newParsedNotes.push(parsedNotes[i]);
        }
      }

      // Add recreate the db file with the new array post deletion
      fs.writeFile(
        './db/db.json',
        JSON.stringify(newParsedNotes, null, 3),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  });
  res.redirect("/api/notes");

});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
