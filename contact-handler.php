<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); exit("Method not allowed"); }
if (!empty($_POST["_honey"] ?? "")) { header("Location: contact.html?sent=1"); exit; }
$name = trim(strip_tags($_POST["name"] ?? ""));
$email = filter_var($_POST["email"] ?? "", FILTER_VALIDATE_EMAIL);
$topic = trim(strip_tags($_POST["topic"] ?? "Website contact"));
$message = trim(strip_tags($_POST["message"] ?? ""));
if (!$name || !$email || !$message) { header("Location: contact.html?error=1"); exit; }
$to = "ChrisGreene727@gmail.com";
$subject = "Website message: " . $topic;
$body = "Name: $name
Email: $email
Topic: $topic

$message
";
$headers = "From: website@chrisjgreene.com
Reply-To: $email
Content-Type: text/plain; charset=UTF-8
";
if (mail($to, $subject, $body, $headers)) { header("Location: contact.html?sent=1"); } else { header("Location: contact.html?error=1"); }
exit;
?>