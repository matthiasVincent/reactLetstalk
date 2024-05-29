from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .models import Conversation, Message, Onlines
from .serializers import MessageSerializer, ProfileSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class ChatConsumer(WebsocketConsumer):
    """A chat consumer to handle users chat from frontend"""

    def __init__(self, *args, **kwargs):
        """constructor to initialize chat consumer"""
        super().__init__(*args, **kwargs)
        self.auth_user = None
        self.friend_user = None
        self.notification = None
    
    def extract_friend_username(self, room_name, auth_username):
        """
        Extract friend username from the room name
        room_name is of the form:
        08109897656thjt_09176564534hyfd
        """
        usernamesArray = room_name.split('_')
        usernames = [usernamesArray[0][0:11], usernamesArray[1][0:11]]
        for username in usernames:
            if username != auth_username:
                return username
    
    def connect(self):
        """accept connection from frontend"""
        print("I am connected!")

        # check the scope and extract the room_name
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        # retrieve user object from scope
        self.auth_user = self.scope['user']
        # extract the friend username from the room_name
        self.friend_username = self.extract_friend_username(self.room_name, self.auth_user.username)
        # use the friend username to get the User object
        self.friend_user = User.objects.get(username=self.friend_username)
        print(self.room_name, self.auth_user, self.friend_user)
        # create a channel group from the room_name
        self.new_group = self.room_name
       
       # get previous conversation in the room from the backend
       # and send to the frontend once a user enters the room for the first time
        prev_msgs = Message.objects.filter(
            Q(sender=self.auth_user, receiver=self.friend_user)|
            Q(sender=self.friend_user, receiver=self.auth_user)).order_by('created').all().reverse()[:10]
        print(prev_msgs)

        # get if it exist or create a new conversation for this room_name
        # so we can tell which room a message belongs to when it arrives
        self.chat, created = Conversation.objects.get_or_create(room_name=self.new_group)

        # create notification group to handle new message in the buddy section 
        # at frontend, a global notification group
        self.room = self.room_name + "_notify"
        
        # add channel name to new group
        async_to_sync(self.channel_layer.group_add)(
            self.new_group, self.channel_name 
        )
        # add channel to group_notify notification group (global)
        async_to_sync(self.channel_layer.group_add)(
            self.room, self.channel_name
        )
        #accept the connection
        self.accept()
        
        # send previous conversation to be displayed in the frontend
        self.send(json.dumps( 
            {
                "type": "previous_messages",
                "message": MessageSerializer(prev_msgs, many=True).data
            })
        )
    
    def disconnect(self, code):
        """handles what happens in case of disconnection"""
        print("You are disconnected!")
        # remove this channel_name from the room group
        async_to_sync(self.channel_layer.group_discard)(self.new_group, self.channel_name)
        # remove channel from the room global notification group
        async_to_sync(self.channel_layer.group_discard)(self.room, self.channel_name)
        return super().disconnect(code)
    
    def receive(self, text_data):
        """Handles message reception from the frontend"""
        # get message from frontend and convert to dict object
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        print(text_data_json)
        #create new message if type of message is chat_message
        if message_type == "chat_message":
            message = text_data_json["message"]
            sender = text_data_json['sender']
            message = Message.objects.create(
                conversation=self.chat,
                sender = self.auth_user,
                receiver = self.friend_user,
                content = message
            )
            print(MessageSerializer(message).data)

            # notify user at both ends of unread message
            # only the user other than auth_user can
            # mark message as read
            async_to_sync(self.channel_layer.group_send)(
            self.room,
            {

                "type": "notify_unread",
                "room_name": self.chat.room_name,
                "sender": sender,
            })
             
            # send new message notification to this chat group
            # only within the chat component at the frontend
            async_to_sync(self.channel_layer.group_send)(
            self.new_group,
            {

                "type": "chat_message",
                "message": MessageSerializer(message).data,
                "sender": sender,
            })
            
            # send new message notification to the room global notification group
            # cut across all components at the frontend
            async_to_sync(self.channel_layer.group_send)(
            self.room,
            {

                "type": "notify_message",
                "message": MessageSerializer(message).data
            })
        # if the message type from frontend is set_read
        elif message_type == "set_read":
            room_name = text_data_json['room_name']
            friend_name = text_data_json["friendName"]
            conversation = Conversation.objects.filter(room_name=room_name).first()
            # get the messages in this room that were sent by your friend and set read to True
            # The prerogative of setting the  read status of a message is that of the other
            # user in the room
            all_unread = Message.objects.filter(conversation=conversation, read=False).all()
            all_to_read_by_me = [unread for unread in all_unread if unread.sender.username != self.auth_user.username]

            # we want to send back response to the frontend only if there is unread message
            # this is to reduce the number of unread messages in this room at frontend
            if all_to_read_by_me != []:
                for msg in all_to_read_by_me:
                    msg.read = True
                    msg.save()
                async_to_sync(self.channel_layer.group_send)(
                self.room,
                {

                    "type": "notify_read",
                    "room_name": room_name,
                })

                # notify the room global notification group
                # to adjust the seen status of this message on the concerned user buddy page
                async_to_sync(self.channel_layer.group_send)(
                self.room,
                {

                    "type": "message_read",
                    "room_name": room_name,
                    "friend_name": friend_name,
                })

        # if the message has a type seen 
        elif message_type == "seen":
            # This ensures that whenever the two users are both connected to the socket
            # messages are marked as read by the party responsible automatically
            # we are using this to adjust the seen status and read counts at the frontend
            message_id = text_data_json['message_id'] # extract the message id
            room_name = text_data_json['room_name'] # extract the room name
            sender = text_data_json['sender'] # extract the sender
            message = Message.objects.filter(id=message_id).first() #get the message object with this message_id
            if message is not None:
                # mark it as read
                message.read = True
                message.save()

                # tell the room global notification group to adjust the read status and seen count
                async_to_sync(self.channel_layer.group_send)(
                self.room,
                {

                    "type": "chat_room_read",
                    "room_name": room_name,
                    "sender": sender,
                })

    def chat_message(self, event):
        """Called when the group receive new message"""
        # to be run on all channels that subscribed to the
        # group concerened
        print(event["message"])
        message = event["message"]
        sender = event["sender"]

        # send message to all connected sockets in the frontend
        self.send(json.dumps(
            {
                "type": "chat_message",
                "message": message,
                "sender": sender,
            }
        ))

    def notify_message(self, event):
        """called when the room global notification group receive
           new message event"""
        
        # to be run on all channels that subscribed to the
        # group concerened
        print(event["message"])
        message = event["message"]

        # send message to all connected sockets in the frontend
        self.send(json.dumps(
            {
                "type": "new_message",
                "message": message
            }
        ))
    
    def notify_read(self, event):
        """called when the room global notification group receive
           read message event"""
        room_name = event['room_name']

        # notify subscribed sockets to adjust unread counts(auth_user)
        # and seen status(other user)
        self.send(
            json.dumps({
                "type": 'notify_read',
                'room_name': room_name
            })
        )
    def notify_unread(self, event):
        """called when the room global notification group receive
           unread message event"""
        room_name = event['room_name']
        sender = event["sender"]

        # notify subscribed sockets to adjust unread counts(other user)
        # and seen status(auth_user)
        self.send(
            json.dumps({
                "type": 'notify_unread',
                'room_name': room_name,
                "sender": sender
            })
        )
    
    def chat_room_read(self, event):
        """called when the room global notification group receive
           chat room read message event"""
        room_name = event["room_name"]
        sender = event["sender"]

        # notify subscribed sockets to adjust unread counts(all users)
        # and seen status(user who sent the message)
        self.send(
            json.dumps({
                "type": 'chat_room_read',
                'room_name': room_name,
                "sender": sender,
            })
        )

        # to be implemented at the frontend, if the sender is the auth_user
        # dont do anything with the unread, otherwise, increment unread for this
        # room for the user
    def message_read(self, event):
        """called when the room global notification group receive
           read message event"""
        room_name = event["room_name"]
        friend_name = event["friend_name"]

        # this is used to set the seen status of the message sender
        # when the other user reads the message
        self.send(
            json.dumps({
                "type": "message_read",
                "room_name": room_name,
                "friend_name": friend_name,
            })
        )

