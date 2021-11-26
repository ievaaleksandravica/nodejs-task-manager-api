const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const { ObjectID } = require('bson')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port: ${port}.`)
})



// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('File must be Word document.'))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })


// const main = async () => {
//     // const task = await Task.findById('619121adc50ec7a479ca6749')
//     // await task.populate('owner')
//     // console.log(task.owner)
//     const user = await User.findById('6191204eccb2029f7dbe5b2e')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()
// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     return {}
// }

// console.log(JSON.stringify(pet))


// app.use((req, res, next) => {
//     if (req.method === "GET") {
//         res.send({ error: "Get requests are disabled!" })
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send({ error: "Currently site is under maintenaince! We will be back soon." })
// })

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc1234' }, 'thisismynewcourse', { expiresIn: '7 days' })
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunction()
