const Record = require('../models/record');
const router = require('express').Router();

//Routes/Controller actions
//Index Route
router.get('/', async (req, res) => {
    try{
        res.status(200).json(await Record.find({ createdBy: req.user.uid }));
    } catch (error) {
        res.status(400).json({ message: 'bad request' });
    }
});

//Create Route
router.post('/', async (req, res) => {
    req.body.createdBy = req.user.uid;

    for(let key in req.body) {
      if(req.body[key] === '') {
        delete req.body[key];
      }
    }
    try {
        res.status(201).json(await Record.create(req.body))
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Delete Route
router.delete("/:id", async (req, res) => {
    try {
      res.status(200).json(await Record.findByIdAndDelete(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

//Update Route
router.put("/:id", async (req, res) => {
    try {
      res.status(200).json(await Record.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
        ));
    } catch (error) {
      res.status(400).json(error);
    }
  });

module.exports = router;