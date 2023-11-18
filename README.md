# Database-management
Our system is named “Reservation system for the basketball venue at National Taiwan University”. This system is designed for reserving some basketball venues that are lack of official management. So we provide a service which is able to process and display the reservation information. 


Environment:
We use Linux based OS, Ubuntu to develop our system. So make sure you have installed Linux shell to easier complete installation.
For the database management system (DBMS), we use MySQL WorkBench as our platform.
For the system, we use Bootstrap, Vue.js, Jquery.js as front-end templates. As for the back-end template, we use Python based template, Django, to do calculations and communicate with our database.


Installation:
Step 1: Download and Set up MySQL Workbench.
Step 2: Import Tables into MySQL Workbench.
Step 3: Install Python3 and pre-necessities for mysqlclient.
Step 4: Install Django and mysqlclient.
Step 5: Edit Settings.py.
Step 6: Run Server.


Explanation for Codes:
database/templates/index:
This is the html file of web.

database/static/*:
These file are the static files which html file needs. It’s worth mentioned that js/script.js is the main Vue.js file to control the actions in the system, including calling API in the back-end to communicate with MySQL database.

database/db/settings.py:
Setting file for Django project.

database/db/urls.py:
Define API’s url as a router.

database/venue_reg/views.py:
Define what each API really does.

database/venue_reg/models.py :
Django convert database’s tables into Object-oriented format and store every template in this file.
