from django.contrib import admin
from .models import (
    Conversation, Message, Profile, Post, Profile_Picture,
    Post_Picture, PostComment, LikePost, Follower, Cover_Picture, Onlines)

# Register your models here.
admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(PostComment)
admin.site.register(Post_Picture)
admin.site.register(LikePost)
admin.site.register(Follower)
admin.site.register(Profile_Picture)
admin.site.register(Cover_Picture)
admin.site.register(Onlines)