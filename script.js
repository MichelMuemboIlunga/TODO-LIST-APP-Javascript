const pages = {
  main: "landing-page",
  signup: "signup-page",
  signin: "signin-page",
  dashboard: "dashboard",
  editAccount: "edit-account",
  editList: "edit-list",
};

// Function to navigate pages
function navigatePages(val) {
  let arr = Array.from(document.getElementsByTagName("section")); // Get array of section elements

  for (let el of arr) {
    // Cycle through section elements
    if (el.id === pages[val]) {
      // If the value is selected display the page
      el.style.display = "unset";
    } else {
      // If not selected remove from display
      el.style.display = "none";
    }
  }
}

// Set window.localStorage variable
let storage = window.localStorage;

// Set document elements variables
let signupForm = document.forms["sign-up"];
let signinForm = document.forms["sign-in"];
let alertMsg = document.getElementsByClassName("required-mssg");
let confirmMsg = document.getElementsByClassName("confirm-mssg");
let signupId = document.querySelector("#signUpForm");
let signinId = document.querySelector("#signInForm");

signupId.addEventListener(
  "submit",
  (e) => {
    // Action on submit signup form
    // Don't submit the form
    e.preventDefault();
    validateRegistry();
  },
  false
);

signinId.addEventListener(
  "submit",
  (e) => {
    // Action on submit signin form
    // Don't submit the form
    e.preventDefault();
    validateSubmission();
  },
  false
);

// Check if sign-up entries have been submitted
function signupEntries() {
  let fal = true; // Set default variable to true
  for (let i = 0; i < 5; i++) {
    let val = signupForm[i].value; // Cycle through the inputs values
    let checkedBox = signupForm[5].checked; // Check if the signup form checkbox has been checked

    if (val == "" || !checkedBox) {
      // If either the values are an empty string or the checkbox isn't checked
      alertMsg[0].style.display = "unset"; // Display the alert message
      confirmMsg[0].style.display = "none";
      fal = false; // Reassign default variable to false
    }
  }
  return fal; // Return the variable
}

// Check if sign-in entries have been submitted
function signinEntries() {
  let fls = true; // Set default variable to true
  for (let i = 0; i < 2; i++) {
    let valx = signinForm[i].value; // Cycle through the inputs values of signin form
    if (valx == "") {
      // If either of the values are an empty string
      [1].style.display = "unset"; // Display the alert message
      confirmMsg[1].style.display = "none";
      fls = false; // Reassign default variable to false
    }
  }
  return fls; // Return the variable
}

// Function to check for valid name
function validateName(name) {
  let reg = /^[a-zA-Z]*$/; // Regular expression to see if the name only contains letters
  return reg.test(name); // Return true if conditions match
}

// Check for valid email entry
function validateMail(mail) {
  // Regular expression to see if mail has the correct email format
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(mail); // Return true if conditions match
}

// Check for valid password
function validatePassword(password) {
  // 6-20 characters long with atleast 1 uppercase, 1 lowercase, 1 number
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(password); // Return true if the conditions match
}

// Check if the email is already in use
function checkStorage(mail) {
  let acc;
  let index;
  let fsy = true;
  for (let j = 0; j < storage.length; j++) {
    // Cycle through all keys in the localStorage
    acc = JSON.parse(storage.getItem(j));
    if (acc.Email == mail) {
      // Check if the mail value submitted already exists
      fsy = false;
      index = j;
    }
  }
  let ary = [fsy, index];
  return ary;
}

// Check if entries in signup are all validated
function validateEntries() {
  if (signupEntries()) {
    // If signupEntries function returns true proceed
    let arr;
    let fname = signupForm["fname"].value;
    let lname = signupForm["lname"].value;
    let password = signupForm["password"].value;
    let confirmPassword = signupForm["confirmpassword"].value;
    fname = fname.trim();
    lname = lname.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    // If all validation passes and confirmpassword equals password send info in for storage
    if (
      validateName(fname) &&
      validateName(lname) &&
      validatePassword(password) &&
      password == confirmPassword
    ) {
      arr = [fname, lname, password];
      return arr;
    } else {
      confirmMsg[0].style.display = "unset";
      alertMsg[0].style.display = "none";

      return false;
    }
  }
}

