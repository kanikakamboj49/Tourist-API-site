var tourists;
var displayBtn = document.querySelector('#display');
var searchBtn = document.querySelector(".search-btn");
var addForm = document.forms["my-add-form"];
var updateForm = document.forms["my-update-form"];
var deleteForm = document.forms["my-delete-form"];
var ascSort = document.querySelector('#sort-asc');
var dscSort = document.querySelector('#sort-dsc');
var signUpButton = document.getElementsByClassName('signup');
var signInButton = document.getElementsByClassName('signin');

searchBtn.addEventListener('click', search);
displayBtn.addEventListener('click', displayTourists);
ascSort.addEventListener('click',sortAsc);
dscSort.addEventListener('click',sortDsc);
addForm.addEventListener("submit", addTourist);
updateForm.addEventListener("submit", updateTourist);
deleteForm.addEventListener("submit", deleteTourist);

//Sign Up Form
function SignUp(event){
  localStorage.setItem('Email', '');
  localStorage.setItem('Password','');
  localStorage.setItem('Role', '');
  let email = document.querySelector('.email').value;
  let setPassword = document.querySelector('.password').value;
  let confirmPassword = document.querySelector('.confirm-password').value;
  let role = document.querySelector('.role').value;

  if(confirmPassword === setPassword)
  {
      localStorage.setItem('Email', email);
      localStorage.setItem('Password',setPassword);
      localStorage.setItem('Role', role);
      document.querySelector('.email').value = '';
      document.querySelector('.password').value = '';
      document.querySelector('.confirm-password').value='';
      document.querySelector('.role').value= '';
      let action = confirm(`Successfully Signed Up As ${role} !\nWant to LogIn ?`);
      if(action === true)
      {
          window.location.href = "signIn.html";
      }
  }
  else{
      alert('Password did not match. \nCHECK PASSWORD');
      document.querySelector('.password').value = '';
      document.querySelector('.confirm-password').value='';
  }
  event.preventDefault();
}

//Sign In Form
function SignIn(event){
  let email = document.querySelector('.email').value;
  let password = document.querySelector('.password').value;
  var storedEmail = localStorage.getItem('Email');
  var storedPassword = localStorage.getItem('Password');

  if(email === storedEmail && password === storedPassword)
  {
      let role = localStorage.getItem('Role');
      document.querySelector('.email').value = '';
      document.querySelector('.password').value = '';
      if(role === 'Admin')
      {
        const page = window.open('main.html');

        page.addEventListener('DOMContentLoaded', () => {
              let addBtn = page.document.getElementById('add');
              let updateBtn = page.document.getElementById('update');
              let deleteBtn = page.document.getElementById('delete');
              addForm = page.document.getElementById("add-form");
              updateForm = page.document.getElementById("update-form");
              deleteForm = page.document.getElementById("delete-form");
              addBtn.classList.add("hidden");
              console.log(addBtn.classList);
              if(addBtn.classList.contains("hidden") || updateBtn.classList.contains("hidden") || deleteBtn.classList.contains("hidden"))
                {
                   console.log('logging in as admin')
                   addBtn.classList.remove("hidden");
                   updateBtn.classList.remove("hidden");
                   deleteBtn.classList.remove("hidden");
                   addForm.classList.remove("hidden");
                   updateForm.classList.remove("hidden");
                   deleteForm.classList.remove("hidden");
                   page.document.querySelector('.links').style.justifyContent="space-around";
                }
            })
      }
      if(role === 'SubAdmin')
      {
        const page = window.open('main.html');

        page.addEventListener('DOMContentLoaded', () => {
              let addBtn = page.document.getElementById('add');
              let updateBtn = page.document.getElementById('update');
              let deleteBtn = page.document.getElementById('delete');
              addForm = page.document.getElementById("add-form");
              updateForm = page.document.getElementById("update-form");
              deleteForm = page.document.getElementById("delete-form");

            if(!addBtn.classList.contains("hidden") || !updateBtn.classList.contains("hidden") || !deleteBtn.classList.contains("hidden"))
              {
                addBtn.classList.add("hidden");
                updateBtn.classList.add("hidden");
                deleteBtn.classList.add("hidden");
                addForm.classList.add("hidden");
                updateForm.classList.add("hidden");
                deleteForm.classList.add("hidden");
                page.document.querySelector('.links').style.justifyContent="space-between";
              }
            })

        console.log('logging in as sub admin')
      }  
  }
  else {
      alert('Wrong Password or Email');
  }
  event.preventDefault();
}

