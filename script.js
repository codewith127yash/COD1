document.addEventListener('DOMContentLoaded', () => {
  const todoList = document.getElementById('todo-list');
  const newTaskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task');
  const clearAllButton = document.getElementById('clear-all');

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
  }

  function saveTasks() {
    const tasks = Array.from(todoList.children).map(li => ({
      text: li.querySelector('.task-text').textContent,
      completed: li.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function addTaskToDOM(text, completed = false) {
    const newListItem = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.classList.add('task-text');

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(newListItem));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      newListItem.style.animation = 'fadeOut 0.5s';
      newListItem.addEventListener('animationend', () => {
        todoList.removeChild(newListItem);
        saveTasks();
      });
    });

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
      newListItem.classList.toggle('completed');
      saveTasks();
    });

    newListItem.appendChild(checkbox);
    newListItem.appendChild(taskText);
    newListItem.appendChild(actionsDiv);
    newListItem.classList.toggle('completed', completed);

    todoList.appendChild(newListItem);
  }

  function addTask() {
    const newTaskValue = newTaskInput.value.trim();
    if (newTaskValue) {
      addTaskToDOM(newTaskValue);
      saveTasks();
      newTaskInput.value = ''; // Clear the input field after adding a task
    }
  }

  function editTask(taskItem) {
    const taskText = taskItem.querySelector('.task-text');
    const newText = prompt('Edit task:', taskText.textContent);
    if (newText) {
      taskText.textContent = newText;
      saveTasks();
    }
  }

  addTaskButton.addEventListener('click', addTask);
  clearAllButton.addEventListener('click', () => {
    Array.from(todoList.children).forEach(item => {
      item.style.animation = 'fadeOut 0.5s';
      item.addEventListener('animationend', () => {
        todoList.innerHTML = ''; // Clear all list items after fade out
        saveTasks();
      });
    });
  });

  loadTasks();
});