// Check if the entry exists and store it if it's a new entry
function validateRegistry() {
  let email = signupForm["email"].value;
  email = email.trim();
  let store = checkStorage(email);

  // If email is valid and not in use and entries validated store all data
  if (store[0]) {
    if (validateEntries() && validateMail(email)) {
      let entryNo = storage.length;
      let enter = validateEntries();
      let entry = {};
      entry.firstName = enter[0];
      entry.lastName = enter[1];
      entry.Email = email;
      entry.Password = sha256(enter[2]);

      storage.setItem(entryNo, JSON.stringify(entry));
      dashboardPage(entryNo, entry);
      return true;
    }
  } else {
    // if unsuccessful display error message
    confirmMsg[0].style.display = "unset";
    alertMsg[0].style.display = "none";

    return false;
  }
}

// Check if email exists and password is correct
function validateSubmission() {
  if (signinEntries()) {
    // Check if non-empty entries are submitted
    let email = signinForm["email"].value;
    let password = signinForm["password"].value;
    email = email.trim();
    password = password.trim();
    let store = checkStorage(email);

    let account = JSON.parse(storage.getItem(store[1]));

    // Check if email exist and if password submitted is valid
    if (!store[0] && sha256(password) == account.Password) {
      dashboardPage(store[1], account);
      return true;
    } else {
      // if unsuccessful display error message
      confirmMsg[1].style.display = "unset";
      alertMsg[1].style.display = "none";

      return false; // Return false
    }
  }
}

// Dashboard page

// Get target elements
let userId; // UserId for the session
let todoDash = document.getElementById("todo-dash");
let dashForm = document.getElementById("dash-form");
let listTitle = document.getElementById("list-title");

let todoGen = (el) => {
  // Function to create list elements
  let objArr = Object.keys(el);
  let header = document.getElementById("header-title");
  for (let item of objArr) {
    // Cycle through dashboard keys
    let itemList = document.createElement("DIV");
    let label = document.createElement("P");
    let preview = document.createElement("UL");
    let prevArr = el[item];
    // Cycle through a given key arrays
    for (let k of prevArr) {
      let lItem = document.createElement("LI");
      lItem.innerText = k;
      lItem.className = "preview-class";
      preview.appendChild(lItem);
    }

    itemList.addEventListener(
      "click",
      (vnt) => {
        // Event to redirect to edit list page
        vnt.preventDefault();
        let targetel = vnt.currentTarget;
        let targetTitle = targetel.firstChild.textContent;
        header.innerText = targetTitle;
        gotoList(targetTitle);
      },
      false
    );
    header.innerText = item;
    label.innerText = item;
    itemList.className = "dash-lists";
    let newId = item.split(" ").join("-");
    itemList.id = newId;
    preview.id = "preview-" + newId;
    itemList.appendChild(label);
    itemList.appendChild(preview);
    todoDash.appendChild(itemList);
  }
};

// Function to get current User object
let currentUser = (id) => {
  let objUser = JSON.parse(storage.getItem(id));
  return objUser;
};

dashForm.addEventListener(
  "submit",
  (event) => {
    // Action on submit list form
    // Don't submit the form
    event.preventDefault();
    createTodoItem();
  },
  false
);

// Navigate to specific user dashboard
function dashboardPage(accNumber, acc) {
  // Get account details
  let usrlist = acc.Dashboard;
  if (usrlist) {
    // If the list exists display items
    todoGen(usrlist);
  }
  navigatePages("dashboard");
  userId = accNumber;
}

