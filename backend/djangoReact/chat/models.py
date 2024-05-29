from django.db import models
from uuid import uuid4
from django.contrib.auth.models import AbstractUser
from datetime import datetime
# Create your models here.

from django.db import models
from gdstorage.storage import GoogleDriveStorage

drive_storage = GoogleDriveStorage()

class Profile(AbstractUser):
    id_user = models.UUIDField(primary_key=True, default=uuid4)
    favorite_quote = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    profile_image = models.ImageField(upload_to="temp_file", default="blank-profile-picture.png")
    cover_image = models.ImageField(upload_to="temp_file", default="blank-profile-picture.png")
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=(('Male', 'Male'), ('Female', 'Female')), default="Male")
    created = models.DateTimeField(default=datetime.now)
    active_status = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
    
    @property
    def followers(self):
        return Follower.objects.filter(following=self).count()
    @property
    def followings(self):
        return Follower.objects.filter(follower=self).count()
    
    @property
    def all_posts(self):
        return Post.objects.filter(poster=self).count()

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    room_name = models.CharField(max_length=128)

    def __str__(self):
        return self.room_name
    
    @property
    def messages(self):
        return Message.objects.filter(conversation=self).all().order_by("-created")
    

class Message(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="receiver")
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return "From {} to {}".format(self.sender, self.receiver)


class Post(models.Model):
    post_id = models.UUIDField(default=uuid4, primary_key=True)
    poster = models.ForeignKey(Profile, on_delete=models.CASCADE)
    words = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.poster.username
    
    @property
    def all_likes(self):
        likes = LikePost.objects.filter(post=self).count()
        return likes
    
    @property
    def all_likers(self):
        likes = LikePost.objects.filter(post=self).all()
        likers = [like.user.username for like in likes]
        return likers


    @property
    def all_comments(self):
        comments = PostComment.objects.filter(post=self).count()
        return comments
    @property
    def comments(self):
        return PostComment.objects.filter(post=self).all()

    @property
    def photos(self):
        return Post_Picture.objects.filter(post=self).all()
    
    
class Post_Picture(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    post = models.ForeignKey(Post, blank=True, on_delete=models.CASCADE, related_name="post_pictures")
    image = models.ImageField(upload_to="mobile_uploads", default="blank-profile-picture.png")
    created = models.DateTimeField(auto_now_add=True)


    @property
    def total_likes(self):
        return PhotoLike.objects.filter(photo=self).count()
    
    @property
    def total_comments(self):
        return PhotoComment.objects.filter(photo=self).count()

    def __str__(self):
        return self.post.poster.username

class PhotoLike(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    photo = models.ForeignKey(Post_Picture, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"photo liked {self.user.username}"

class PhotoComment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid4)
    photo= models.ForeignKey(Post_Picture, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    comments = models.TextField(max_length=1000000)
    reply = models.ForeignKey("self",on_delete=models.CASCADE, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"comment: photo_{str(self.photo.id)}"
    
    @property
    def replies(self):
        qs = PhotoComment.objects.filter(reply=self).all()
        return qs
    
class LikePost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return "Liked by {}".format(self.user.username)

class PostComment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid4)
    post= models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    comments = models.TextField(max_length=1000000)
    reply = models.ForeignKey("self",on_delete=models.CASCADE, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.post.post_id)
    
    @property
    def replies(self):
        qs = PostComment.objects.filter(reply=self).all()
        return qs
class LikeComment(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    comment_id = models.ForeignKey(PostComment, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"liked by {self.user.username}"
    
class Follower(models.Model):
    follower = models.ForeignKey(Profile, related_name="follower", on_delete=models.CASCADE)
    following = models.ForeignKey(Profile, related_name="following", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} following {}".format(self.follower.username, self.following.username)
    
class Profile_Picture(models.Model): 
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="profile_pictures", storage=drive_storage)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
    
class Cover_Picture(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="cover_pictures", storage=drive_storage)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class Onlines(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=30)
    onlines = models.ManyToManyField(to=Profile, blank=True)

    def __str__(self):
        return self.name