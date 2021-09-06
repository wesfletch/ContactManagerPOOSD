<?php
    // From post request
    $inData = getRequestInfo();

    // setting defaults
    $owner = "";
    $firstName = "";
    $lastName = "";
    $email = "";
    $phone = "";
    $dateCreated = date("Y-m-d H:m:s");

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "SmallProject");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // checking if contact with same first name and last name exists
        // create statement; ? will be assigned with bind_param
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and FirstName=? and LastName=?;');
        // place ID from request in statement
        $stmt->bind_param("iss", $inData["ID"], $inData["FirstName"], $inData["LastName"]);

        // execute the statement and get result
        $stmt->execute();
        $result = $stmt->get_result();

        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; contact with Name %s %s already exists", $inData["FirstName"], $inData["LastName"]);
        }
        $stmt->close();

        // check if email is already associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Email=?');
        $stmt->bind_param("is", $inData["ID"], $inData["Email"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; contact with email %s already exists", $inData["Email"]);
        }
        $stmt->close();

        // check if phone number is already associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Phone=?');
        $stmt->bind_param("is", $inData["ID"], $inData["Phone"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; contact with phone number %s already exists", $inData["Phone"]);
        }
        $stmt->close();

        // create the new contact
        $newStmt = $conn->prepare('INSERT INTO Contacts (userID, LastName, FirstName, Email, Phone, DateCreated) VALUES(?, ?, ?, ?, ?, ?)');
        $newStmt->bind_param("isssss", $inData["ID"], $inData["LastName"], $inData["FirstName"], $inData["Email"], $inData["Phone"], $dateCreated);
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
        $retValue = '{"result":"' . $err . '", "id": ' . $data . '}';
        sendResultInfoAsJson( $retValue );
    }

?>