"use strict";

const firstName = document.getElementById("first_name");
const lastName = document.getElementById("last_name");
const hasChildren = document.getElementById("has_children");
const className = document.getElementById("work_select");
const workerForm = document.getElementById("worker_form");
const workerAge = document.getElementById("age");
const addSkillBtn = document.getElementById("add_skill");
const skillsBlock = document.querySelector(".skills-block");
const skillInput = document.getElementById("skill");
const workSelect = document.getElementById("work_select");
const workerTable = document
  .querySelector("#worker-table")
  .getElementsByTagName("tbody")[0];

const workerData = JSON.parse(localStorage.getItem("workerData")) || [];

class Person {
  constructor(name, surname, age, children) {
    this._name = name;
    this._surname = surname;
    this._age = age;
    this._children = children;
  }

  get name() {
    return this._name;
  }

  get surname() {
    return this._surname;
  }

  get age() {
    return this._age;
  }

  get children() {
    return this._children;
  }
}

class Worker extends Person {
  constructor(name, surname, age, children, skills = [], work) {
    super(name, surname, age, children);
    this._skills = skills;
    this._work = work;
  }

  get skills() {
    return this._skills;
  }

  set skills(str) {
    this._skills.push(str);
  }

  get work() {
    return this._work;
  }
}

class Driver extends Worker {
  constructor(name, surname, age, children, skills, work) {
    super(name, surname, age, children, skills, work);
  }
}

class Mechanic extends Worker {
  constructor(name, surname, age, children, skills, work) {
    super(name, surname, age, children, skills, work);
  }
}

function setDataToLocalStorage(data) {
  console.log(data);
  localStorage.setItem(
    "workerData",
    JSON.stringify(data, (_, value) => {
      // Убираем все _ из LS.
      return value && typeof value === "object" && !Array.isArray(value)
        ? Object.fromEntries(
            Object.entries(value).map(([key, value]) => [
              key.replace(/^_/, ""),
              value,
            ])
          )
        : value;
    })
  );
}

function loadWorkersFromLocalStorage() {
  workerData.forEach((item) => {
    console.log(item);
    return addWorkerToTable(item);
  });
}

function addWorkerToTable(worker) {
  const row = document.createElement("tr");
  row.innerHTML = `
		<td>${worker.name}</td>
		<td>${worker.surname}</td>
		<td>${worker.children ? "Да" : "Нет"}</td>
		<td>${worker.age}</td>
		<td>${worker.skills}</td>
		<td>${worker.work}</td>
		<td><button class='btn_delete'>Удалить</button></td>
		`;

  row.querySelector(".btn_delete").addEventListener("click", deleteWorker);
  workerTable.appendChild(row);
}

function deleteWorker(event) {
  event.preventDefault();
  const row = event.target.closest("tr");
  const index = Array.from(workerTable.children).indexOf(row);
  workerData.splice(index, 1);
  setDataToLocalStorage(workerData);
  row.remove();
}

function crateWorkerObject(
  workName,
  name,
  surname,
  age,
  children,
  skills,
  work
) {
  if (workName === "Механик") {
    return new Mechanic(name, surname, age, children, skills, work);
  }

  if (workName === "Водитель") {
    return new Driver(name, surname, age, children, skills, work);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const skillsArr = [];
  console.log(skillsBlock.children);
  Array.from(skillsBlock.children).forEach((item) =>
    skillsArr.push(item.value)
  );

  const worker = crateWorkerObject(
    className.value,
    firstName.value,
    lastName.value,
    workerAge.value,
    hasChildren.checked,
    skillsArr,
    workSelect.value
  );

  if (firstName.value && lastName.value && !isNaN(workerAge.value)) {
    addWorkerToTable(worker);
    workerForm.reset();
    workerData.push(worker);
    setDataToLocalStorage(workerData);
  } else {
    alert("Заполните поля");
  }
}

addSkillBtn.addEventListener("click", () => {
  const input = skillInput.cloneNode(true);
  input.value = "";
  skillsBlock.prepend(input);
});

workerForm.addEventListener("submit", handleFormSubmit);

loadWorkersFromLocalStorage();
