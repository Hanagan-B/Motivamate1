function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };

  fetch("http://localhost:8080/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  })
    .then(res => res.json())
    .then(savedTask => {
      renderTask(savedTask); // Show the new task in UI
      taskInput.value = "";
    })
    .catch(err => console.error("Error saving task:", err));
}
window.onload = function () {
  fetch("http://localhost:8080/api/tasks")
    .then(res => res.json())
    .then(tasks => tasks.forEach(renderTask))
    .catch(err => console.error("Error loading tasks:", err));
};
