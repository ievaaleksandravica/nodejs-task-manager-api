const request = require('supertest')
const mongoose = require('mongoose')

const app = require('../src/app')
const User = require('../src/models/user')
const { userOneID, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(() => {
    mongoose.connection.close();
})

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: "Test User 23",
            email: "ieva.aleksandravica+test23Node@gmail.com",
            password: "testUser1232"
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.user.name).toBe('Test User 23')

    expect(response.body).toMatchObject({
        user: {
            name: "Test User 23",
            email: "ieva.aleksandravica+test23Node@gmail.com".toLowerCase()
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe("testUser1232")
})

test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    const user = await User.findById(userOneID)
    expect(response.body.token).toBe(user.tokens[1].token)
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

    const user = await User.findById(userOneID)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ "name": "Jana" })
        .expect(200)

    const user = await User.findById(userOneID)
    expect(user.name).toBe("Jana")
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ "nameee": "Jana" })
        .expect(400)
})

test('Should not signup user with invalid name', async () => {
    await request(app)
        .post('/users')
        .send({
            email: 'ieva.aleksandravica@gmail.com',
            password: 'validPPP'
        })
        .expect(400)
})

test('Should not signup user with invalid email', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Dummy Name',
            email: 'ieva.aleksandravica',
            password: 'validPPP'
        })
        .expect(400)
})

test('Should not signup user with invalid password', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Dummy Name',
            email: 'ieva.aleksandravica@gmail.com',
            password: 'password'
        })
        .expect(400)
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: "Ieva Aleksandravica"
        })
        .expect(401)

})

test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'banana'
        })
        .expect(400)

})

test('Should not update user with invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: ''
        })
        .expect(400)

})


test('Should not update user with invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: 'password'
        })
        .expect(400)

})


test('Should not delete user if unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)

})