<?php
    // From post request
    $inData = getRequestInfo();

    // setting defaults
    $userID = $inData["userID"];
    $email = $inData["email"];
    $modified = $inData["modifications"];
    $dateCreated = date("Y-m-d H:m:s");

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "SmallProject");
    if( $conn->connect_error )
    {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo "{}";
    }
    else
    {
        echo "sadfasdfd";
        // check if email is associated with a contact
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=? and Email=?');
        $stmt->bind_param("is", $owner, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ( $row = $result->fetch_assoc()  )
        {
            $oldphone = $row["Phone"];
            $oldemail = $row["Email"];
            $oldfirst = $row["FirstName"];
            $oldlast = $row["LastName"];
        }
        else
        {
            sendResultInfoAsJson('{"result": "Error, contact with that email does not exist."}');
        }
        $stmt->close();

        if (array_key_exists("lastname", $modified))
        {
            $newlast = $modified["lastname"];
        }
        else
        {
            $newlast = $oldlast
        }
        if (array_key_exists("firstname", $modified))
        {
            $newfirst = $modified["firstname"];
        }
        else
        {
            $newfirst = $oldfirst;
        }
        if (array_key_exists("phone", $modified))
        {
            $newphone = $modified["phone"];
        }
        else
        {
            $newphone = $oldphone;
        }
        if (array_key_exists("email", $modified))
        {
            $newemail = $modified["email"];
        }
        else
        {
            $newemail = $oldemail;
        }

        // update the contact
        $newStmt = $conn->prepare('UPDATE Contacts SET Phone = ?, Email = ?, FirstName = ?, LastName = ? WHERE userID = ? AND Email = ?;');
        $newStmt->bind_param("ssssis", $newphone, $newlast, $newfirst, $newemail, $userID, $oldemail);
        if ( $newStmt->execute() ) 
        {
            $newStmt->close();
            sendResultInfoAsJson('{"result": "Contact modification succeeded."}');
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