// Create new todo list
function createTodoItem() {
  let usr = currentUser(userId);

  if (listTitle.value) {
    // Make sure input value is not an empty string
    if (
      usr.Dashboard == undefined ||
      !Object.keys(usr.Dashboard).includes(listTitle.value)
    ) {
      // If the Dashboard is undefined or the value has not been used
      let todoObj = {};
      let value = listTitle.value.trim();
      todoObj[value] = [];
      listTitle.value = "";

      if (usr.Dashboard == undefined) {
        // If no list has been created
        usr.Dashboard = todoObj;
      } else {
        let existing = usr.Dashboard;
        let obj = Object.assign(existing, todoObj);
        usr.Dashboard = obj;
      }
      storage.setItem(userId, JSON.stringify(usr));
      todoGen(todoObj);
      gotoList(value);
    } else {
      alert("List title must be unique!");
    }
  }
}

// Clear dashboard elements on click "clear" button
function clearDashboard() {
  if (userId >= 0) {
    // If id value is zero or greater
    while (todoDash.lastChild) {
      // Cycle through child elements
      todoDash.removeChild(todoDash.lastChild);
    }
    let usr = currentUser(userId);
    usr.Dashboard = undefined;
    storage.setItem(userId, JSON.stringify(usr));
    navigatePages("dashboard");
  }
}
/*
 ** Edit Account Details
 */
// Get elements
let editacc = document.forms["edit-acc"];
let editAC = document.querySelector("#edit-account");
let resetEdit = () => {
  // Reset edit page
  editacc["password"].value = "";
  editacc["confirmpassword"].value = "";
  confirmMsg[2].style.display = "none";
  alertMsg[2].style.display = "none";
};

editAC.addEventListener(
  "submit",
  (e) => {
    // Action on submit signup form
    // Don't submit the form
    e.preventDefault();
    editAcc();
  },
  false
);
// Function to redirect to edit account page
function gotoEdit() {
  let user = currentUser(userId);
  editacc["fname"].value = user.firstName;
  editacc["lname"].value = user.lastName;
  editacc["email"].value = user.Email;
  navigatePages("editAccount");
}

// Check if all edit entries have been filled
function editEntries() {
  let fal = true;
  for (let i = 0; i < 5; i++) {
    let val = editacc[i].value;
    if (val == "") {
      // If either the values are an empty string or the checkbox isn't checked
      alertMsg[2].style.display = "unset";
      confirmMsg[2].style.display = "none";
      fal = false;
    }
  }
  return fal; // Return the variable
}

// Check if entries in edit are all validated
function validateEdits() {
  if (editEntries()) {
    // If signupEntries function returns true proceed
    let arr;
    let fname = editacc["fname"].value;
    let lname = editacc["lname"].value;
    let password = editacc["password"].value;
    let confirmPassword = editacc["confirmpassword"].value;
    fname = fname.trim();
    lname = lname.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    // If all validation passes and confirmpassword equals password send info in for storage
    if (
      validateName(fname) &&
      validateName(lname) &&
      validatePassword(password) &&
      password == confirmPassword
    ) {
      arr = [fname, lname, password];
      return arr;
    } else {
      confirmMsg[2].style.display = "unset";
      alertMsg[2].style.display = "none";

      return false;
    }
  }
}

