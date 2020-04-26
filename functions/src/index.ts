import * as functions from 'firebase-functions'
import { deleteHabit, editHabit, getAllHabits, getOneHabit, postOneHabit } from './api/habits'
import { getUserDetail, loginUser, signUpUser, updateUserDetails } from './api/users'
import { auth } from './util/auth'

const app = require('express')()

// Users
app.post('/signup', signUpUser)
app.post('/login', loginUser)
app.get('/user', auth, getUserDetail)
app.post('/user', auth, updateUserDetails)

// Habits
app.get('/habits', auth, getAllHabits)
app.get('/habit/:habitId', auth, getOneHabit)
app.post('/habit', auth, postOneHabit)
app.post('/habit/:habitId', auth, editHabit)
app.delete('/habit/:habitId', auth, deleteHabit)

export const api = functions.region('europe-west3').https.onRequest(app)
