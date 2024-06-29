document.addEventListener('deviceready', onDeviceReady, false);

let tasks = [];

function onDeviceReady() {
    document.getElementById('plannerForm').addEventListener('submit', addTask);
    document.getElementById('showTasks').addEventListener('click', showTasksForWeek);
}

function addTask(event) {
    event.preventDefault();
    
    let taskInput = document.getElementById('task');
    let dateInput = document.getElementById('date');
    
    if (taskInput.value && dateInput.value) {
        tasks.push({ task: taskInput.value, date: dateInput.value, completed: false });
        taskInput.value = '';
        dateInput.value = '';
        alert('Task added successfully!');
        showTasksForWeek(); // Update task list after adding a new task
    } else {
        navigator.notification.alert('Please enter a task and a date.', null, 'Input Error', 'OK');
    }
}

function showTasksForWeek() {
    let weekInput = document.getElementById('week').value;
    if (!weekInput) {
        alert('Please select a week.');
        return;
    }
    
    let [year, week] = weekInput.split('-W');
    let firstDayOfWeek = getDateOfISOWeek(week, year);
    let lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        let taskDate = new Date(task.date);
        if (taskDate >= firstDayOfWeek && taskDate <= lastDayOfWeek) {
            let li = document.createElement('li');
            li.textContent = `${task.task} - ${task.date}`;
            
            let completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                showTasksForWeek(); // Update task list after marking task as complete/undo
            });
            
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                showTasksForWeek(); // Update task list after deleting a task
            });
            
            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        }
    });
}

function getDateOfISOWeek(week, year) {
    let simple = new Date(year, 0, 1 + (week - 1) * 7);
    let dow = simple.getDay();
    let ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}
