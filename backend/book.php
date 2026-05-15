<?php
include "db.php";

$user_id = $_POST['user_id'];
$hotel_id = $_POST['hotel_id'];
$checkin = $_POST['checkin'];
$checkout = $_POST['checkout'];

$sql = "INSERT INTO bookings (user_id, hotel_id, checkin, checkout)
VALUES ('$user_id', '$hotel_id', '$checkin', '$checkout')";

if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    echo "error";
}
?>