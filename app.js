"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = promptForSearchByTraits(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  
  mainMenu(searchResults, people);
}

function mainMenu(person, people){

  if(!person){
    alert("Could not find that individual.");
    return app(people);
  }

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    displayPerson(person)
    break;
    case "family":
    displayFamily(findSpouse(person, people), findParents(person,people), findChildren(person, people));
    break;
    case "descendants":
    displayDescendants(findDescendants(person, people));
    break;
    case "restart":
    app(people);
    break;
    case "quit":
    return; 
    default:
    return mainMenu(person, people); 
  }
  return mainMenu(person, people);
}
function searchByNameFE(people) {
  closeAlert();
  let firstName = document.getElementById("firstName").value;
  let firstNameForSearch = firstName.toLowerCase();
  let lastName = document.getElementById("lastName").value;
  let lastNameForSearch = lastName.toLowerCase();

  let foundPerson = people.filter(function(person) {
    if(person.firstName.toLowerCase() === firstNameForSearch && person.lastName.toLowerCase() === lastNameForSearch){
      return true;
    } else {
      return false;
    }
  });
  if(foundPerson.length > 0) {
      updatePage(foundPerson[0], people);
    } else {
      alert("No results found!");
    }
}
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    if(person.firstName.toLowerCase() === firstName && person.lastName.toLowerCase() === lastName){
      return true;
    }
    else{
      return false;
    }
  })
   return foundPerson[0];
}
function displayPeople(people){
  if(people.length > 0) {
    alert(people.map(function(person){
      return person.firstName + " " + person.lastName;
    }).join("\n"));
  } else {
    alert("No results found!");
  }
}
function displayPerson(person){
  let personInfo = `First Name: ${person.firstName}\n`;
  personInfo += `Last Name: ${person.lastName}\n`;
  personInfo += `Gender: ${person.gender}\n`;
  personInfo += `Date of Birth: ${person.dob}\n`;
  personInfo += `Height: ${person.height}\n`;
  personInfo += `Weight: ${person.weight}\n`;
  personInfo += `Eye Color: ${person.eyeColor}\n`;
  alert(personInfo);
}

// TODO: Display  children  - COMPLETE
function displayFamily(spouse, parents, children)
{
  let familyInfo = "";
  if(spouse != undefined){
    familyInfo = `Name: ${spouse.firstName} ${spouse.lastName}\n`;
    familyInfo += "Relationship: Spouse\n\n";
  }
 
  if(parents.length != null) {
    parents.forEach(element => {
      familyInfo += `Name: ${element.firstName} ${element.lastName}\n`
      familyInfo += `Relationship: Parent\n\n`
    });
  }

  if(children.length != null) {
    children.forEach(el => {
      familyInfo += `Name: ${el.firstName} ${el.lastName}\n`
      familyInfo += `Relationship: Child\n\n`
    })
  }
alert(familyInfo);
}
function displayDescendants(descendants) {
  let descendantsInfo = "";
  if(descendants.length > 0) {
    alert(descendants.map(function(person) {
      return person.firstName + " " + person.lastName;
    }).join("\n"));
  } else {
    alert("No descendants found!");
  }
}

function findSpouse(person, people)
{
  let spouse = people.filter(function (el)
  {
    if (el.id === person.currentSpouse)
    {
      return true;
    }
    else
    {
      return false;
    }
  })
  return spouse[0];
}
function findParents(person, people)
{
  let parents = []
  for (let i = 0; i < person.parents.length; i++)
  {
    people.filter(function (el)
    {
      if(el.id == person.parents[i] && el.id != person.id)
      {
        parents.push(el);
        return true;
      }
      else
      {
        return false;
      }
    })
  }
  return parents;
}
function findChildren(person, people) {
  let children = [];

  people.forEach(el => {
    for(var i=0; i <el.parents.length; i++){
      if(person.id === el.parents[i]) {
        children.push(el);
      }
    }
  })
  return(children);
}
function findDescendants(person, people)
{
  let descendants = [];
  let children =findChildren(person,people);
  children.forEach(child => 
  {
    descendants = children.concat(findDescendants(child,people))
  })
  return descendants;
}
function promptForSearchByTraits(people)
{
  let searchBy = promptFor("Would you like to search by traits? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch (searchBy)
  {
    case "yes":
      return searchByTraits(people);
      break;
    case "no":
      //quit
      return;
    default:
      ;
  }
}
//TODO -Review
function searchByTraits(people, matchingPeople)
{
  let selectTraits = promptFor("Select a trait you would like to use in your search. Choices:\nGender\nDate of Birth\nHeight\nWeight\nEye Color\nOccupation", criteria).toLowerCase().split(' ').join('');
  let selectedTraits = convertedTraitName(selectTraits);
  let selectedTraitCritera = promptFor(`Please enter the critera for ${selectTraits}.\nUse an integer for height, and weight, m/dd/yyyy for Date Of Birth.`, chars);
  matchingPeople = people.filter(function(person)
    {
      if (person[selectedTraits] == selectedTraitCritera)
        {
          return person;
        }
      else
        {
          return false;
        }
    });
  let result = checkForContinuedTraitSearch(matchingPeople);
  return result;
}
//TODO Review
function checkForContinuedTraitSearch(matchingPeople)
{
  let input =promptFor("would you like to continue your search by traits?",yesNo).toLowerCase()
  switch(input)
  {
    case "yes":
      let result = searchByTraits(matchingPeople);
      return result;
    case "no":
      displayPeople(matchingPeople);
      let selectedPerson = selectOne(matchingPeople);
      return selectedPerson;
  }
}

function selectOne(matchingPeople) {
  if(matchingPeople.length > 1) {
    let userInput = promptFor("Would you like to select a match?", yesNo).toLowerCase();
    switch(userInput) {
      case "yes":
        let promptString = "Select a person: \n";
        for(var i=0; i<matchingPeople.length; i++) {
          promptString += `${i + 1}. ${matchingPeople[i].firstName} ${matchingPeople[i].lastName}\n`
        } 
        let numberInput = promptFor(promptString, numInput, matchingPeople);
        return matchingPeople[numberInput - 1];
      case "no":
        return;
    }
  } else if (matchingPeople.length == 1) {
    return matchingPeople[0];
  } else {
    return matchingPeople[0];
  }
}

function promptFor(question, valid, matchingPeople){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response, matchingPeople));
  return response;
}
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}
function numInput(input, matchingPeople){
  return isNaN(input)==false && input <= matchingPeople.length && input > 0;
}
function chars(input){
  return true;
}
function criteria(input) {
  return input.toLowerCase() == "gender" || input.toLowerCase().split(" ").join("") == "dateofbirth" || input.toLowerCase() == "height" || input.toLowerCase() == "weight" || input.toLowerCase().split(" ").join("") == "eyecolor" || input.toLowerCase() == "occupation"
}

