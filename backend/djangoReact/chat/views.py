from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from .serializers import (ProfileSerializer, PostSerializer, ProfilePictureSerailizer, CoverPictureSerailizer,
    PostCommentSerializer)
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from .models import (Profile, Post, PostComment, Post_Picture, Follower,
                     Profile_Picture, Cover_Picture, Conversation, Message,
                     LikePost)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from random import shuffle

User = get_user_model()

# Create your views here.
class RandomPostView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.user.username
        user = Profile.objects.filter(username=username).first()
        print(username)
        posts = Post.objects.filter(poster=user).all()
        post_list = [post for post in Post.objects.all()]
        print(posts)
        shuffle(post_list)
        serializer = PostSerializer(post_list, many=True).data
        return Response(serializer)

def userposts(request, username):
    print(username)
    user = Profile.objects.filter(username=username).first()
    posts = Post.objects.filter(poster=user).all().order_by('-created')
    serializer = PostSerializer(posts, many=True).data
    return JsonResponse({'data': serializer})

class SinglePostView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        post_id = kwargs.get('post_id', None)
        post = Post.objects.filter(post_id=post_id).first()
        # print(post_id)
        return Response(PostSerializer(post).data)
    
class PostCommentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        post_id = kwargs.get('post_id', None)
        commenter = request.data['commenter']
        comment = request.data['comment']
        print(post_id, commenter)
        post = Post.objects.filter(post_id=post_id).first()
        user = Profile.objects.filter(username=commenter).first()
        comment = PostComment.objects.create(post=post, user=user, comments=comment)
        comment.save()
        return Response(PostCommentSerializer(comment).data)


class UserPostView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.GET['username']
        print(username)
        user = Profile.objects.filter(username=username).first()
        posts = Post.objects.filter(poster=user).all().reverse()
        print(posts)
        serializer = PostSerializer(posts, many=True).data
        return Response(serializer)

class UserSuggestionView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        print(username)
        user = Profile.objects.filter(username=username).first()
        followers = Follower.objects.filter(following=user).all()
        following = Follower.objects.filter(follower=user).all()
        profile_followers = [user.follower for user in followers]
        profile_following = [user.following for user in following]
        friend_request = [user for user in profile_followers if user not in profile_following]
        user_you_can_follow = [us for us in User.objects.all() if us not in profile_following and us != user]
        actual_user_you_can_follow = [user for user in user_you_can_follow if user not in friend_request]
        print(user_you_can_follow)
        shuffle(actual_user_you_can_follow)
        serializer = ProfileSerializer(actual_user_you_can_follow, many=True).data
        return Response(serializer)

class FriendRequestView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        user = Profile.objects.filter(username=username).first()
        followers = Follower.objects.filter(following=user).all()
        following = Follower.objects.filter(follower=user).all()
        profile_followers = [user.follower for user in followers]
        profile_following = [user.following for user in following]
        friend_request = [user for user in profile_followers if user not in profile_following]
        serializer = ProfileSerializer(friend_request, many=True).data
        return Response(serializer)
class FriendView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        user = Profile.objects.filter(username=username).first()
        followers = Follower.objects.filter(following=user).all()
        following = Follower.objects.filter(follower=user).all()
        profile_followers = [user.follower for user in followers]
        profile_following = [user.following for user in following]
        buddy = [user for user in profile_followers if user in profile_following]
        print("buddy list:", buddy)
        serializer = ProfileSerializer(buddy, many=True).data
        return Response(serializer)


class ProfilePicturesView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        post_id = kwargs.get('post_id', None)
        comment_id = kwargs.get('comment_id', "None")
        commenter = request.data['username']
        comment = request.data['reply']
        print(post_id, commenter)
        post = Post.objects.filter(post_id=post_id).first()
        user = Profile.objects.filter(username=commenter).first()
        comment = PostComment.objects.create(post=post, user=user, comments=comment)
        comment.save()
        return Response(PostCommentSerializer(comment).data)

    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        user = Profile.objects.filter(username=username).first()
        photos = Profile_Picture.objects.filter(user=user).all()
        serializer = ProfilePictureSerailizer(photos, many=True).data
        return Response(serializer)
    
class LikePostView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        user = Profile.objects.filter(username=username).first()
        post_id = kwargs.get('post_id', None)
        post = Post.objects.get(post_id=post_id)
        likepost = LikePost.objects.filter(post=post, user=user).first()
        if likepost is not None:
            likepost.delete()
            return Response({'like': False})
        else:
            new_like = LikePost.objects.create(post=post, user=user)
            new_like.save()
            return Response({"like": True})

class CoverPicturesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username')
        user = Profile.objects.filter(username=username).first()
        photos = Cover_Picture.objects.filter(user=user).all()
        serializer = CoverPictureSerailizer(photos, many=True).data
        return Response(serializer)
    
class CommentReplyView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        post_id = kwargs.get('post_id', None)
        comment_id = kwargs.get('comment_id', None)
        commenter = request.data['username']
        reply = request.data['reply']
        print(post_id, commenter)
        post = Post.objects.filter(post_id=post_id).first()
        comment = PostComment.objects.filter(comment_id=comment_id).first()
        user = Profile.objects.filter(username=commenter).first()
        comment_reply = PostComment.objects.create(post=post, user=user, comments=reply, reply=comment)
        return Response(PostCommentSerializer(comment_reply).data)
    
class CommentRepliesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        post_id = kwargs.get('post_id', None)
        comment_id = kwargs.get('comment_id', None)
        comment = PostComment.objects.filter(comment_id=comment_id).first()
        replies = PostComment.objects.filter(reply=comment).all()

        return Response(PostCommentSerializer(replies, many=True).data)




class CustomObtainAuthTokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            profile = ProfileSerializer(user).data
            print(user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": profile})
        return Response({"msg": "invalid credentials! password/username incorrect"}, status=HTTP_400_BAD_REQUEST)
    

class SignUpView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ProfileSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        print(serializer)
        print(serializer.is_valid())
        # first_name = serializer.validated_data["first_name"]
        # last_name = serializer.validated_data["last_name"]
        # phone_number = serializer.validated_data["username"]
        # password = serializer.validated_data["password"]
        # gender = serializer.validated_data["gender"]
        # dob = serializer.validated_data["dob"]
        # print(first_name,last_name,phone_number,password, gender,dob)
        if serializer.is_valid():
            first_name = serializer.validated_data["first_name"]
            last_name = serializer.validated_data["last_name"]
            phone_number = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            gender = serializer.validated_data["gender"]
            dob = serializer.validated_data["dob"]
            print(first_name,last_name,phone_number,password, gender,dob)
            user = User(username=phone_number, password=password, first_name=first_name,
                                            last_name=last_name, gender=gender, dob=dob)
            user.set_password(password)
            user.save()
            return Response({'status': 'OK'}, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@csrf_exempt
def editprofile(request):
     # might be done using ajax
     if request.method == 'POST':
        print(request.POST)
        if 'profile_img_edit' in request.POST:
            user = Profile.objects.get(username=request.POST['username'])
            profile_img = request.FILES['profile_img']
            user.profile_image = profile_img
            user.save()
            profile_photos = Profile_Picture(user=user, photo=profile_img)
            try: 
                profile_photos.save()
            except:
                pass
            data = ProfileSerializer(user).data
            return JsonResponse({"data": data})
        elif 'cover_img_edit' in request.POST:
            user = Profile.objects.get(username=request.POST['username'])
            cover_img = request.FILES['cover_img']
            print(cover_img)
            user.cover_image = cover_img
            user.save()
            cover_photos = Cover_Picture(user=user, photo=cover_img)
            try:
                cover_photos.save()
            except:
                pass
            data = ProfileSerializer(user).data
            return JsonResponse({"data": data})
        elif 'name_edit' in request.POST:
            user = Profile.objects.get(username=request.POST['username'])
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            data = ProfileSerializer(user).data
            return JsonResponse({"data": data})
        elif 'quote_edit' in request.POST:
            user = Profile.objects.get(username=request.POST['username'])
            favorite_quote = request.POST['bio']
            print(favorite_quote)
            user.favorite_quote = favorite_quote
            user.save()
            data = ProfileSerializer(user).data
            return JsonResponse({"data": data})
        elif 'dob_edit' in request.POST:
            user = Profile.objects.get(username=request.POST['username'])
            dob = request.POST['dob']
            user.dob = dob
            user.save()
            data = ProfileSerializer(user).data
            return JsonResponse({"data": data})
        elif 'location_edit' in request.POST:
            user = Profile.objects.get(username=request.POST['username'])
            location = request.POST['location']
            user.location = location
            user.save()
            data = ProfileSerializer(user).data
            return JsonResponse({"data": data})
        elif 'follow' in request.POST:
            # ajax will handle this
            #user = Profile.objects.get(username=request.POST['username'])
            follower = request.POST['follower']
            following = request.POST['following']
            logged_in = Profile.objects.filter(username=follower).first()
            profile_user = Profile.objects.filter(username=following).first()
            print(profile_user, logged_in)
            check = Follower.objects.filter(follower=logged_in,following=profile_user).first()
            print(check)
            if check is not None:
                check.delete()
                return JsonResponse({'btn_text': "follow"})
            else:
                check = Follower.objects.create(follower=logged_in, following=profile_user)
                check.save()
                return JsonResponse({'btn_text': "unfollow"})
        elif 'dm' in request.POST:
            sender = request.POST['sender']
            receiver = request.POST['receiver']
            sender_lastname = request.POST['sender_lastname']
            receiver_lastname = request.POST['receiver_lastname']
            # remove any space between last_name
            editFriendLastName = "".join(receiver_lastname.strip().split(' '))
            editAuthLastName = "".join(sender_lastname.strip().split(' '))
            fullNameAuth = sender + editAuthLastName
            fullNameFriend = receiver + editFriendLastName
            name_array_sort = sorted([fullNameAuth, fullNameFriend])
            # create room name taking at most 15 characters from user and friend fullname
            room_name = name_array_sort[0][0:15] + "_" + name_array_sort[1][0:15]
            dm = request.POST['message']
            chat = Conversation.objects.filter(room_name=room_name).first()
            if chat is None:
                chat = Conversation.objects.create(room_name=room_name)
                chat.save()
                sender_profile = Profile.objects.filter(username=sender).first()
                receiver_profile = Profile.objects.filter(username=receiver).first()
                new_message = Message.objects.create(conversation=chat, sender=sender_profile, receiver=receiver_profile, content=dm)
                new_message.save()
                return JsonResponse({'status': 'Message successfully sent!'})
            sender_profile = Profile.objects.filter(username=sender).first()
            receiver_profile = Profile.objects.filter(username=receiver).first()
            new_message = Message.objects.create(conversation=chat, sender=sender_profile, receiver=receiver_profile, content=dm)
            new_message.save()
            return JsonResponse({'status': 'Message successfully sent!'})
     return JsonResponse({"data" : "something went wrong"})

def profile(request, username):
    profile = User.objects.filter(username=username).first()
    data = ProfileSerializer(profile).data

    return JsonResponse({'data':data})

# @ensure_csrf_cookie  
# def signup(request):
#     if request.method == 'POST':
#         first_name = request.POST['firstName']
#         last_name = request.POST['lastName']
#         phone_number = request.POST['phoneNum']
#         password = request.POST['password']
#         gender = request.POST['gender']
#         dob = request.POST['dob']
#         print(first_name,last_name,phone_number,password, gender,dob)
#         user = User(username=phone_number, password=password, first_name=first_name,
#                                         last_name=last_name, gender=gender, dob=dob)
#         user.set_password(password)
#         user.save()
#         return JsonResponse({"status": "OK"})
#     return JsonResponse({"msg": "wrong method"})

@csrf_exempt
def post(request):
    if request.method =='POST':
        username = request.POST['username']
        print(username)
        user = User.objects.get(username=username)
        #print(request.FILES)
        #print(request.POST['post_image'])
        if "post_image" not in request.FILES:
             print("only words")
             words = request.POST['words']
             new_post = Post.objects.create(poster=user, words=words)
             new_post.save()
             return JsonResponse({'data': PostSerializer(new_post).data})
        elif 'words' not in request.POST:
            print("only image")
            post_images = request.FILES['post_image']
            new_post = Post.objects.create(poster=user)
            new_post.save()
            for field in post_images.keys():
                for pic in request.FILES.getlist(field):
                    post_pics = Post_Picture(post=new_post, image=pic)
                    post_pics.save()
            return JsonResponse({'data': PostSerializer(new_post).data})
        else:
            print("else block")
            words = request.POST['words']
            post_images = request.FILES
            print(post_images)
            new_post = Post.objects.create(poster=user, words=words)
            new_post.save()
            for field in post_images.keys():
                for pic in request.FILES.getlist(field):
                    post_pics = Post_Picture(post=new_post, image=pic)
                    post_pics.save()
            return JsonResponse({'data': PostSerializer(new_post).data})
    return JsonResponse({'msg': "Something went wrong"})