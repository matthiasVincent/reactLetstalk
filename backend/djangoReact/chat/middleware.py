from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed
from urllib.parse import parse_qs
from channels.db import database_sync_to_async

User = get_user_model()


class TokenAuthentication():
    """
    simple token authentication class the authenticate client based
    on query parameters in form of token in the request url

     ?Token=646637377d727738fhhqh38989

    """

    model = None

    def get_model(self):
        "return a Token model"
        if self.model != None:
            return self.model
        from rest_framework.authtoken.models import Token
        return Token
    
    def authenticate_credentials(self, key):
        """
        get the supplied token from the url query params and 
        try to get the user to which this token belong
        
        """

        # get the token model

        model = self.get_model()
        try:
            #get the token object belong with this key
            token = model.objects.select_related("user").get(key=key)
        except model.DoesNotExist:
            raise AuthenticationFailed(_("Invalid token"))
        
        # is the user with this token active?

        if not token.user.is_active:
            raise AuthenticationFailed(_("User inactive or deleted."))
        
        return token.user
    

@database_sync_to_async
def get_user(scope):
    """
    Return the user model associated with this token
    if no instance is found, returns an Anonymous user instance
    """

    from django.contrib.auth.models import AnonymousUser

    if "token" not in scope:
        raise ValueError("Cannot find token in scope. Ypu should wrap your consumer in TokenMiddleware")
    token = scope["token"]
    user = None

    try:
        auth = TokenAuthentication()
        user = auth.authenticate_credentials(token)
    except AuthenticationFailed:
        pass
    return user or AnonymousUser




class TokenMiddleware:
    """
    custom middleware that looks for token in the query params and authenticate
    
    """

    def __init__(self, app):
        # store the ASGI app passed
        self.app = app
    
    async def __call__(self, scope, receive, send):
        """
        somehting here
        
        """
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params["token"][0]
        scope["token"] = token
        scope["user"] = await get_user(scope)

        return await self.app(scope, receive, send)