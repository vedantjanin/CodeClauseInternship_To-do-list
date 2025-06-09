const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.static('public'));


app.use(express.json());

const FILE_PATH = './tasks.json';

// Utility to read tasks
function readTasks() {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
}

// Utility to write tasks
function writeTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title,
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.json({ message: 'Task added', task: newTask });
});

// Edit a task
app.put('/tasks/:id/toggle', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);

  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  writeTasks(updatedTasks);
  res.json({ message: 'Task status toggled' });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = parseInt(req.params.id);
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    writeTasks(filteredTasks);
    res.json({ message: 'Task deleted' });
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
