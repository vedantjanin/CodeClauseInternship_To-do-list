const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

const fetchTasks = async () => {
  try {
    const res = await fetch('/tasks');
    const tasks = await res.json();
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};"
              onclick="toggleTask(${task.id})">${task.title}</span>
        <div class="actions">
          <button onclick="editTask(${task.id}, \`${task.title}\`)">✏️</button>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
};

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    taskInput.value = '';
    fetchTasks();
  } catch (err) {
    console.error('Error adding task:', err);
  }
});

const editTask = (id, currentTitle) => {
  const newTitle = prompt('Edit task:', currentTitle);
  if (newTitle && newTitle.trim()) {
    fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    }).then(fetchTasks);
  }
};

const deleteTask = (id) => {
  fetch(`/tasks/${id}`, {
    method: 'DELETE'
  }).then(fetchTasks);
};

const toggleTask = (id) => {
  fetch(`/tasks/${id}/toggle`, {
    method: 'PUT'
  }).then(fetchTasks);
};

fetchTasks();
