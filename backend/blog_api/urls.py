from django.urls import path
from .views import (BlogView, AuthorView, UserView, LikeView,
                    check_blog_like_exists, CommentBlogView,
                    CommentLikeView, check_comment_like_exists)


urlpatterns = [
    path("blogs/", BlogView.as_view()),
    path("blogs/<pk>", BlogView.as_view()),
    path("create/", BlogView.as_view()),
    path("update/<pk>", BlogView.as_view()),
    path("delete/<pk>", BlogView.as_view()),

    path("authors/", AuthorView.as_view()),
    path("authors/<pk>", AuthorView.as_view()),

    path("users/", UserView.as_view()),
    path("users/<pk>", UserView.as_view()),
    path("users/create/", UserView.as_view()),

    path("likes/<blog_item_pk>", LikeView.as_view()),
    path("likes/", LikeView.as_view()),
    path("likes/create/", LikeView.as_view()),

    path("user_blog_like/<blog_id>", check_blog_like_exists),

    path("blog/<blog_item>/comments/", CommentBlogView.as_view()),
    path("blogs/comments/", CommentBlogView.as_view()),
    path("blog/comment/create/", CommentBlogView.as_view()),
    path("comment/<pk>/update/", CommentBlogView.as_view()),
    path("comment/<pk>/delete/", CommentBlogView.as_view()),

    path("comments/likes/<comment_blog_item_pk>", CommentLikeView.as_view()),
    path("comments/likes/", CommentLikeView.as_view()),
    path("comments/likes/create/", CommentLikeView.as_view()),

    path("comment_blog_like/<comment_id>", check_comment_like_exists),


]