// Function to edit account details and save new values
function editAcc() {
  let email = editacc["email"].value;
  email = email.trim();
  let store = checkStorage(email);
  let usr = currentUser(userId);
  // If email is valid and not in use and entries validated store all data
  if (validateEdits() && validateMail(email)) {
    // If validation passes
    if (store[0] || email == usr.Email) {
      let enter = validateEdits();
      usr.firstName = enter[0];
      usr.lastName = enter[1];
      usr.Email = email;
      usr.Password = sha256(enter[2]);

      storage.setItem(userId, JSON.stringify(usr));
      navigatePages("dashboard");
      resetEdit();
      return true;
    } else {
      confirmMsg[2].style.display = "unset";
      alertMsg[2].style.display = "none";
      return false;
    }
  }
}
// Function for User confirms deletion process
function confirmDelete() {
  // Confirm deletion process
  confirm(
    "Are you sure you want to delete your account?\nAll your details will be deleted."
  )
    ? deleteAccount()
    : alert("Process Aborted!");
}
// Function to Delete Current User Account
function deleteAccount() {
  for (let ky = 0; ky < storage.length; ky++) {
    // Cycle through storage
    if (userId < ky) {
      // If key is larger than userId proceed
      let adjacentUser = storage.getItem(ky);
      let newUserId = ky - 1;
      storage.setItem(newUserId, adjacentUser);
    }
  }
  let lastUser = storage.length - 1;
  storage.removeItem(lastUser);
  location.reload();
}

/*
 ** List Edits
 */
// Get the target Elements
let listId;
let listForm = document.getElementById("list-form");
let listElement = document.getElementById("list-element");
let oList = document.getElementsByTagName("ol")[0];
let listGen = (lst) => {
  // Display list elements
  for (let varr of lst) {
    // For each array element
    let listItem = document.createElement("LI");
    let deleteList = document.createElement("SPAN");
    var text = document.createTextNode("\u00D7");
    listItem.addEventListener("click", (eve) => {
      // Add event listener to LI element
      eve.preventDefault();
      let tar = eve.target;
      checkItem(tar);
    });
    deleteList.addEventListener("click", (v) => {
      // Add event listener to SPAN
      v.preventDefault(); // Prevent default
      let currentListItem = v.currentTarget.parentElement;
      deleteListItem(currentListItem);
    });
    deleteList.className = "delete-list";
    listItem.innerText = varr;
    deleteList.appendChild(text);
    listItem.appendChild(deleteList);
    oList.appendChild(listItem);
  }
};

listForm.addEventListener(
  // Add event listener to list form
  "submit",
  (event) => {
    //Prevent default submission event
    event.preventDefault();
    createListItem();
  },
  false
);

// Redirect to specific todo list key
function gotoList(dashKey) {
  let user = currentUser(userId);
  let listArr = user.Dashboard[dashKey];
  // If listArr exists and is non-empty array continue
  if (!(listArr == undefined)) {
    if (listArr.length > 0) {
      listGen(listArr);
    }
  }
  listId = dashKey;
  navigatePages("editList");
}
let update = [];

// Function to create new list item
function createListItem() {
  let user = currentUser(userId);
  if (listElement.value) {
    // For a non empty submission
    let liElmnt = [];
    let inputs = listElement.value.trim();
    liElmnt.push(inputs);
    listElement.value = "";
    if (
      user.Dashboard[listId] == undefined ||
      user.Dashboard[listId].length == 0
    ) {
      // If list is empty
      user.Dashboard[listId] = liElmnt;
    } else {
      let existingList = user.Dashboard[listId];
      let newList = existingList.concat(liElmnt);
      user.Dashboard[listId] = newList;
    }
    storage.setItem(userId, JSON.stringify(user));
    update.push(inputs);
    listGen(liElmnt);
    updatePreview();
    navigatePages("editList");
  }
}

let clearView = () => {
  // Function to remove all list elements from view
  while (oList.lastChild) {
    // Cycle through child elements
    oList.removeChild(oList.lastChild);
  }
};

let clearPreview = () => {
  // Clear all list elements from view
  let prev = listId.split(" ").join("-");
  prev = "preview-" + prev;
  let prevEl = document.getElementById(prev);
  while (prevEl.lastChild) {
    // Cycle through child elements
    prevEl.removeChild(prevEl.lastChild);
  }
};

// Clear list elements on click "clear" button
function clearList() {
  clearView();
  clearPreview();
  let usr = currentUser(userId);
  usr.Dashboard[listId] = [];
  storage.setItem(userId, JSON.stringify(usr));
  navigatePages("editList");
}

