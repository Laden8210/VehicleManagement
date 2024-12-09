<?php
header('Content-Type: application/json');

// Database connection settings
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "u852988086_vmisfinal";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Get the search query and category from query parameters
$searchQuery = isset($_GET['searchQuery']) ? $_GET['searchQuery'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : '';

// SQL query to fetch reminders
$sql = "SELECT id, ReminderDate AS title, DueDate AS date, ReminderStatus AS status, Remarks AS remarks 
        FROM reminders 
        WHERE (ReminderStatus LIKE ? OR Remarks LIKE ?)";

if (!empty($category)) {
    $sql .= " AND ReminderStatus = ?";
}

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "Failed to prepare the SQL query."]);
    exit();
}

// Bind parameters to the query
$searchParam = '%' . $searchQuery . '%';
if (!empty($category)) {
    $stmt->bind_param("sss", $searchParam, $searchParam, $category);
} else {
    $stmt->bind_param("ss", $searchParam, $searchParam);
}

// Execute the query
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $reminders = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($reminders);
} else {
    echo json_encode(["error" => "Failed to execute the SQL query."]);
}

$stmt->close();
$conn->close();
?>
