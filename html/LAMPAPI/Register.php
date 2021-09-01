
<?php
	// From post request
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "SmallProject"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare('SELECT ID,FirstName,LastName FROM Users WHERE Email=?;');
		$stmt->bind_param("s", $inData["email"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithError("Error creating user; email already used");
            $stmt->close();
		}
		else
		{
            $stmt->close();
            $date = date("Y-m-d H:m:s");
            $newStmt = $conn->prepare('INSERT INTO Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Email, Phone, Password) VALUES (?, ?, ?, ?, ?, ?, ?);');
            $newStmt->bind_param("sssssss", $date, $date, $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], $inData["password"]);
            $newStmt->execute();
            $newStmt->close();
            $oNewStmt = $conn->prepare('SELECT ID FROM Users WHERE Email=?;');
            $oNewStmt->bind_param("s", $inData["email"]);
            $oNewStmt->execute();
            $resulta = $oNewStmt->get_result();
            if ($rowa = $resulta->fetch_assoc())    {
                $newid = $rowa["ID"];
                $oNewStmt->close();
                $aNewStmt = $conn->prepare('INSERT INTO Majors (Name, UserID) VALUES (?, ?)');
                $aNewStmt->bind_param("si", $inData["major"], $newid);
                $aNewStmt->execute();
                $aNewStmt->close();
                returnWithError("User successfully created");
            }
            else
            {
                oNewStmt->close();
                returnWithError("Error creating user; Database no likey that one");
            }
		}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"result":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
