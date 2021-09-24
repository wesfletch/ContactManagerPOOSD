<?php
    // From post request
    $inData = getRequestInfo();

    // setting defaults
    $owner = $inData["userID"];
    $firstName = $inData["firstname"];
    $lastName = $inData["lastname"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $dateCreated = date("Y-m-d H:m:s");

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "SmallProject");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // check if email is already associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Email=?');
        $stmt->bind_param("is", $owner, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; a contact with the specified email already exists");
        }
        $stmt->close();

        
        // create the new contact
        $newStmt = $conn->prepare('INSERT INTO Contacts (userID, LastName, FirstName, Email, Phone) VALUES(?, ?, ?, ?, ?)');
        $newStmt->bind_param("issss", $owner, $lastName, $firstName, $email, $phone);
        if ( $newStmt->execute() ) 
        {
            $newStmt->close();
            returnWithInfo("Contact created successfully", 0);
        }
        else
        {
            $newStmt->close();
            returnWithError("Contact creation failed.");
        }
        
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
    
    function returnWithInfo( $err, $data)
    {
        $retValue = '{"result":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>
