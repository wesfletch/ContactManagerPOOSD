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

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "TEST");
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
        $stmt->bind_param("iss", $owner, $firstName, $lastName);

        // execute the statement and get result
        $stmt->execute();
        $result = $stmt->get_result();

        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; contact with name {$firstName} {$lastName} already exists", );
        }
        $stmt->close();

        // check if email is already associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Email=?');
        $stmt->bind_param("is", $owner, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; contact with email %s already exists", $email);
        }
        $stmt->close();

        // check if phone number is already associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Phone=?');
        $stmt->bind_param("is", $owner, $phone);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {
            returnWithError("Error creating contact; contact with phone number %s already exists", $phone);
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
            returnWithInfo("Query: userID: {$owner}, LastName: {$lastName}, FirstName: {$firstName}, email: {$email}, phone: {$phone}", 0);
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
