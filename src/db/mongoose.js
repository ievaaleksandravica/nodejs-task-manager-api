const mongoose = require('mongoose');
const { stringify } = require('querystring');

mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true }
)

// const me = new User({ name: 'Ieva  ', email: 'EEEEmple@example.com  ', password: '   23b' })
// me.save().then((response) => {
//     console.log(`User created: ${response}`)
// }).catch((error) => {
//     console.log(`Error: ${error}`)
// })


// const arbeitsamt = new Task({
//     description: 'This is fun   '
// }).save().then((response) => {
//     console.log(`New task was created: ${response}`)
// }).catch((error) => {
//     console.log(`Task could not be created: ${error}`)
// })