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
5. Configure your .env file for the backend:
6. Database credentials
7. Mail credentials (for OTP functionality)

#Features
1. User Registration:
  Users must register with a valid email address to access the platform.
2. Email Verification:
  After registration, users will receive an OTP to their email to verify their account.
3. Secure Login:
  Only users with verified email addresses can log in and use the system.
