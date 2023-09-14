# SPA Mini Chat
## Description:
This is a Single Page Application (SPA) mini forum where users can register with valid credentials, benefiting from both front-end and back-end validation. Registered users receive a CSRF token and an email notification confirming their registration. Once registered, users can create posts with the option to attach images or text. They can also comment on posts made by other users.

## Features
**User Registration:** New users can register with valid credentials, ensuring data integrity and security.

**CSRF Token:** Registered users receive a CSRF token for enhanced security.

**Email Notifications:** Users receive email notifications to confirm their successful registration.

**Post Creation:** Users can create posts with the ability to attach images or text.

**Commenting:** Users can comment on posts made by other users, fostering community interaction.

**Sorting Options:** Posts can be displayed in either Last-In-First-Out (LIFO) or First-In-First-Out (FIFO) order, giving users flexibility in how they view content.

**Image Resizing:** All attached images are automatically resized to a consistent 320x240px resolution for a uniform viewing experience.

**Text Handling:** Text content is rigorously checked for size and securely saved in a static folder.

**Image Display:** Attached images are displayed with a smooth transition effect using the transition-timing-function: ease-in-out CSS property.

**Error Handling:** Users attempting to use incorrect or unauthorized methods (e.g., through Postman or browser dev tools) receive informative error messages, indicating which fields require correction.

This project aims to provide a user-friendly and secure platform for discussions and interactions, making it an ideal choice for a mini forum or chat application.

##Technologies Used
Front-end: HTML, CSS, JavaScript, Vue.js
Back-end: Node.js, Express.js
Database: MySQL
Email Notifications: Nodemailer sendgrid transport
##Installation
To run this project locally, follow these steps:

Clone the repository to your local machine.

In const.dev.ts file apply you credentials for database and SENDGRID, in index.html change var HOST by ip where you will
launch(127.0.0.1 for ex if it is localhost)

Start the application.