//TODO Review
function convertedTraitName(critera)
{
  switch (critera)
  {
    case "dateofbirth":
      return critera = "dob";
    case "eyecolor":
      return critera = "eyeColor";
    default:
      return critera;
  }
}

function closeAlert() {
  collapseAll();
  document.getElementById("alertSuccessByName").classList.add("do-not-display");
  document.getElementById("alertSuccessByName").classList.remove("display");
  document.getElementById("alertSuccessByName").innerHTML = "<button type='button' class='close' onclick='closeAlert()''>&times;</button><strong> found!</strong>"
  document.getElementsByClassName("accordion")[0].classList.add("do-not-display");
  document.getElementsByClassName("accordion")[0].classList.remove("display");
}

function collapseAll() {
  let element = document.getElementsByClassName("card-body");
  for (var i = 0; i < element.length; i++) {
    element[i].classList.add("do-not-display");
    element[i].classList.remove("display");
  };
}

function openInfo() {

  collapseAll();
  document.getElementById("infoHere").classList.add("display");
  document.getElementById("infoHere").classList.remove("do-not-display");
}

function openFamily() {
  collapseAll();
  document.getElementById("familyHere").classList.add("display");
  document.getElementById("familyHere").classList.remove("do-not-display");
}

function openDescendants() {
  collapseAll();
  document.getElementById("descendantsHere").classList.add("display");
  document.getElementById("descendantsHere").classList.remove("do-not-display");
}

function updatePage(person, people) {
    let alertSuccessByName = document.getElementById("alertSuccessByName");
    alertSuccessByName.classList.add("display");
    alertSuccessByName.classList.remove("do-not-display");
    alertSuccessByName.innerHTML = "<strong>" + person.firstName + " " + person.lastName + "</strong>" + alertSuccessByName.innerHTML;
    document.getElementsByClassName("accordion")[0].classList.remove("do-not-display");
    document.getElementById("infoHere").innerHTML = 
      "First Name: " + person.firstName + 
      "<br>Last Name: " + person.lastName +
      "<br>Gender: " + person.gender +
      "<br>Date of Birth: " + person.dob +
      "<br>Height: " + person.height + 
      "<br>Weight: " + person.weight +
      "<br>Eye Color: " + person.eyeColor;
    let familyString = "";
    let spouse = findSpouse(person, people);
    let children = findChildren(person, people);
    let parents = findParents(person, people);
    familyString += `Spouse: ${spouse.firstName} ${spouse.lastName}<br>`
    familyString += `${parents.map(function(person) {
        return "Parent: " + person.firstName + " " + person.lastName;
      }).join("<br>")}`;
    familyString += `${children.map(function(person) {
        return "Child: " + person.firstName + " " + person.lastName;
      }).join("<br>")}`;
    document.getElementById("familyHere").innerHTML = familyString;
    let descendantsString = "";
    let descendants = findDescendants(person, people);
    if(descendants.length > 0) {
      descendantsString += `${descendants.map(function(person) {
      return "Name: " + person.firstName + " " + person.lastName;
    }).join("<br>")}`;
    } else {
      descendantsString += `No descendants found!`;
    }
    
    document.getElementById("descendantsHere").innerHTML = descendantsString;
    document.getElementById("firstName").value ="";
    document.getElementById("lastName").value ="";
}