// Delete current todo list on click "delete" button
function deleteTodo() {
  clearView();
  let idList = listId.split(" ").join("-");
  let dashLists = document.getElementById(idList);
  todoDash.removeChild(dashLists);
  let usr = currentUser(userId);
  usr.Dashboard[listId] = undefined;
  storage.setItem(userId, JSON.stringify(usr));
  navigatePages("dashboard");
}

// Check or uncheck a list item
function checkItem(check) {
  // First check item
  if (
    !check.classList.contains("checked-item") &&
    !check.classList.contains("unchecked-item")
  ) {
    check.classList.add("checked-item");
  }
  // Then uncheck item
  else if (
    check.classList.contains("checked-item") &&
    !check.classList.contains("unchecked-item")
  ) {
    check.classList.remove("checked-item");
    check.classList.add("unchecked-item");
  }
  // Then check item
  else {
    check.classList.remove("unchecked-item");
    check.classList.add("checked-item");
  }
}
// Update the preview lists on the dashboard by adding an element
function updatePreview() {
  let prev = listId.split(" ").join("-");
  prev = "preview-" + prev;
  let prevEl = document.getElementById(prev);
  if (update.length > 0) {
    // If there is an update continue
    for (let z = 0; z < update.length; z++) {
      // Cycle through update list
      let lItem = document.createElement("LI");
      lItem.innerText = update[z];
      lItem.classList.add("preview-class");
      prevEl.appendChild(lItem);
    }
  }
  update = []; // Reset update to empty array
}
// Function that deletes one item from a list
function deleteListItem(item) {
  item.id = "deleted-item";
  let usr = currentUser(userId);
  let listItemsArray = usr.Dashboard[listId];
  let newAdjustedList = [];
  for (let listCon of listItemsArray) {
    if (!(item.firstChild.textContent == listCon)) {
      newAdjustedList.push(listCon);
    }
  }
  usr.Dashboard[listId] = newAdjustedList;
  storage.setItem(userId, JSON.stringify(usr));
  deletePreview(item);
}
// Function to delete from preview
function deletePreview(item) {
  let prev = listId.split(" ").join("-");
  prev = "preview-" + prev;
  let prevEl = document.getElementById(prev);
  let arrPreview = Array.from(prevEl.children);
  for (let z of arrPreview) {
    // Cycle through children
    if (z.textContent == item.firstChild.textContent) {
      prevEl.removeChild(z);
      return;
    }
  }
}

// Function to change todo list title
function changeTitle() {
  let prev = listId.split(" ").join("-");
  let prevUL = "preview-" + prev;
  let newTitle = prompt("Please enter new title:", listId);
  let newHeader = document.getElementById("header-title");
  let prevTitle = document.getElementById(prev);
  let prevList = document.getElementById(prevUL);
  let usr = currentUser(userId);
  if (newTitle == null || newTitle == "") {
    // If cancelled or empty entry
    alert("The Process has been cancelled.");
  } else {
    newTitle = newTitle.trim();
    if (newTitle == listId) {
      // If value unchanged
      return;
    } else if (!Object.keys(usr.Dashboard).includes(newTitle)) {
      // If user keys don't exist already
      let arrayList = usr.Dashboard[listId];
      usr.Dashboard[newTitle] = arrayList;
      delete usr.Dashboard[listId];
      storage.setItem(userId, JSON.stringify(usr));
      newHeader.innerText = newTitle;
      prevTitle.firstChild.innerText = newTitle;
      let newPrev = newTitle.split(" ").join("-");
      let newPrevList = "preview-" + newPrev;
      prevTitle.id = newPrev;
      prevList.id = newPrevList;
      listId = newTitle;
    } else {
      // If already in use send alert
      alert("List title must be unique!");
    }
  }
}
