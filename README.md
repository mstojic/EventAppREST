# Event App REST API

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Use Case Diagram](#use-case-diagram)
- [Activity Diagram](#activity-diagram)
- [Directory Structure](#directory-structure)
- [Models](#models)
- [Getting Started](#getting-started)
- [Routes](#routes)
- [Views](#views)
- [References](#references)
- [Team Members](#team-members)

## Introduction

The Event App aims to aggregate various events in one place. The application has different user roles: **Guest**, **User**, **Organizer**, and **Administrator**. Each role has different functionalities and permissions within the app.

## Technologies Used

- **Node.js**
- **MongoDB**
- **Socket.io**
- **Bootstrap**

## Use Case Diagram

![image](https://github.com/mstojic/EventAppREST/assets/73257172/8bf22668-6bfb-4163-bfdf-bd057166ad7c)


## Activity Diagram

![image](https://github.com/mstojic/EventAppREST/assets/73257172/a3131b69-8d8f-4fbe-b37b-0caf4fc7bc52)

## Directory Structure

- `models`: Contains application models like Event, User, Category, etc.
- `node_modules`: Contains installed modules.
- `public`: Contains static files like CSS, JS, and images.
- `routes`: Contains application routes.
- `views`: Contains application views.

## Models

- **Event Model**
- **User Model**
- **Location Model**
- **Category Model**
- **Role Model**
- **Reservation Model**
- **Chat Model**
- **Message Model**

## Getting Started

1. **Prerequisites**: To run the application, you need to have MongoDB installed and set up (Connection String: mongodb://localhost:27017).
2. **Clone the repository**: `git clone https://github.com/mstojic/EventAppREST.git`
3. **Navigate to the project directory** and **install dependencies**: `npm install`
4. **Start the application**: `npm start`


## Routes

### Public Routes

- `POST /register`: Route for registering new users. Requires username/email, user's name, and password. Users can also choose whether they want to be an organizer or not.
- `POST /login`: Route for logging into the application. Requires username/email. The request is handled by the Passport module.
- `GET /`: Route for fetching the application's homepage.
- `GET /events`: Route for displaying all events available in the application.
- `GET /events/:id`: Route for displaying a specific event.

### 8.2. Routes Accessible by Users with the 'User' Role:

- `POST /events/reserve`: Route for sending an event reservation.
- `DELETE /events/unreserve`: Route for removing an event reservation.
- `GET /events/user`: Route for displaying all events reserved by the user.
- `POST /chats`: Route for creating a chat instance between the user and the organizer after the user clicks on 'Have questions?'.
- `GET /chats`: Route for fetching all chat instances related to the user. The user can access each chat instance from here.
- `GET /chats/:id`: Route for displaying a specific chat instance. Messages can be exchanged between the user and the organizer via WebSockets.

### 8.3. Routes Accessible by Users with the 'Organizer' Role:

- `POST /events`: Route for creating a new event. Requires event name, date, category, location, and image. Description is optional.
- `PUT /events/:id`: Route for updating an event. Fields are pre-filled with existing event data, which can then be modified. The requirements are the same as for creating an event.
- `DELETE /events/:id`: Route for deleting created events. The delete option is only displayed to the organizer who owns the event.
- `GET /events/organizer`: Route for displaying events organized by the organizer. Options to add, edit, and delete existing events are available.
- `GET /chats`: Route for fetching all chat instances related to the organizer. The organizer can access each chat instance from here.
- `GET /chats/:id`: Route for displaying a specific chat instance. Messages can be exchanged between the user and the organizer via WebSockets.

### 8.4. Routes Accessible by Users with the 'Administrator' Role:

- `POST /events`: Route for creating a new event. Requires event name, date, category, location, and image. Description is optional.
- `PUT /events/:id`: Route for updating an event. Fields are pre-filled with existing event data, which can then be modified. The requirements are the same as for creating an event.
- `DELETE /events/:id`: Route for deleting created events. The administrator has the option to delete all events in the application.
- `GET /events/admin`: Route for displaying all events within the application.
- `POST /users`: Route for creating a new user. Requires username, person's name, password, and user role.
- `PUT /users/:id`: Route for updating a user. Fields are pre-filled with existing user data, which can then be modified. The requirements are the same as for creating a user.
- `DELETE /users/:id`: Route for deleting created users. The administrator has the option to delete all users in the application.
- `GET /users`: Route for displaying all users within the application.
- `POST /categories`: Route for creating a new category. Requires category name.
- `PUT /categories/:id`: Route for updating a category. The name is pre-filled with the current category name, which can then be modified.
- `DELETE /categories/:id`: Route for deleting created categories. The administrator has the option to delete all categories in the application.
- `GET /categories`: Route for displaying all categories within the application.
- `POST /locations`: Route for creating a new location. Requires location name.
- `PUT /locations/:id`: Route for updating a location. The name is pre-filled with the current location name, which can then be modified.
- `DELETE /locations/:id`: Route for deleting created locations. The administrator has the option to delete all locations in the application.
- `GET /locations`: Route for displaying all locations within the application.
- `POST /roles`: Route for creating a new role. Requires role name.
- `PUT /roles/:id`: Route for updating a role. The name is pre-filled with the current role name, which can then be modified.
- `DELETE /roles/:id`: Route for deleting created roles. The administrator has the option to delete all roles in the application.
- `GET /roles`: Route for displaying all roles within the application.

## Views

- **Home Page**
- **Event List**
- **Single Event View**
- **Admin Dashboard**
- **Chat Views**

## References

- [GitHub Repository](https://github.com/mstojic/EventAppREST)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Socket.io Documentation](https://socket.io/docs/)

## Team Members

- **Matej Stojić**: [matej.stojic@fsre.sum.ba](mailto:matej.stojic@fsre.sum.ba)
- **Filip Oroz**: [filip.oroz@fsre.sum.ba](mailto:filip.oroz@fsre.sum.ba)
