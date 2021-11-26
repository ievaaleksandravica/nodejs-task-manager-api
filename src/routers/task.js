const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const taskNew = await task.save()
        res.status("201").send(taskNew)
    } catch (error) {
        res.status("400").send(error)
    }
    // task.save().then((response) => {
    //     res.status("201").send(response)
    // }).catch((error) => {
    //     res.status("400").send(error)
    // })
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = { owner: req.user._id }
    const sorting = {}
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sorting[parts[0]] = parts[1] === "desc" ? -1 : 1
    }

    try {
        const tasks = await Task.find(match).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sorting)
        if (tasks.length === 0) {
            return res.status('404').send(req.user.tasks)
        }
        return res.status(202).send(tasks)
    } catch (error) {
        res.send(error)
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
    _id = req.params.id
    try {
        //task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status('404').send(task)
        }
        res.send(task)
    } catch (error) {
        res.status('500').send(error)
    }
    // Task.findById(_id).then((response) => {
    //     if (!response) {
    //         return res.status('404').send(response)
    //     }
    //     res.send(response)
    // }).catch((error) => {
    //     res.status('500').send(error)
    // })

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const task_id = req.params.id
    const allowedTaskUpdates = ['description', 'completed']
    const providedUpdates = Object.keys(req.body)
    try {
        const task = await Task.findOne({ _id: task_id, owner: req.user._id })
        const allowed = providedUpdates.every((update) => allowedTaskUpdates.includes(update))
        if (!allowed) {
            return res.status('400').send({ error: "wrong update key" })
        }
        providedUpdates.forEach((update) => {
            task[update] = req.body[update]
        })
        task.save()
        // const task = await Task.findByIdAndUpdate(task_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status('404').send({ error: 'no task found' })
        }
        res.send(task)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status('400').send({ error: 'validation error' })
        }
        res.status('500').send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id })
        if (!task) {
            return res.status('404').send({ error: 'no task id found' })
        }
        res.send(task)
    } catch (error) {
        res.status('505').send(error)
    }
})

module.exports = router