//fetching the data from api and storing in tourists variable
async function getTourists() {
  await fetch("http://restapi.adequateshop.com/api/Tourist")
  .then(res => {
         if(!res.ok)
         { return Promise.reject(`${res.status}`)}
         return res.json()})
  .then(touristsData => {tourists = touristsData.data})
  .catch(error => console.log(`Error encountere. ${error.status}`));
}

//function to render data in table
 function renderTourists() {
    console.log(tourists)
      if (tourists.length > 0) {

        var temp = "";
        tourists.forEach((tourist) => {
          temp += "<tr>";
          temp += "<td>" + tourist.id + "</td>";
          temp += "<td>" + tourist.tourist_name + "</td>";
          temp += "<td>" + tourist.tourist_email + "</td>";
          temp += "<td>" + tourist.tourist_location + "</td>";
        });
        document.getElementById('tourist-data').innerHTML = temp;
      }
}

//function to fetch and display data 
async function displayTourists() {
  await getTourists();
  setTimeout(() => renderTourists(), 1000);
}

//adding tourist
async function addTourist(event) {
  event.preventDefault();
  let name = this.name.value;
  let email = this.email.value;
  let location = this.location.value;
  console.log(`name: ${name}, email: ${email}, location: ${location}`);

  fetch("http://restapi.adequateshop.com/api/Tourist", {
    method: "POST",
    body: JSON.stringify({
        tourist_name: name,
        tourist_email: email,
        tourist_location: location
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => {if(!response.ok) { return Promise.reject(`${res.status}`)}
                        return response.json()})
  .then(json => console.log(json))
  .catch(error => console.log(`Error encountere.`));

  setTimeout(() => getTourists(), 1000);
  setTimeout(() => renderTourists(), 2000);
  this.name.value = "";
  this.email.value = "";
  this.location.value = "";
}

//updating specified tourist
async function updateTourist(event) {
  event.preventDefault();
  let tourist_id = this.id.value;
  let name = this.name.value;
  let email = this.email.value;
  let location = this.location.value;
  console.log(`name: ${name}, email: ${email}, location: ${location}`);

  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: tourist_id,
                            tourist_name: name,
                            tourist_email: email,
                            tourist_location: location})
  };

  await fetch(`http://restapi.adequateshop.com/api/Tourist/${tourist_id}`, requestOptions)
      .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          if (!response.ok) {
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
          }
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
    
  setTimeout(() => getTourists(), 1000);
  setTimeout(() => renderTourists(), 2000);   
}


//deleting tourist by id
async function deleteTourist(event) {
  event.preventDefault();
  let tourist_id = this.id.value;
  fetch(`http://restapi.adequateshop.com/api/Tourist/${tourist_id}`, {
       method: "DELETE",
       mode: "cors",
   })
    .then((res) => res.json())
    .then((res) => console.log(res));

  setTimeout(() => getTourists(), 1000);
  setTimeout(() => renderTourists(), 2000);
}

//sorting in ascending on clicking on id
async function sortAsc() {
  await getTourists();       
  tourists.sort(function(a, b)
  {
    console.log(`sort function called`);
    return a.id - b.id;
  });

  console.log(tourists);

  setTimeout(() => renderTourists(), 1000);
}

//sorting in descending on clicking on id
async function sortDsc() {
  await getTourists();       
  tourists.sort(function(a, b)
  {
    console.log(`sort function called`);
    return b.id - a.id;
  });

  console.log(tourists);

  setTimeout(() => renderTourists(), 1000);
}

//searching record
async function search(event) {
  event.preventDefault();
  await displayTourists();
  setTimeout(() =>{ let input, filter, table, tr, td, txtValue, index;
    input = document.querySelector('#search-input');
    filter = input.value.toUpperCase();
    table = document.querySelector("#tourists-info-table");
    tr = table.getElementsByTagName("tr");
 
    for(let i = 1; i < tr.length; i++)
    {
     td = tr[i].getElementsByTagName("td")[0];
     if(td)
     {
        txtValue = td.textContent || td.innerText;
        if(txtValue.toUpperCase() === filter)
        {
            index = i;
            break;
        }
     }
    }
    tr = table.getElementsByTagName("tr")[index];
    tr.style.backgroundColor = "#D5D8DC";
  }, 1000)
} 



