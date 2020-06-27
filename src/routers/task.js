const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    
    //const newTask = new Task(req.body)
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await newTask.save()
        res.status(201).send(newTask)
    }
    catch(error) {
        res.status(400).send(error)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0 
// GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.IsCompleted = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',// Foreign Key of Users
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            res.status(404).send('Data Not found')
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'IsCompleted']
    const isOk = updates.every((update) => allowedUpdates.includes(update))
    if (!isOk) {
        return res.status(400).send('Bad Request or Invalid Body')
    }
    try {
        const taskUpdate = await Task.findOne({_id: req.params.id, owner: req.user._id})
        //const taskUpdate = await Task.findById(req.params.id);
        //const taskUpdate = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!taskUpdate) {
            return res.status(400).send('Data Not found')
        }
        updates.forEach((update) => taskUpdate[update] = req.body[update]);
        await taskUpdate.save();
        res.send(taskUpdate)
    }
    catch(error) {
        res.status(500).send(error)
    }

})

router.delete('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});
        if (!task) {
            return res.status(400).send('Invalid Data')
        }
        res.send(task)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router