class NotificationConsumer(WebsocketConsumer):
    """Handles global notification
       connected Immediately a user is authenticated into
       the application through the frontend"""
    def __init__(self, *args, **kwargs):
        """Initialize this consumer"""
        super().__init__(*args, **kwargs)
        self.user = None
    
    def connect(self):
        """accept connection from frontend"""
        # get authenticated user from scope
        self.user = self.scope['user']
        # we accept the connection and create notification group for the 
        # authenticated user
        self.accept()

        # create a special group to show the online status of all users who
        # have been in a conversation with the authenticated user
        self.group = "chat_online247"
        # get or create this group in our backend
        self.onlines, created = Onlines.objects.get_or_create(name=self.group)
        # I need to see my online status too,
        # if need be
        self.onlines.onlines.add(self.user)
        # add this channel to the group
        async_to_sync(self.channel_layer.group_add)(
            self.group, self.channel_name
        )

        # send online users to the frontend
        # because buddies can log out and still login while our auth_user
        # is still connected, we use set to prevent duplicates
        # this is filtered in the frontend to extract only users that
        # have conversed with the auth_user
        async_to_sync(self.channel_layer.group_send)(
            self.group,
            {
                "type": "updated_onlines",
                "users": list(set([user.username for user in self.onlines.onlines.all()]))
            },
        )
        
        # we fetch the authenticated user previous conversations
        # cutting across different rooms
        # todo, pagination

        # get all conversation with room_name containing the currently authenticated
        # user, username
        self.rooms = Conversation.objects.filter(room_name__icontains=self.user.username).all()

        # add this channel name to the global notification group of all the chatrooms
        # the user is in to receive notification when an event occurs in the chatrooms
        for room in self.rooms:
            async_to_sync(self.channel_layer.group_add)(
                room.room_name + "_notify", self.channel_name
            )
        # we get the last message in each room
        last_message_in_rooms = [Message.objects.filter(conversation=room).order_by("-created").first() for room in self.rooms]
        # room/rooms may have been created but with messages deleted, this means
        # None may be present in our result, we need to be armed against such scenario
        safe_last_message_in_rooms = [message for message in last_message_in_rooms if message is not None]
        print(safe_last_message_in_rooms)

        # get read status of last message in each room
        # we want to send this to the frontend specifically to keep track of
        # whether the last message in each room has been read or not
        read_status_room = {message.conversation.room_name: message.read for message in safe_last_message_in_rooms}
        print(read_status_room)
        # dont send anything if last_message_in_rooms is empty
        if safe_last_message_in_rooms == []:
            print("No messages yet")
        else:   
            # send the message to the frontend, with type 'previous_conversations'
            self.send(json.dumps({
                "type": "previous_conversations",
                "messages": MessageSerializer(safe_last_message_in_rooms, many=True).data,
            }))
            # also send the read status of last message in a room to the frontend
            self.send(json.dumps({
                'type': "room_read",
                "room_read_status": read_status_room,
            }))
        
        # we want to get all the chatrooms the user belongs and get the messages yet to be read in all the rooms
        # we are only interested in unread message(s) not sent by the auth_user but his/her buddy
        room_name_dict = {}
        for room in self.rooms:
            unread = Message.objects.filter(conversation=room, read=False).all()
            unread_excluded_user = [message for message in unread if message.sender != self.user]
            room_name_dict[room.room_name] = len(unread_excluded_user)
        print(room_name_dict)
        # send this to the frontend
        self.send(
            json.dumps(
                {
                    "type": "unread_messages",
                    "count": room_name_dict,
                }
            )
        )

    def disconnect(self, code):
        """handles what happens in case of disconnection"""
        # remove channel from online group
        async_to_sync(self.channel_layer.group_discard)(
            self.group, self.channel_name
        )
        self.onlines.onlines.remove(self.user)
        # send the new onlines to other users in onlines global group
        async_to_sync(self.channel_layer.group_send)(
            self.group,
            {
                "type": "updated_onlines",
                "users": list(set([user.username for user in self.onlines.onlines.all()]))
            },
        )
       # remove channel from the global notification group of each room
        for room in self.rooms:
            async_to_sync(self.channel_layer.group_discard)(
                room.room_name + "_notify", self.channel_name
            )
        return super().disconnect(code)
    
    def notify_message(self, event):
        """called when the room global notification group receive
           new message event"""
        
        # to be run on all channels that subscribed to the
        # group concerened
        print(event["message"])
        message = event["message"]

        # send message to all connected sockets in the frontend
        self.send(json.dumps(
            {
                "type": "new_message",
                "message": message
            }
        ))
    def updated_onlines(self, event):
        """called when the Onlines group receives an event"""
        print(event["users"])
        onlines = event["users"]
        self.send(
            json.dumps(
                {
                    "type": "updated_active_users",
                    "users": onlines
                }
            )
        )

    def notify_read(self, event):
        """called when the room global notification group receive
        read message event"""
        room_name = event['room_name']

        # notify subscribed sockets to adjust unread counts(auth_user)
        # and seen status(other user)
        self.send(
            json.dumps({
                "type": 'notify_read',
                'room_name': room_name
            })
        )
    def notify_unread(self, event):
        """called when the room global notification group receive
        unread message event"""
        room_name = event['room_name']
        sender = event["sender"]

        # notify subscribed sockets to adjust unread counts(other user)
        # and seen status(auth_user)
        self.send(
            json.dumps({
                "type": 'notify_unread',
                'room_name': room_name,
                "sender": sender
            })
        )
    
    def chat_room_read(self, event):
        """called when the room global notification group receive
           chat room read message event"""
        room_name = event["room_name"]
        sender = event["sender"]

        # notify subscribed sockets to adjust unread counts(all users)
        # and seen status(user who sent the message)
        self.send(
            json.dumps({
                "type": 'chat_room_read',
                'room_name': room_name,
                "sender": sender,
            })
        )

        # to be implemented at the frontend, if the sender is the auth_user
        # dont do anything with the unread, otherwise, increment unread for this
        # room for the user
    def message_read(self, event):
        """called when the room global notification group receive
           read message event"""
        room_name = event["room_name"]
        friend_name = event["friend_name"]

        # this is used to set the seen status of the message sender
        # when the other user reads the message
        self.send(
            json.dumps({
                "type": "message_read",
                "room_name": room_name,
                "friend_name": friend_name,
            })
        )
