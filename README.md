# Project 2

###### Web Programming with Python and JavaScript

This project builds a chatroom web application by flask. When a user visits the web application, they creates a display name, and then joins any existing chatroom or creates a new one to send text messages. All users in the chatroom would get the messages in realtime. The project uses Socket.io, so enables realtime, bi-directional communication between web clients and servers. Except joining chatroom to chat, a user can also send private messages to a specified user.    

Demo video: https://youtu.be/yBKvLOLW-2o

## Project structure
- **application.py:** contain main code, include all view functions
- **static directory:** contains all static files, include three subdirectory: css, js and img.
- **templates directory:** contains all html files: layout.html, index.html , channel.html

## All Functionalities
- **Display Name:** When a user visits the web application for the first time, they would be prompted to type in a display name that will eventually be associated with every message the user sends. The display name also show on upper right corner, a user can click to change the name at anytime.
- **Channel Creation:** There is a button to create new channels.  Any user could create a new channel, so long as its name doesn’t conflict with the name of an existing channel.
- **Channel List:** Users could see a list of all current channels, and selecting one to join.
- **Messages View:** Once a channel is selected, the user could see any messages that have already been sent in that channel, up to a maximum of 100 messages.
- **Sending Messages:** Once in a channel, users could be able to send text messages to others the channel. When a user sends a message, their display name and the timestamp of the message would be associated with the message.
- **Remembering the Channel:** If a user is on a channel page, closes the web browser window, and goes back to the web application, the application would remember what channel the user was on previously and take the user back to that channel.
- **Personal Touch:** At homepage, a user could set up their private key, so others could use the private key to send private message to the user.

## How to run
1. Create a virtual environment and install requirements   
$ pip install -r requirements.txt
2. Set environment variables   
$ export FLASK_APP=application.py   
$ export FLASK_DEBUG=1   
3. Run the app   
$ flask run

