// API dependencies
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const util = require('util');

const writeNote = util.promisify(fs.writeFile);
const readNote = util.promisify(fs.readFile);

class Save {
    write(note) {
        return writeNote('db/db.json', JSON.stringify(note));
    }

    read() {
        return readNote('db/db.json','utf8');
    }

    retrieveNotes() {
        return this.read().then(notes => {
            let notesArray;
            try {
                notesArray = [].concat(JSON.parse(notes));
            } catch (err) {
                notesArray = [];
            }
            return notesArray;
        });
    }

    addNote(note) {
        const { title, text } = note;
        if(!title || !text) {
            throw new Error('Please enter a title and a text.');
        }
        const newNote = { title, text, id: uuidv4() };

        // retrieve add and update notes
        return this.retrieveNotes()
        .then(notes => [...notes, newNote])
        .then(updatedNotes => this.write(updatedNotes))
        .then(() => newNote);
    }

    //Delete notes
    deleteNote(id) {
        return this.retrieveNotes()
        .then(notes => notes.filter(note => note.id !== id))
        .then(filteredNotes => this.write(filteredNotes));
    }
};

module.exports = new Save();