<?php
    
    // Get query parameter
    $userID = $_GET["userID"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4431", "SmallProject");
    if( $conn->connect_error )
    {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo "{}";
    }
    else
    {
        // find any contacts associated with a userID
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=?');
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $out_array = "[";
        while ($row = $result->fetch_assoc()) {
            $out_array = sprintf("%s%s,", $out_array, json_encode($row));
        }
        $out_array = substr_replace($out_array, "", -1);
        $out_array = sprintf("%s]", $out_array);
        if(strlen($out_array) == 1) {
            $out_array = "[]";
        }
        sendResultInfoAsJson($out_array);
        $stmt->close();

    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
?>
