const express = require('express');
const book = require('./book.js')
require('dotenv').config();
const PORT = process.env.PORT || 1333;
const cors = require('cors');
const app = express();
const db = require('monk')(process.env.MONGO_URI);

const collection = db.get('bookList');

app.use(cors());

const isAvailable = async (book) => {
    let bool = [];
    let finalBool
    await collection.find({ date: book.date }).then((result) => {
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                let newBookStartDate = new Date(book.startTime);
                let newBookEndDate = new Date(book.endTime);
                let compareBookStartDate = new Date(result[i].startTime);
                let compareBookEndDate = new Date(result[i].endTime);

                if (newBookStartDate.getTime() > compareBookStartDate.getTime() && newBookStartDate.getTime() < compareBookEndDate.getTime()) {
                    bool.push(false);
                } else if (newBookEndDate.getTime() > compareBookStartDate.getTime() && newBookEndDate.getTime() < compareBookEndDate.getTime() || newBookEndDate.getTime() > compareBookEndDate.getTime()) {
                    bool.push(false);
                } else if (newBookStartDate.getTime() >= compareBookStartDate.getTime() && newBookEndDate.getTime() >= compareBookEndDate.getTime()) {
                    bool.push(false);
                }else if (newBookStartDate.getTime() == compareBookEndDate.getTime()) {
                    bool.push(true);
                } else {
                    bool.push(true);
                }
            }
            if(bool.find(element => element == false) != undefined){

                finalBool = false
            }else{

                finalBool = true
            }
        } else {
            finalBool = true;
        }
    });
    return finalBool;
}

app.get('/', (req, res) => {
    collection.find({}).then((content) => res.send(content));
})

app.post('/', async (req, res) => {
    let bookToAdd = new book(req.headers.starttime, req.headers.endtime);
    if (await isAvailable(bookToAdd)) {
        collection.insert(bookToAdd).then((book) => {
            collection.find().then((all) => {
                res.send(all)
            })
        })
    } else {
        res.status(500);
        res.send({ "message": "I'm sorry, the boat at that time is already booked" })
    }
})

app.delete('/', (req, res) => {
    collection.remove({ _id: req.headers.id })
        .then(collection.find({}).then((docs) => {
            res.send(docs)
        }))
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})