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
              <span>${todo.task}</span>
              <div>
                  <button class="complete">${todo.completed ? 'Uncomplete' : 'Complete'}</button>
                  <button class="edit">${todo.completed ? '' : 'Edit'}</button>
                  <button class="delete">${todo.completed ? '' : 'Delete'}</button>
              </div>
          `;
          todoList.appendChild(li);

          // Handle task completion or uncompletion
          li.querySelector('.complete').addEventListener('click', (e) => {
              e.stopPropagation(); // Prevent event bubbling to parent elements
              if (todos[index].completed) {
                  // Uncomplete task
                  todos[index].completed = false;
                  li.querySelector('.delete').textContent = 'Delete'; // Change text of delete button
              } else {
                  // Complete task
                  todos[index].completed = true;
                  li.querySelector('.delete').textContent = ''; // Hide delete button
              }
              saveTodos(todos);
              renderTodos(); // Re-render the tasks
          });

          // Handle task editing
          const editButton = li.querySelector('.edit');
          if (!todo.completed) {
              editButton.addEventListener('click', () => {
                  const span = li.querySelector('span');
                  if (span.isContentEditable) {
                      span.contentEditable = false;
                      editButton.textContent = 'Edit';
                      todos[index].task = span.innerText;
                      saveTodos(todos);
                  } else {
                      span.contentEditable = true;
                      span.focus();
                      editButton.textContent = 'Save';
                  }
              });
          } else {
              editButton.style.display = 'none'; // Hide the edit button for completed tasks
          }

          // Handle task deletion
          const deleteButton = li.querySelector('.delete');
          if (!todo.completed) {
              deleteButton.addEventListener('click', () => {
                  todos.splice(index, 1);
                  saveTodos(todos);
                  renderTodos(); // Re-render the tasks
              });
          } else {
              deleteButton.style.display = 'none'; // Hide the delete button for completed tasks
          }

          // Save task on blur
          li.querySelector('span').addEventListener('blur', () => {
              if (editButton.textContent === 'Save') {
                  const newTask = li.querySelector('span').innerText;
                  todos[index].task = newTask;
                  saveTodos(todos);
                  renderTodos();
              }
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
