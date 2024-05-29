from django.urls import path
from . import consumer

websocket_urls = [
    path('ws/<str:room_name>/', consumer.ChatConsumer.as_asgi()),
    path("notifications/", consumer.NotificationConsumer.as_asgi()),
]