const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")

const app = require('../src/app')
const User = require('../src/models/user')

const userOneID = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneID,
    name: "User One Ieva",
    email: "ieva.aleksandravica+userone@gmail.com",
    password: "userOneIeva123",
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

afterAll(() => {
    mongoose.connection.close();
})

test('Should sign up a new user', async () => {
    await request(app).post('/users')
        .send({
            name: "Test User 23",
            email: "ieva.aleksandravica+test23Node@gmail.com",
            password: "testUser1232"
        })
        .expect(201)
}
)

test('Should log in existing user', async () => {
    await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }
        )
        .expect(200)
})

test('Should not log in non-existent user', async () => {
    await request(app).post('/users/login')
        .send({
            email: "ieva.aleksandravica@gmail.com",
            password: "appleapple"
        })
        .expect(404)
})

test('Should get profile for existing user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(202)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})