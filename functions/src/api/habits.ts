import { Request, Response } from 'express';
import { db } from '../util/admin';

interface Todo {
  todoId: string;
  title: string;
  body: string;
  createdAt: string;
  username: string;
}

type Todos = Array<Todo>;

interface UserRequest extends Request {
  user: {
    username: string;
  };
}

export const getAllTodos = (request: UserRequest, response: Response) => {
  db.collection('todos')
    .where('username', '==', request.user.username)
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      const todos: Todos = [];

      data.forEach(doc => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          username: doc.data().username,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });

      return response.json(todos);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

export const getOneTodo = (request: UserRequest, response: Response) => {
  db.doc(`/todos/${request.params.todoId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response.status(404).json({
          error: 'Todo not found',
        });
      }
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({ error: 'UnAuthorized' });
      }
      const TodoData = doc.data();
      TodoData.todoId = doc.id;
      return response.json(TodoData);
    })
    .catch(error => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

export const postOneTodo = (request: UserRequest, response: Response) => {
  if (request.body.body.trim() === '') {
    return response.status(400).json({ body: 'Must not be empty' });
  }

  if (request.body.title.trim() === '') {
    return response.status(400).json({ title: 'Must not be empty' });
  }

  const newTodoItem = {
    id: '',
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
    username: request.user.username,
  };

  db.collection('todos')
    .add(newTodoItem)
    .then(doc => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return response.json(responseTodoItem);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: 'Something went wrong' });
    });
};

export const deleteTodo = async (request: UserRequest, response: Response) => {
  try {
    const todo = await db.collection('todos').doc(request.params.todoId);

    const todoDoc = await todo.get();

    if (!todoDoc.exists) {
      return response.status(404).json({ error: 'Todo not found' });
    }

    if (todoDoc.data().username !== request.user.username) {
      return response.status(403).json({ error: 'UnAuthorized' });
    }

    await todo.delete();

    return response.json({ message: 'Delete successful' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.code });
  }
};

export const editTodo = (request: Request, response: Response) => {
  if (request.body.todoId || request.body.createdAt) {
    response.status(403).json({ message: 'Not allowed to edit' });
  }

  const todo = db.collection('todos').doc(request.params.todoId);

  todo
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
