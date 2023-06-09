/* بسم الله الرحمن الرحيم*/

// set time  with timeZone in browser

let time, dateTime, cairoDate;
function clock() {
  let timeZone = new Date();
  let utc = timeZone.getTime() + timeZone.getTimezoneOffset() * 60000;
  cairoDate = new Date(utc + 3600000 * +3);
  (hours = cairoDate.getHours()),
    (minutes = cairoDate.getMinutes()),
    (seconds = cairoDate.getSeconds());
  let amOrPm = hours >= 12 && hours < 24 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? `0${hours}` : hours;
  time = `${hours} : ${minutes < 10 ? `0${minutes}` : minutes} : ${
    seconds < 10 ? `0${seconds}` : seconds
  } ${amOrPm}`;
  document.querySelector(".time").textContent = time;
}
clock();
// set date in browser
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function getDate() {
  document.querySelector(".big-header-day").textContent =
    days[cairoDate.getDay()];
  dateTime = `${
    cairoDate.getDate() < 10 ? `0${cairoDate.getDate()}` : cairoDate.getDate()
  } / ${
    cairoDate.getMonth() + 1 < 10
      ? `0${cairoDate.getMonth() + 1}`
      : cairoDate.getMonth() + 1
  } / ${cairoDate.getFullYear()}`;
  document.querySelector(".dataTime").textContent = dateTime;
}

window.onload = (_) => {
  setInterval(clock, 500);
  setInterval(getDate, 500);
};

let menu = document.querySelector("nav"),
  myModal = document.querySelector(".myModal"),
  myModal2 = document.querySelector(".myModal2"),
  overlay = document.querySelector(".overlay"),
  inputUserName = document.getElementById("UserName"),
  editUserName = document.getElementById("editUserName"),
  inputTaskTitle = document.getElementById("inputTaskTitle"),
  editTaskTitle = document.getElementById("editTaskTitle"),
  inputTaskContent = document.getElementById("inputTaskContent"),
  editTaskContent = document.getElementById("editTaskContent"),
  formAdd = document.querySelector("#formAdd"),
  formEdit = document.querySelector("#formEdit"),
  weeks = document.querySelectorAll(".card-body.parent"),
  options = document.querySelectorAll(".form-list .option"),
  taskDay = document.querySelector(".dropdown .value"),
  dropdown = document.querySelector(".dropdown"),
  FormList = document.querySelector(".form-list"),
  btnAdd = document.querySelectorAll(".addNew"),
  closeMenu = document.querySelector("#close-menu"),
  closeModal = document.querySelector("#close-modal"),
  closeModal2 = document.querySelector("#close-modal2"),
  deleteTask = document.querySelector(".deleteTask"),
  editTask = document.querySelector(".editTask");

// close menu tab and modal
closeMenu.onclick = (_) => {
  inputUserName.value = "";
  inputTaskTitle.value = "";
  inputTaskContent.value = "";
  removeActiveClass(menu);
};
closeModal2.onclick = (_) => {
  removeActiveClass(myModal2);
};
closeModal.onclick = (_) => {
  inputUserName.value = "";
  inputTaskTitle.value = "";
  inputTaskContent.value = "";
  removeActiveClass(myModal);
};
overlay.onclick = (_) => {
  inputUserName.value = "";
  inputTaskTitle.value = "";
  inputTaskContent.value = "";
  removeActiveClass(menu);
  removeActiveClass(myModal);
  removeActiveClass(myModal2);
};

let allTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

getDataFromLocalStorage(allTasks);

removeTaskNote();

taskDay.setAttribute("data-day", days[new Date().getDay()].toLowerCase());

checker(options);

handel(btnAdd);

editingAnimation();

editTaskNote();

formAdd.addEventListener("submit", mainAddingFN);

formEdit.addEventListener("submit", mainEditingFN);

