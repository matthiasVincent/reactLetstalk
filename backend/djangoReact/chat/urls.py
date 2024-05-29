from django.urls import path
from .import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import ensure_csrf_cookie

urlpatterns = [
    path("auth-token/", ensure_csrf_cookie(views.CustomObtainAuthTokenView.as_view())),
    path("signup/", ensure_csrf_cookie(views.SignUpView.as_view()), name="signup"),
    path('editprofile/', views.editprofile, name="editprofile"),
    path('profile/<str:username>/', views.profile, name="username"),
    path('post/', views.post, name="post"),
    path('api/v1/random_posts/', views.RandomPostView.as_view()), 
    path('api/v1/<str:username>/posts/', views.userposts, name="userposts"),
    path('api/v1/user/friend_suggestion/', views.UserSuggestionView.as_view()),
    path('api/v1/user/friend_request/', views.FriendRequestView.as_view()),
    path('api/v1/profile_pictures/', views.ProfilePicturesView.as_view()),
    path('api/v1/cover_pictures/', views.CoverPicturesView.as_view()),
    path('api/v1/user/buddy_list/', views.FriendView.as_view()),
    path('api/v1/posts/<str:post_id>/', views.SinglePostView.as_view()),
    path('api/v1/posts/<str:post_id>/like/', views.LikePostView.as_view()),
    path('api/v1/posts/<str:post_id>/comment/', views.PostCommentView.as_view()),
    # path('api/v1/posts/<str:post_id>/comments/', views.SinglePostCommentView.as_view()),
    # path('api/v1/posts/<str:post_id>/photos', views.SinglePostPhotosView.as_view()),
    path('api/v1/posts/<str:post_id>/comments/<str:comment_id>/reply/', views.CommentReplyView.as_view()),
    path('api/v1/posts/<str:post_id>/comments/<str:comment_id>/replies/', views.CommentRepliesView.as_view()),
    # path('api/v1/posts/<str:post_id>/comments/<str:comment_id>/likes', views.PostCommentLikesView.as_view()),
    # path('api/v1/posts/<str:post_id>/photos/<str:photo_id>/', views.SinglePostPhotosView.as_view()),

]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)