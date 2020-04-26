import { Request, Response } from 'express'
import firebase from 'firebase'
import { db } from '../util/admin'
import { config } from '../util/config'
import { validateLoginData, validateSignUpData } from '../util/validators'

interface UserRequest extends Request {
  user: {
    username: string
  }
}

firebase.initializeApp(config)

// SignUp
export const signUpUser = async (request: Request, response: Response) => {
  const newUser = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    phoneNumber: request.body.phoneNumber,
    country: request.body.country,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    username: request.body.username,
  }

  const { valid, errors } = validateSignUpData(newUser)

  if (!valid) return response.status(400).json(errors)

  let token, userId

  try {
    const userDoc = await db.doc(`/users/${newUser.username}`).get()

    if (userDoc.exists) return response.status(400).json({ username: 'this username is already taken' })

    const createdUser = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)

    userId = createdUser.user.uid

    token = await createdUser.user.getIdToken()

    const userCredentials = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      phoneNumber: newUser.phoneNumber,
      country: newUser.country,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId,
    }

    await db.doc(`/users/${newUser.username}`).set(userCredentials)
    return response.status(201).json({ token })
  } catch (err) {
    console.error(err)

    switch (err.code) {
      case 'auth/email-already-in-use':
        return response.status(400).json({ email: 'Email already in use' })
      case 'auth/weak-password':
        return response.status(400).json({ password: 'Password should be at least 6 characters' })
      default:
        return response.status(500).json({ general: 'Something went wrong, please try again' })
    }
  }
}

// Login
export const loginUser = (request: Request, response: Response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  }

  const { valid, errors } = validateLoginData(user)
  if (!valid) return response.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => (data.user ? data.user.getIdToken() : null))
    .then(token => response.json({ token }))
    .catch(error => {
      console.error(error)
      return response.status(403).json({ general: 'wrong credentials, please try again' })
    })
}

export const getUserDetail = async (request: UserRequest, response: Response) => {
  const userData: any = {}

  try {
    const user = await db.doc(`/users/${request.user.username}`).get()

    if (user.exists) {
      userData.userCredentials = user.data()
      return response.json(userData)
    }
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: error.code })
  }
}

export const updateUserDetails = async (request: UserRequest, response: Response) => {
  try {
    await db
      .collection('users')
      .doc(`${request.user.username}`)
      .update(request.body)

    response.json({ message: 'Updated successfully' })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Cannot Update the value',
    })
  }
}
