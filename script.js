document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const todoList = document.getElementById('todo-list');

  // Retrieve tasks from local storage
  const getTodos = () => JSON.parse(localStorage.getItem('todos')) || [];
  // Save tasks to local storage
  const saveTodos = (todos) => localStorage.setItem('todos', JSON.stringify(todos));

  // Render tasks to the DOM
  const renderTodos = () => {
      todoList.innerHTML = '';
      const todos = getTodos();
      todos.forEach((todo, index) => {
          const li = document.createElement('li');
          li.className = todo.completed ? 'completed' : '';
          li.innerHTML = `
              <span contenteditable="true">${todo.task}</span>
              <div>
                  <button class="complete">${todo.completed ? 'Undo' : 'Complete'}</button>
                  <button class="edit">Edit</button>
                  <button class="delete">Delete</button>
              </div>
          `;
          todoList.appendChild(li);

          li.querySelector('.complete').addEventListener('click', () => {
              todos[index].completed = !todos[index].completed;
              saveTodos(todos);
              renderTodos();
          });

          li.querySelector('.edit').addEventListener('click', () => {
              const newTask = li.querySelector('span').innerText;
              todos[index].task = newTask;
              saveTodos(todos);
              renderTodos();
          });

          li.querySelector('.delete').addEventListener('click', () => {
              todos.splice(index, 1);
              saveTodos(todos);
              renderTodos();
          });

          li.querySelector('span').addEventListener('blur', () => {
              const newTask = li.querySelector('span').innerText;
              todos[index].task = newTask;
              saveTodos(todos);
          });
      });
  };

  // Add new task on form submission
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTask = taskInput.value.trim();
      if (newTask) {
          const todos = getTodos();
          todos.push({ task: newTask, completed: false });
          saveTodos(todos);
          taskInput.value = '';
          renderTodos();
      }
  });

  // Initial render of tasks
  renderTodos();
});
