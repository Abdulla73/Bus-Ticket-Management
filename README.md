#A complete bus ticket management platform with a Laravel 12 backend and a React frontend.

#Requirements:
1. Laravel version 11 or higher
2. PHPMyAdmin or XAMPP (for database management)
3. Set up your mail address and password in the .env file (to enable OTP email verification)


#How to Run the Project:
1. Clone the repository.
2. Navigate into the project directory.
3. Set up your backend (backend/) following Laravel's installation steps.
4. Set up your frontend (frontend/) and run it using your preferred package manager (npm or yarn).
5. Run composer update and npm update.
8. Configure your .env file for the backend.
9. Database credentials
10. Mail credentials (for OTP functionality). This is important!. Without proper mail setup, you can not verify a  user.
11. Run both ends at the same time.
12. Sometimes it can take a long time to open it in the browser.

#Features
1. User Registration:
  Users must register with a valid email address to access the platform.
2. Email Verification:
  After registration, users will receive an OTP to their email to verify their account.
3. Secure Login:
  Only users with verified email addresses can log in and use the system.
4. Everyone is registered as a user by default. To make someone an admin, an admin needs to change the role in the database.
5. Users and admins can log in using credentials. It will redirect based on the role.
6. Admin can add, update, and  delete a bus, and can add and edit a ticket
7. Customer can search for  specific bus times and buy a ticket while choosing seats. 
