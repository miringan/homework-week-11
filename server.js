const express = require('express');
const path = require('path');
const db = require('./db/db.json');

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


// app.get('/api/notes/:term', (req,res) => {
//   const requestedTerm = req.params.term.toLowerCase();

//   console.log(requestedTerm);

//   for (let i = 0; i < db.length; i++) {
//     if (requestedTerm === db[i].term.toLowerCase()) {
//       return res.json(db[i]);
//     }
//   }

//   return res.json('No match found');
// })

// app.post('api/notes', (req,res) => {

//     // Create (persist) data

//     // Access the new note data from 'req

//     // Push it to my existing list of notes

//     // Write my updates note list to the db.json file

// })

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
