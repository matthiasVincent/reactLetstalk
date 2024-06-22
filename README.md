## Description
Letstalk is a simple clone of modern social media application with design focus on user friendly interface, 
Mobile first design approach, responsiveness and a captivating interface. 
Letstalk was basically conceived to solidify my personal self-taught researches on full stack web 
application and also to put into judicious use the knowledge I gained through my ALX SE sojourn 
to develop a real-world application. The features implemented in Letstalk includes:
- User Authentication and Authorization using django backend.
- Following and unfollowing other user.
- Creating post with post images, liking posts and post images and commenting on same.
- A nicely designed and intuitive user profile page that renders dynamically depending on the user viewing the page.
- Setting feature for user information updates.
- Real-time conversation with buddies.
- Mobile friendly interface with intentional attention to aesthetics.

Since Letstalk is a full stack web application, it has both frontend and backend

### Frontend
Frontend was implemented using ReactJS. Read through this [tutorial](https://create-react-app.dev/docs/getting-started/) 
on how to create a new react app using `create-react-app`. Alternatively, you can navigate into the folder containing the 
`package.json` file and run
```
bash
npm install
``` 
to install all the dependencies.

To run the app locally, navigate to the folder containing the `package.json` file and run 
```
bash
npm start
```
By now, your backend should be set up already.

Since, react app is basically static, you can easily serve it in production using web server like nginx.
Run 
```
bash
npm run build
```
to build the optimized production build and let nginx serve it. Check the `nginx.conf` file to see how I did this.


### Backend
Letstalk was designed using `Linux OS, ubuntu` as my backend server, `nginx `as web server and reverse proxy server,
`MySQL` as backend database and `Django` as web framework. 
Also, `Gunicorn` was used as an application server to service `http` requests while `daphne` was used to service `websocket` request.
My API was designed using `Djangorestframework`.

You have to do the following to setup the backend:
- **Procuring a virtual private server with Linux Os, ubuntu flavor**. 
  You can have it locally on Windows by installing `window subsystems for Linux(WSL)` and thereafter install ubuntu using
```
bash
wsl –install
```
The command will install ubuntu flavor of Linux OS on your windows Operating system.

With this out of the way, you can proceed with the following:
 * Installing and configuring nginx as both webserver and reverse proxy server.
  [This Tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04) may be helpful.
 * Create virtual environment to manage package dependencies, refer to this 
 [tutorial](https://www.freecodecamp.org/news/how-to-manage-python-dependencies-using-virtual-environments/) for a quick tour on how to manage dependencies using virtual environment in python.
 * Install the dependencies by running the command
```
bash
pip3 install -r requirements.txt
```
 on Mac or Linux or 
```
bash
pip install -r requirements.txt
```
on Windows assuming you have already clone this repository using 
```
bash
git clone git@github.com:matthiasVincent/reactLetstalk.git
```
and activated your virtual environment.
 * Navigate to the base directory(one containing the `manage.py file`) and run migrations. 
  If you are using `sqlite3`, the default database created by Django, you don’t need anything extra otherwise 
  make sure you go through the documentation of your relational database management system of choice and get the driver required for python communication.
  I used `MySQL` with `mysqlclient` as the driver. Create a superuser after running
```
bash
python3 manage.py createsuperuser
```

Follow the prompt from the terminal after running this command to create the superuser.

Check the configuration files included in this repo on how to set up `daphne to serve websocket` requests and `gunicorn` to service https and also to start them on server boot.


### Contributor
  [Matthias Sunday Oduh](https://github.com/matthiasVincent), check my portfolio site [here](https://Matthias28908ue14.pythonanywhere.com)
