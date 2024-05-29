from rest_framework import serializers
from .models import (Profile, Post, Post_Picture, PostComment, Conversation,
                     LikePost, Profile_Picture, Cover_Picture, Message,
                     PhotoComment, PhotoLike)

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id_user', 'username', 'first_name', 'last_name',
                  'dob', 'gender', 'profile_image', 'password', 'cover_image', 'followers',
                  'followings', 'all_posts', 'location', 'favorite_quote']
    #def get_image_url(self, obj):


class LikePostSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)

    class Meta:
        model: LikePost
        fields = ['user', 'created']
class ProfilePictureSerailizer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, source='user.id_user')
    class Meta:
        model = Profile_Picture
        fields = ['id', 'user', 'photo', 'created']

class CoverPictureSerailizer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, source='user.id_user')
    class Meta:
        model = Cover_Picture
        fields = ['id', 'user', 'photo', 'created']

class PostCommentSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    reply = serializers.PrimaryKeyRelatedField(read_only=True)
    # replies = PostReplySerializer(many=True, read_only=True)
    class Meta:
        model = PostComment
        fields = ['comment_id','post', 'user', 'comments', 'replies', 'reply', 'created']

    def get_replies(self, obj):
        rep = obj.reply
        qs = PostComment.objects.filter(reply=obj.comment_id).all()
        return PostCommentSerializer(qs, many=True).data


class PostPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post_Picture
        fields = ['id', 'image', 'created']
    
class PostSerializer(serializers.ModelSerializer):
    post_pictures = PostPictureSerializer(many=True, read_only=True)
    poster = ProfileSerializer(read_only=True)
    likers = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    # post = PostCommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['post_id', 'poster', 'words', 'created', 'post_pictures', 'all_comments', 'likers', 'comments', 'all_likes', 'all_likers']
    
    def get_comments(self, obj):
        qs = PostComment.objects.filter(post=obj).all()
        return PostCommentSerializer(qs, many=True, read_only=True).data
    def get_likers(self, obj):
        qs = LikePost.objects.filter(post=obj)
        return LikePostSerializer(read_only=True, many=True).data


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    room_name = serializers.PrimaryKeyRelatedField(read_only=True, source="conversation.room_name")

    class Meta:
        model = Message
        fields = [
            'id',
            "room_name",
            "sender",
            "receiver",
            "content",
            "created",
            "read",
        ]

    def get_sender(self, obj):
        return ProfileSerializer(obj.sender).data
    def get_receiver(self, obj):
        return ProfileSerializer(obj.receiver).data
    

class PhotoLikesSerializer(serializers.ModelSerializer):
    pass