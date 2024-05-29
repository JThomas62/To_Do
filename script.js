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
          <span class="${todo.completed ? 'completed-task' : ''}">${todo.task}</span>
          <div>
            <button class="complete">${todo.completed ? 'Uncomplete' : 'Complete'}</button>
            ${!todo.completed ? '<button class="edit">Edit</button>' : ''}
            <button class="delete">Delete</button>
          </div>
        `;
        todoList.appendChild(li);
  
        // Handle task completion or uncompletion
        li.querySelector('.complete').addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent event bubbling to parent elements
          todos[index].completed = !todos[index].completed;
          saveTodos(todos);
          renderTodos(); // Re-render the tasks
        });
  
        // Handle task editing
        const editButton = li.querySelector('.edit');
        if (editButton) {
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
        }
  
        // Handle task deletion
        const deleteButton = li.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
          todos.splice(index, 1);
          saveTodos(todos);
          renderTodos(); // Re-render the tasks
        });
  
        // Save task on blur
        li.querySelector('span').addEventListener('blur', () => {
          if (editButton && editButton.textContent === 'Save') {
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
  