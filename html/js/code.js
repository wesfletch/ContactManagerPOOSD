//var urlBase = 'http://cop4331smallprojectfall21.fun/LAMPAPI';
//var extension = 'php';

const BATCH_SIZE = 20;
var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
  // Grab login info from webpage
  var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
  var temp = {login:login, password:password};
  var payload = JSON.stringify(temp);
  // If login is gmail.com and password is 123 then payload is
  // {"login": gmail.com, "password": 123}
  // Get ready to send to server
  var request = new XMLHttpRequest();
  var endpoint = '/Login.php';
  request.open("POST", "http://143.198.116.115/LAMPAPI" + endpoint, true);
  request.setRequestHeader("Content-type","application/json;charset=UTF-8");
  try
  {
    request.onreadystatechange = function()
    {
      // readyState of 4 means the request finished and the response from server is ready
      // status of 200 means everything is working correctly
      if (this.readyState == 4 && this.status == 200)
      {
        // Example response texts
        // {"id": 6, "firstName": "Mahlon", "lastName", "Scott", "error": "No error"}
        // {"id:" 0, "firstName": "", "lastName": "", "error": "No Records Found"}

        var jsonObject = JSON.parse(request.responseText);
        userId = jsonObject.id;
	sessionStorage.setItem("userId",userId);

        if (userId < 1)
        {
          document.getElementById("loginError").innerHTML = "Invalid username or password";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };
    request.send(payload);
  }
  catch(err)
	{
		document.getElementById("loginError").innerHTML = err.message;
	}
}

function enterLogin(event)
{
  if (event.keyCode === 13)
  {
    doLogin();
  }
}

function goToRegister()
{
	window.location.href = "registration.html";
}


function doRegister()
{
	var firstNameRegister = document.getElementById("fName").value;
	var lastNameRegister = document.getElementById("lName").value;
	var userLoginEmail = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var phone = document.getElementById("phone").value;
	var major = document.getElementById("major").value;

	//document.getElementById("colorAddResult").innerHTML = "";
//	var hash = md5( password );

//	document.getElementById("loginResult").innerHTML = "";


	var tmp = {firstName:firstNameRegister, lastName:lastNameRegister, email:userLoginEmail,
				password:password, phone:phone, major:major, test:false};
	var payload = JSON.stringify( tmp );

//	var url = urlBase + '/Register.' + extension;

	 var request = new XMLHttpRequest();
  	var endpoint = '/Register.php';
  	request.open("POST", "http://143.198.116.115/LAMPAPI" + endpoint, true);
  	request.setRequestHeader("Content-type","application/json;charset=UTF-8");
  try
  {
    request.onreadystatechange = function()
    {
      // readyState of 4 means the request finished and the response from server is ready
      // status of 200 means everything is working correctly
      if (this.readyState == 4 && this.status == 200)
      {
        // Example response texts
        // {"id": 6, "firstName": "Mahlon", "lastName", "Scott", "error": "No error"}
        // {"id:" 0, "firstName": "", "lastName": "", "error": "No Records Found"}
	var jsonObject = JSON.parse(request.responseText);
	if (jsonObject.result === "User successfully created")
	{
		userId = jsonObject.id;
		firstName = firstNameRegister;
		lastName = lastNameRegister;
		saveCookie();
		window.location.href = "contacts.html";
	}
	else
	{
		document.getElementById("registerError").innerHTML = jsonObject.result;
		return;
	}
//	document.getElementById("accountAddResult").innerHTML = "Account has been added";

      }
    };
    request.send(payload);
  }
  catch(err)
	{
		document.getElementById("registerError").innerHTML = err.message;
	}

}


function saveCookie()
{
  var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function getContacts()
{
  userId = sessionStorage.getItem("userId");
  var request = new XMLHttpRequest();
  var endpoint = '/GetContacts.php';
  try
  {
    request.onreadystatechange = function()
    {
      // readyState of 4 means the request finished and the response from server is ready
      // status of 200 means everything is working correctly
      if (this.readyState == 4 && this.status == 200)
      {
        var jsonArray = this.responseText;
	      jsonArray = JSON.parse(jsonArray);
	      sessionStorage.setItem("contactCount",jsonArray.length);
      	for (var i = 0; i < jsonArray.length; i++)
      	{
      		var jsonObject = jsonArray[i];
      		$("#contactSelect").append('<tr><td>' + jsonObject.FirstName + '</td><td>' + jsonObject.LastName + '</td><td>' + jsonObject.Email + '</td><td>' + jsonObject.Phone + '</td></tr>');
      	}
        return;
      }
    };
    request.open("GET", "http://143.198.116.115/LAMPAPI" + endpoint + "?userID=" + userId);
    request.send();
  }
  catch(err)
  {
    document.getElementById("contactsError").innerHTML = err.message;
  }
}

function getLazyContacts()
{
  if (sessionStorage.getItem("finishedLoading") === "1")
  {
    return;
  }
  userId = sessionStorage.getItem("userId");
  var batchNumber = Number(sessionStorage.getItem("batchNumber"));
  var request = new XMLHttpRequest();
  var endpoint = '/GetLazyContacts.php';
  try
  {
    request.onreadystatechange = function()
    {
      // readyState of 4 means the request finished and the response from server is ready
      // status of 200 means everything is working correctly
      if (this.readyState == 4 && this.status == 200)
      {
        var jsonArray = this.responseText;
	      jsonArray = JSON.parse(jsonArray);
	      sessionStorage.setItem("contactCount",jsonArray.length);
        if (jsonArray.length < BATCH_SIZE)
        {
          sessionStorage.setItem("finishedLoading", "1");
        }
      	for (var i = 0; i < jsonArray.length; i++)
      	{
      		var jsonObject = jsonArray[i];
      		$("#contactSelect").append('<tr><td>' + jsonObject.FirstName + '</td><td>' + jsonObject.LastName + '</td><td>' + jsonObject.Email + '</td><td>' + jsonObject.Phone + '</td></tr>');
      	}
	sessionStorage.setItem("batchNumber", batchNumber + 1);
        return;
      }
    };
    request.open("GET", "http://143.198.116.115/LAMPAPI" + endpoint + "?userID=" + userId + "&batch_size=" + BATCH_SIZE + "&batch_number=" + batchNumber);
    request.send();
  }
  catch(err)
  {
    document.getElementById("contactsError").innerHTML = err.message;
  }
}

function getSearch()
{
  userId = sessionStorage.getItem("userId");
  var request = new XMLHttpRequest();
  var endpoint = '/SearchContacts.php';
  try
  {
    request.onreadystatechange = function()
    {
      // readyState of 4 means the request finished and the response from server is ready
      // status of 200 means everything is working correctly
      if (this.readyState == 4 && this.status == 200)
      {
        var jsonArray = this.responseText;
      	jsonArray = JSON.parse(jsonArray);
      	for (var i = 0; i < jsonArray.length; i++)
      	{
      		var jsonObject = jsonArray[i];
      		$("#contactSearch").append('<tr><td>' + jsonObject.FirstName + '</td><td>' + jsonObject.LastName + '</td><td>' + jsonObject.Email + '</td><td>' + jsonObject.Phone + '</td></tr>');
      	}
        return;
      }
    };
    request.open("GET", "http://143.198.116.115/LAMPAPI" + endpoint + "?userID=" + userId + "&pattern=" + document.getElementById("searchBar").value);
    //alert("http://143.198.116.115/LAMPAPI" + endpoint + "?userID=" + userId + "&pattern=" + document.getElementById("searchBar").value);
    request.send();
  }
  catch(err)
  {
    document.getElementById("contactsError").innerHTML = err.message;
  }
}


function goToCreateContact()
{
	window.location.href = "createContact.html";
}


function goToUpdateContact()
{
	window.location.href = "updateContact.html";
}


// function goToDeleteContact()
// {
// 	window.location.href = "deleteContact.html";
// }



function createContact()
{
	var firstNameContact = document.getElementById("fName").value;
	var lastNameContact = document.getElementById("lName").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	userId = sessionStorage.getItem("userId");

	//$("#contactSelect").append('<tr><td>' + firstNameContact + '</td><td>' + lastNameContact + '</td><td>' + email + '</td><td>' + phone + '</td></tr>');
	var tmp = {userID:userId, firstname:firstNameContact, lastname:lastNameContact, email:email,
			 phone:phone};
	var payload = JSON.stringify( tmp );


	//userId = sessionStorage.getItem("userId");
	var request = new XMLHttpRequest();
	var endpoint = '/CreateContact.php';
  	request.open("POST", "http://143.198.116.115/LAMPAPI" + endpoint, true);
  	request.setRequestHeader("Content-type","application/json;charset=UTF-8");


	try
	{
		request.onreadystatechange = function()
		{
      			// readyState of 4 means the request finished and the response from server is ready
      			// status of 200 means everything is working correctly
      			if (this.readyState == 4 && this.status == 200)
      			{
				var jsonObject = JSON.parse(request.responseText);
				var x = sessionStorage.getItem("contactCount") + 1;
				if (jsonObject.result === "Contact created successfully")
				{
					sessionStorage.setItem("contactCount", x);
					window.location.href = "contacts.html";
				}
				else
				{
					document.getElementById("createContactError").innerHTML = "Email already being used in another contact";
					return;
				}
      			}
		};
		request.send(payload);

	}
	catch(err)
	{
		document.getElementById("createContactError").innerHTML = err.message;
	}

}



function deleteContact()
{
	var txt;
	
	var x = confirm("Delete Contact?");
	if (x == true) 
	{
		var i = sessionStorage.getItem("selected");
	
		if(i === "1")
		{
			var email = sessionStorage.getItem("selectedEmail");
			userId = sessionStorage.getItem("userId");
		}

		var tmp = {userID:userId, email:email};
		var payload = JSON.stringify( tmp );


	//userId = sessionStorage.getItem("userId");
		var request = new XMLHttpRequest();
		var endpoint = '/DeleteContact.php';
  		request.open("POST", "http://143.198.116.115/LAMPAPI" + endpoint, true);
  		request.setRequestHeader("Content-type","application/json;charset=UTF-8");


		try
		{
			request.onreadystatechange = function()
			{
      				// readyState of 4 means the request finished and the response from server is ready
      				// status of 200 means everything is working correctly
      				if (this.readyState == 4 && this.status == 200)
      				{
					var jsonObject = JSON.parse(request.responseText);
					var x = sessionStorage.getItem("contactCount") - 1;
					if (jsonObject.result === "Contact deletion succeeded")
					{
						sessionStorage.setItem("contactCount", x);
						window.location.href = "contacts.html";					
					}
					else
					{
						document.getElementById("deleteContactError").innerHTML = jsonObject.result;
						return;
					}
      				}
			};
			request.send(payload);

		}
		catch(err)
		{
			document.getElementById("deleteContactError").innerHTML = err.message;
		}
		} else {
		
			txt = "You pressed Cancel!";	
		}
}



function updateContact()
{
	userId = sessionStorage.getItem("userId");
	var email = emailM;
	
	var firstNameMod = document.getElementById("fNameContact").value;
	var lastNameMod = document.getElementById("lNameContact").value;
	var emailMod = document.getElementById("emailContact").value;
	var phoneMod = document.getElementById("phoneContact").value;
	

	//$("#contactSelect").append('<tr><td>' + firstNameContact + '</td><td>' + lastNameContact + '</td><td>' + email + '</td><td>' + phone + '</td></tr>');
	var tmp = {userID:userId, 
		   email:email,
		   modifications: {
			   lastname:lastNameMod,
			   firstname:firstNameMod,
			   phone:phoneMod,
			   email:emailMod
		   }	  
		  };
	var payload = JSON.stringify( tmp );


	//userId = sessionStorage.getItem("userId");
	var request = new XMLHttpRequest();
	var endpoint = '/UpdateContact.php';
  	request.open("POST", "http://143.198.116.115/LAMPAPI" + endpoint, true);
  	request.setRequestHeader("Content-type","application/json;charset=UTF-8");


	try
	{
		request.onreadystatechange = function()
		{
      			// readyState of 4 means the request finished and the response from server is ready
      			// status of 200 means everything is working correctly
      			if (this.readyState == 4 && this.status == 200)
      			{
				var jsonObject = JSON.parse(request.responseText);
				//var x = sessionStorage.getItem("contactCount") + 1;
				if (jsonObject.result === "Contact modification succeeded")
				{
					//sessionStorage.setItem("contactCount", x);
					window.location.href = "contacts.html";
				}
				else
				{
					document.getElementById("updateContactError").innerHTML = "Email already being used in another contact";
					return;
				}
      			}
		};
		request.send(payload);

	}
	catch(err)
	{
		document.getElementById("updateContactError").innerHTML = err.message;
	}
	
}

