"""
ASGI config for djangoReact project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoReact.settings')

djangoapp = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urls
from chat.middleware import TokenMiddleware

application = ProtocolTypeRouter({
    "http": djangoapp,
    "websocket": TokenMiddleware(URLRouter(websocket_urls)),
})