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

function goToRegister()
{
	window.location.href = "registration.html";
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
