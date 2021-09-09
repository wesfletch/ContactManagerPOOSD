<?php
    // From post request
    $inData = getRequestInfo();

    // setting defaults
    $userID = $inData["userID"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "SmallProject");
    if( $conn->connect_error )
    {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo "{}";
    }
    else
    {
        // check if email is associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Email=?');
        $stmt->bind_param("is", $userID, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {

        }
        else
        {
            sendResultInfoAsJson('{"result": "Error, contact with that email does not exist."}');
        }
        $stmt->close();


        // delete the contact
        $newStmt = $conn->prepare('DELETE FROM Contacts WHERE userID = ? AND Email = ?;');
        $newStmt->bind_param("is", $userID, $email);
        if ( $newStmt->execute() ) 
        {
            $newStmt->close();
            sendResultInfoAsJson('{"result": "Contact deletion succeeded."}');
        }
        else
        {
            $newStmt->close();
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            echo "{}";
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
?>
