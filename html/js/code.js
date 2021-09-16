//var urlBase = 'http://cop4331smallprojectfall21.fun/LAMPAPI';
//var extension = 'php';

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
	//document.getElementById("contactsError").innerHTML = "http://143.198.116.115/LAMPAPI" + endpoint + "?userID=" + userId + this.responseText;  
        var jsonArray = this.responseText;
	//$('#contactSelect').append('<option>testing</option>');
	for (var i = 0; i < jsonArray.length; i++)
	{
		var jsonObject = jsonArray[i];
		$('#contactSelect').append('<option>' + jsonObject.FirstName + ' ' + jsonObject.LastName + '</option>');
	}
	//document.getElementById("contactsError").innerHTML = jsonArray;
        return jsonArray;
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
