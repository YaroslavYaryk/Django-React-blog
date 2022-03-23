import json
from blog.models import Author, BlogItem, BlogLike, BlogComment, CommentLike
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from django.core import serializers

from django.contrib.auth.models import User

from django.forms.models import model_to_dict


class AuthorSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"


class BlogSerializer(ModelSerializer):

    author = AuthorSerializer()

    class Meta:
        model = BlogItem
        fields = "__all__"


class BlogPostSerializer(ModelSerializer):
    class Meta:
        model = BlogItem
        fields = "__all__"


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "username", "password"


class UserGetSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = [
            "password",
        ]


class LikeGetSerializer(ModelSerializer):
    class Meta:
        model = BlogLike
        fields = "__all__"


class LikeSerializer(ModelSerializer):
    class Meta:
        model = BlogLike
        fields = ("blog_item",)


class CommentPostSerializer(ModelSerializer):
    class Meta:
        model = BlogComment
        fields = "blog_item", "blog_body", "parent"


class CommentPutSerializer(ModelSerializer):
    class Meta:
        model = BlogComment
        fields = "blog_item", "blog_body", "user", "parent"


class CommentGetSerializer(ModelSerializer):

    username = SerializerMethodField("get_username")
    children_comments = SerializerMethodField("get_children_comments")

    def get_username(self, foo):
        return foo.user.username

    def get_children_comments(self, foo):
        
        return foo.children().values()

    class Meta:
        model = BlogComment
        fields = "__all__"


class CommentLikeGetSerializer(ModelSerializer):
    class Meta:
        model = CommentLike
        fields = "__all__"


class CommentLikePostSerializer(ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ("comment_blog_item",)
