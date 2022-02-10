const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const { v4: uuid4 } = require('uuid');
const fs = require('fs');
const util = require('util');
const { stringify } = require('querystring');

const app = express();
const PORT = 3001;
// need to add heroku compatibility

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// send file to notes.html
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// link to the notes db api
app.get('/api/notes', async (req,res) => {
  let newArray = [];
  const readFileAsync = util.promisify(fs.readFile);
  const freshDB = await readFileAsync('./db/db.json', 'utf8');
  // let newArrayTwo = freshDB.replace("[","");
  // let newArrayThree = newArrayTwo.replace("]","");
  // console.log(freshDB);
  newArray = [].concat(JSON.parse(freshDB));
  console.log(newArray);
  res.json(newArray);
  // *TA SUGGESTED CODE BELOW*
})

// link to post notes
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
          // *TA suggested code below*
          // const writeFileAsync = util.promisify(fs.writeFile);
          // return writeFileAsync('db', 'JSON.stringify(note)');
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

});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
