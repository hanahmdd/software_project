<?php
include "db.php";

// check if user_id موجود
if (!isset($_GET['user_id'])) {
    echo json_encode(["error" => "user_id is required"]);
    exit();
}

$user_id = $_GET['user_id'];

// query مع JOIN
$sql = "SELECT bookings.*, hotels.name AS hotel_name, hotels.price 
        FROM bookings
        JOIN hotels ON bookings.hotel_id = hotels.id
        WHERE bookings.user_id = '$user_id'";

$result = $conn->query($sql);

$data = [];

// لو فيه نتائج
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// رجّع JSON
echo json_encode($data);

$conn->close();
?>