dragDrop();
let drag = null;
// main function in add form submit
function mainAddingFN() {
  removeActiveClass(menu);
  let user = {
    id: Date.now(),
    day: taskDay.dataset.day,
    date: dateTime,
    time: time,
    name: inputUserName.value,
    title: inputTaskTitle.value,
    content: inputTaskContent.value,
  };
  allTasks.push(user);
  dataHandel(
    taskDay.dataset.day,
    Date.now(),
    inputTaskTitle.value,
    inputTaskContent.value,
    dateTime,
    time,
    inputUserName.value
  );
  addDataToLocalStorage(allTasks);
  inputUserName.value = "";
  inputTaskTitle.value = "";
  inputTaskContent.value = "";
  window.location.reload();
}
//main function editing from formEdit
function mainEditingFN() {
  removeActiveClass(myModal);
  let targetEditingId = myModal.dataset.editid;
  allTasks.forEach((task) => {
    if (task.id == +targetEditingId) {
      task.name = editUserName.value;
      task.title = editTaskTitle.value;
      task.content = editTaskContent.value;
      task.edit = true;
    }
    addDataToLocalStorage(allTasks);
    window.location.reload();
  });
}
// function handel data select box
options.forEach((option) => {
  option.addEventListener("click", (_) => {
    dropdown.classList.toggle("open");
    FormList.classList.remove("select");
    taskDay.textContent = document.querySelector(".option.active").textContent;
    taskDay.dataset.day = document
      .querySelector(".option.active")
      .textContent.toLowerCase();
  });
});
// task day in form arrow && toggle menu
taskDay.onclick = (_) => {
  FormList.classList.toggle("select");
  dropdown.classList.toggle("open");
};
// function to add active class && select item
function handel(modalOrMenu) {
  modalOrMenu.forEach((btn) => {
    btn.onclick = (_) => {
      handelWeekDayInSelectedBox(btn.dataset.save);
      addActiveClass(menu);
    };
  });
}
// function controls of select box
function handelWeekDayInSelectedBox(btn) {
  options.forEach((option) => {
    option.classList.remove("active");
    option.removeAttribute("selected");
    if (option.classList.contains(btn)) {
      option.classList.add("active");
      option.setAttribute("selected", true);
      taskDay.textContent =
        document.querySelector(".option.active").textContent;
      taskDay.dataset.day = document
        .querySelector(".option.active")
        .textContent.toLowerCase();
    }
  });
}
// function to remove the task from clipboard
function removeTaskNote() {
  document.querySelectorAll(".close").forEach((card) => {
    card.addEventListener("click", (e) => {
      toggleModalEdit(myModal2, e);
      addActiveClass(myModal2);
      deleteTask.onclick = (_) => {
        let deletedNote = card.closest(".task");
        deletedNote.remove();
        allTasks = allTasks.filter((acc) => acc.id != +deletedNote.dataset.id);
        addDataToLocalStorage(allTasks);
        removeActiveClass(myModal2);
        window.location.reload();
      };
      editTask.onclick = (_) => {
        toggleModalEdit(myModal, e);
        removeActiveClass(myModal2);
      };
    });
  });
}
// function to edit the task from clipboard
function editTaskNote() {
  document.querySelectorAll(".edit").forEach((card) => {
    card.addEventListener("click", function (e) {
      toggleModalEdit(myModal, e);
    });
  });
}
// toggle Modal Edit
function toggleModalEdit(modal, e) {
  let editNote = e.target.closest(".task");
  modal.setAttribute("data-editid", editNote.dataset.id);
  addActiveClass(modal);
  allTasks.forEach((task) => {
    if (task.id == editNote.dataset.id) {
      editUserName.value = task.name;
      editTaskTitle.value = task.title;
      editTaskContent.value = task.content;
    }
  });
}
// function remove Active Class from modal && menu
function removeActiveClass(item) {
  overlay.classList.remove("active");
  item.classList.remove("active");
}
// function add Active Class from modal && menu
function addActiveClass(item) {
  overlay.classList.add("active");
  item.classList.add("active");
}
// function add && remove
function checker([...params]) {
  params.forEach((param) => {
    param.addEventListener("click", function () {
      params.forEach((param) => {
        param.classList.remove("active");
        this.classList.add("active");
      });
    });
  });
}
// add && update from localStorage
function addDataToLocalStorage(arrOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrOfTasks));
  document.querySelector(".taskLength span").textContent = arrOfTasks.length;
  getEditTasksLength(arrOfTasks);
}
function getEditTasksLength(tasks) {
  let arr = [];
  tasks.forEach((task, i) => {
    if (task.edit) {
      arr.push(task);
      document.querySelector(".taskEditLength span").textContent = arr.length;
    }
  });
}
// checking from  day  on week
function getDataFromLocalStorage(allTasks) {
  let json = JSON.parse(localStorage.getItem("tasks"));
  if (localStorage.getItem("tasks")) {
    json.forEach((obj) => {
      if (obj.day === "saturday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
      if (obj.day === "sunday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
      if (obj.day === "monday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
      if (obj.day === "tuesday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
      if (obj.day === "wednesday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
      if (obj.day === "thursday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
      if (obj.day === "friday")
        dataHandel(
          obj.day,
          obj.id,
          obj.title,
          obj.content,
          obj.date,
          obj.time,
          obj.name
        );
    });
    getEditTasksLength(json);
  }
  document.querySelector(".taskLength span").textContent = allTasks.length;
}
// function creating tasks in clipboard
function dataHandel(target,taskId,taskTitle,taskContent,taskDate,taskTime,userName) {
  document.getElementById(target).innerHTML += `
  <div class="card task" data-id="${taskId}" draggable="true">
    <div class="card-header d-flex justify-content-between align-items-center" >
    <h5 class="card-title">${taskTitle}</h5>
      <div class="d-flex">
        <div class="edit" >
          <i class="fa-regular fa-pen-to-square"></i>
        </div>
        <div class="close">
          <i class="fa-solid fa-xmark "></i>
        </div>
      </div>
    </div>
    <div class="card-body text-start" >
      <small class="task-date"><span class="task-date-date" >Date : <span>${taskDate}</span></span> <span class="task-date-time" >Time : <span>${taskTime}</span></span></small>
      <small class="task-date"><span class="task-date-date" >Task to : <span>${userName}</n></small>
      <p class="task-content">${taskContent}</p>
    </div>
  </div>
  `;
}
// function for set different color to edited task
function editingAnimation() {
  if (localStorage.getItem("tasks")) {
    JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
      if (task.edit) {
        document.querySelectorAll(".task").forEach((taskBody) => {
          if (taskBody.getAttribute("data-id") == task.id)
            taskBody.classList.add("edited");
        });
      }
    });
  }
}
// function to drag and drop tasks  and handel data in it
function dragDrop() {
  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("dragstart", (_) => {
      drag = task;
    });
    task.addEventListener("dragend", (_) => {
      drag = null;
    });
  });
  weeks.forEach((week) => {
    week.addEventListener("dragover", (e) => {
      e.preventDefault();
      week.parentElement.style.background = "rgba(255, 255, 255, 0.8)";
    });
    week.addEventListener("dragleave", (_) => {
      week.parentElement.style.background = "rgba(255, 255, 255, 0.7)";
    });
    week.addEventListener("drop", (_) => {
      allTasks.forEach((task) => {
        if (task.id == drag.dataset.id) {
          task.day = week.id;
          addDataToLocalStorage(allTasks);
        }
      });
      week.parentElement.style.background = "rgba(255, 255, 255, 0.7)";
      week.prepend(drag);
    });
  });
}


let myAlert = document.querySelector(".myAlert");
fetch("https://type.fit/api/quotes")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    HandelQuotes(data);
  });

function HandelQuotes(data) {
  let stop = 10000;
  let time = 60000 ;
  function autoChange() {
  myAlert.classList.add("isVisible");
  addDataAlert(data)
  setTimeout(autoDelete, stop)
  }
  window.onload = setInterval(autoChange, time)
  function addDataAlert(data) {
    let random = data[Math.trunc(Math.random() * data.length)]
    myAlert.querySelector("h2 span").textContent = random.text ;
    myAlert.querySelector("small span").textContent = random.author == null ?"Abd ElKader Mohamed" : random.author ;
  }
  function autoDelete() {myAlert.classList.remove("isVisible");}
}
