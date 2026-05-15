<?php
include "db.php";

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if ($password == $user['password']) {
        echo json_encode([
  "status" => "success",
  "user_id" => $user['id'],
  "name" => $user['name']
]);
    } else {
        echo json_encode(["status" => "wrong_password"]);
    }
} else {
    echo json_encode(["status" => "no_user"]);
}
?>