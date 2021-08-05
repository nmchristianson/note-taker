const express = require("express");
const path = require("path");
const fs = require("fs");

// Set up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

const notepadAr = require("./db/db.json");

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

// Routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Displays all notes
app.get("/api/notes", function(req, res) {
  return res.json(notepadAr);
});


// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
  var newNote = req.body;

  newNote.id = notepadAr.length;  
  notepadAr.push(newNote);
  //console.log(notepadAr);

  fs.writeFileSync("./db/db.json", JSON.stringify(notepadAr));
  res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
    let i = parseInt(req.params.id);
    //console.log(i);

    notepadAr.splice(i, 1);

    //Resync the note id values to match with array index
    for(let j = 0 ; j < notepadAr.length; j++) {
        notepadAr[j].id = j;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(notepadAr));
    //console.log(notepadAr);

    res.json(notepadAr);
});

app.get("*", function(req, res) {
    res.redirect("/");
}); 