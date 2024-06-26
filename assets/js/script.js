// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // Create a new div element for the task card
  let taskCard = $("<div>").addClass("task-card").attr("id", "task-" + task.id);

  // Create elements for task details (title, description, due date)
  let title = $("<h3>").text(task.title);
  let description = $("<p>").text(task.description);
  let dueDate = $("<p>").text("Due Date: " + task.dueDate);

  // Add task details to the task card
  taskCard.append(title, description, dueDate);

  // Add a delete button to the task card
  let deleteBtn = $("<button>").text("Delete").addClass("delete-btn");
  taskCard.append(deleteBtn);

  // Return the task card element
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear the existing task list to prevent duplicates
  $(".task-list").empty();

  // Loop through each task in the taskList array
  taskList.forEach(task => {
    // Create a task card for each task
    let taskCard = createTaskCard(task);

    if(task.dueDate && task.status !== 'done') {
  const now = dayjs();
  const taskDueDate = dayjs (task.dueDate, 'DD/MM/YYYY');
  if (now.isSame(taskDueDate, 'day')) {
    taskCard.addClass ('bg-warning text-white');
  } else if (now.isAfter(taskDueDate)) { 
    taskCard.addClass ('bg-danger text-white');
  }
}
    
    // Append the task card to the task list container
    // Separate cards to the correct status of completion
    if (task.status === "to-do") { 
      taskCard.addClass ("bg-primary")
      $("#todo-cards").append(taskCard)
      
    }

    if (task.status === "in-progress") {
      taskCard.addClass ("bg-warning") 
      $("#in-progress-cards").append(taskCard)
      
    }

    if (task.status === "done") { 
      taskCard.addClass ("bg-success") 
      $("#done-cards").append(taskCard)
      
    }

    // Make the task card draggable using jQuery UI
    taskCard.draggable({
      revert: "invalid",
      start: function (event, ui) {
        // Add a class when dragging starts for styling
        $(this).addClass("dragging");
      },
      stop: function (event, ui) {
        // Remove the dragging class when dragging stops
        $(this).removeClass("dragging");
      }
    });
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the task details from the form inputs
  let title = $("#task-title").val();
  let description = $("#task-description").val();
  let dueDate = $("#due-date").val();

  // Create a new task object with the input values and a unique ID
  let newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: dueDate
  };



  // Add the new task to the taskList array
  taskList.push(newTask);

  // Save the updated taskList to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();

  // Clear the form inputs after adding the task
  $("#task-title").val("");
  $("#task-description").val("");
  $("#due-date").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // Get the task card element that contains the delete button
  let taskCard = $(event.target).closest(".task-card");

  // Extract the task ID from the task card element
  let taskId = taskCard.attr("id").replace("task-", "");

  // Remove the task from the taskList array based on the task ID
  taskList = taskList.filter(task => task.id !== parseInt(taskId));

  // Save the updated taskList to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  console.log ("HandleDropIsRunning")
  // Get the task card element that was dropped
  let taskCard = ui.draggable;
  console.log ("TaskCard", taskCard)
  // Get the ID of the task from the task card element
  let taskId = taskCard.attr("id").replace("task-", "");
  console.log ("task-Id", taskId)

  // Determine the status lane where the task was dropped
  let statusLane = event.target.id; //$(this).attr("id");
  console.log (statusLane)

  // Update the progress state of the task based on the status lane
  let updatedTask = taskList.find(task => task.id === parseInt(taskId));
  if (updatedTask) { 
    console.log(updatedTask)
      updatedTask.status = statusLane; 
      console.log(updatedTask)
  } else { 
      console.error("Task not found in task list:", taskId);
      return;
  }


  // updatedTask.progress = statusLane;

  // Move the task card to the corresponding lane in the UI
  
  taskCard.detach().appendTo(`#${statusLane}-cards`);

   // Save the updated taskList to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();
} 

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Render the initial task list
  renderTaskList();

  // Add event listener for the form submission to add a new task
  $("#add-task-form").on("submit", handleAddTask);

  // Add event listener for the delete buttons in task cards
  $(".task-list").on("click", ".delete-btn", handleDeleteTask);

  // Make the status lanes droppable using jQuery UI droppable
  $(".lane").droppable({
    drop: handleDrop,
    accept: '.task-card'
  });
  //  // ? Make lanes droppable
  //  $('.lane').droppable({
  //   accept: '.draggable',
  //   drop: handleDrop,
  // });

  // Make the due date field a date picker using a library like jQuery UI Datepicker
  $("#due-date").datepicker();
});

// ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
// if (project.dueDate && project.status !== 'done') {
//   const now = dayjs();
//   const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');

//   //   // ? If the task is due today, make the card yellow. If it is overdue, make it red.
//   //   if (now.isSame(taskDueDate, 'day')) {
//   //     taskCard.addClass('bg-warning text-white');
//   //   } else if (now.isAfter(taskDueDate)) {
//   //     taskCard.addClass('bg-danger text-white');
//   //     cardDeleteBtn.addClass('border-light');
//   //   }
// }

// Add event listener for the form submission to add a new task from the modal
$("#addTaskForm").submit(function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  handleAddTask(event);
  $("#formModal").modal("hide"); // Close the modal after adding the task
});

// Update the handleAddTask function to create the task card and append it to the task list
function handleAddTask(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the task details from the form inputs
  let title = $("#taskTitle").val();
  let description = $("#taskDescription").val();
  let dueDate = $("#dueDate").val();
console.log (dueDate, typeof(dueDate))
  // Create a new task object with the input values and a unique ID
  let newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: dueDate,
    status: "to-do"
  }


  // Add the new task to the taskList array
  taskList.push(newTask);

  // Save the updated taskList to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();



  // Clear the form inputs after adding the task
  $("#taskTitle").val("");
  $("#taskDescription").val("");
  $("#dueDate").val("");

  // Close the modal after adding the task
  $("#formModal").modal("hide");
}

