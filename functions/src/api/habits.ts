import { Request, Response } from 'express';
import { db } from '../util/admin';

interface Habit {
  habitId: string;
  title: string;
  body: string;
  createdAt: string;
  username: string;
}

type Habits = Array<Habit>;

interface UserRequest extends Request {
  user: {
    username: string;
  };
}

export const getAllHabits = (request: UserRequest, response: Response) => {
  db.collection('habits')
    .where('username', '==', request.user.username)
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      const habits: Habits = [];

      data.forEach(doc => {
        habits.push({
          habitId: doc.id,
          title: doc.data().title,
          username: doc.data().username,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });

      return response.json(habits);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

export const getOneHabit = (request: UserRequest, response: Response) => {
  db.doc(`/habits/${request.params.habitId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({
          error: 'Habit not found',
        });
      }
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({ error: 'UnAuthorized' });
      }
      const HabitData = doc.data();
      HabitData.habitId = doc.id;
      return response.json(HabitData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

export const postOneHabit = (request: UserRequest, response: Response) => {
  if (request.body.body.trim() === '') {
    return response.status(400).json({ body: 'Must not be empty' });
  }

  if (request.body.title.trim() === '') {
    return response.status(400).json({ title: 'Must not be empty' });
  }

  const newHabitItem = {
    id: '',
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
    username: request.user.username,
  };

  db.collection('habits')
    .add(newHabitItem)
    .then(doc => {
      const responseHabitItem = newHabitItem;
      responseHabitItem.id = doc.id;
      return response.json(responseHabitItem);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: 'Something went wrong' });
    });
};

export const deleteHabit = async (request: UserRequest, response: Response) => {
  try {
    const habit = await db.collection('habits').doc(request.params.habitId);

    const habitDoc = await habit.get();

    if (!habitDoc.exists) {
      return response.status(404).json({ error: 'Habit not found' });
    }

    if (habitDoc.data().username !== request.user.username) {
      return response.status(403).json({ error: 'UnAuthorized' });
    }

    await habit.delete();

    return response.json({ message: 'Delete successful' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.code });
  }
};

export const editHabit = (request: Request, response: Response) => {
  if (request.body.habitId || request.body.createdAt) {
    response.status(403).json({ message: 'Not allowed to edit' });
  }

  const habit = db.collection('habits').doc(request.params.habitId);

  habit
    .update(request.body)
    .then(() => {
      response.json({ message: 'Updated successfully' });
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};
