import os

from flask import Flask, jsonify, render_template, request, redirect, url_for
from flask_socketio import emit, join_room, leave_room, SocketIO, send
from collections import defaultdict
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channel_list = ["Movies", "Music"]
messages = defaultdict(list)
private_key = {}

@app.route("/")
def index():
    return render_template("index.html", channel_list=channel_list, messages=messages)

@app.route("/channels/<string:channel>")
def channels(channel):

    # Make sure the channel exists
    if channel in channel_list:
        channel = channel
        message =messages[channel]
        return render_template("channel.html", channel_list=channel_list, channel=channel, message=message)
    else:
        return redirect(url_for("index"))

@app.route("/create_channel", methods=["POST"])
def create_channel():
    new_channel = request.form.get("new_channel")

    if new_channel in channel_list:
        print('The channel already exists.')
        return jsonify({"success": False})
    else:
        channel_list.append(new_channel)
        print(channel_list)
        return jsonify({"success": True})

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(f'{username} has entered the {room} channel.', room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(f'{username} has left the {room} channel.', room=room)

@socketio.on("send message")
def message(data):
    username = data['username']
    time = datetime.now().strftime('%Y/%m/%d %H:%M')
    message = data['message']
    room = data['room']
    data = {"username": username, "time": time, "message": message}

    # Save mseeage data in currunt chennel
    messages[room].append(data)

    # Make sure messages of a channel are <= 100
    if len(messages[room]) > 100:
        messages[room].pop(0)

    emit("broadcast message",  {"username": username, "time":time, "message": message}, room=room)

@socketio.on("private key", namespace='/private')
def key(key):
    private_key[key] = request.sid
    print(f'Key added:{key} {private_key[key]}')

@socketio.on("private message", namespace='/private')
def private_message(data):
    username = data['username']
    message = data['message']
    recipient_sid = private_key[data['key']]
    private_message = f'{username}: {message}'

    emit("new private message", private_message, room=recipient_sid)


if __name__ == '__main__':
    app.run()
