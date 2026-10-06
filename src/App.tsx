import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';
import { User, Todo } from './types';

const typedUsers: User[] = usersFromServer;
const typedTodos: Todo[] = todosFromServer;

export const App = () => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [todos, setTodos] = useState<Todo[]>(typedTodos);

  // Додаємо стан для відстеження спроби сабміту (щоб показувати помилки, коли форма порожня)
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const getUser = (id: number): User | undefined => {
    return typedUsers.find(user => user.id === Number(id));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!title.trim() || userId === 0) {
      return;
    }

    const newTodo: Todo = {
      id: Math.max(...todos.map(t => t.id)) + 1,
      title: title.trim(),
      userId: Number(userId),
      completed: false,
    };

    setTodos([...todos, newTodo]);

    setTitle('');
    setUserId(0);
    setHasSubmitted(false);
  };

  // Перевірки на помилки для полів
  const hasTitleError = hasSubmitted && !title.trim();
  const hasUserError = hasSubmitted && userId === 0;

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title: </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            id="title"
          />
          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="select">User: </label>
          <select
            data-cy="userSelect"
            id="select"
            value={userId}
            onChange={e => setUserId(Number(e.target.value))}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {typedUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {hasUserError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} getUser={getUser} />
    </div>
  );
};
