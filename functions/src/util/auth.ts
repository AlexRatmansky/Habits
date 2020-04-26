import { Request, Response } from 'express';
import { admin, db } from './admin';

export interface UserRequest extends Request {
  user: {
    country?: string;
    createdAt?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    uid?: string;
    username?: string;
  };
}

export const auth = async (request: UserRequest, response: Response, next) => {
  let idToken;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
    idToken = request.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return response.status(403).json({ error: 'Unauthorized' });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      request.user = decodedToken;
      return db
        .collection('users')
        .where('userId', '==', request.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      request.user.username = data.docs[0].data().username;
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token', err);
      return response.status(403).json(err);
    });
};
