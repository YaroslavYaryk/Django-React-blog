from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from blog.models import BlogItem, BlogLike, BlogComment, CommentLike
import requests
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import (
    BlogSerializer,
    BlogPostSerializer,
    UserSerializer,
    LikeSerializer,
    LikeGetSerializer,
    CommentGetSerializer,
    CommentPostSerializer,
    UserGetSerializer,
    CommentLikeGetSerializer,
    CommentLikePostSerializer,
    CommentPutSerializer,
)
from django.contrib.auth.models import User

from .services.like_view import press_like_to_product
from .services.comment_view import create_comment, press_like_to_comment


class BlogView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        if kwargs:
            queryset = BlogItem.objects.get(pk=kwargs["pk"])
            serializer = BlogSerializer(queryset)
        else:
            queryset = BlogItem.objects.all()
            serializer = BlogSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = {**request.data, "author": request.user}
        serializer = BlogPostSerializer(data=data)

        if serializer.is_valid():
            BlogItem.objects.create(
                title=request.data["title"],
                body=request.data["body"],
                author=request.user,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        post = BlogItem.objects.get(pk=pk)
        serializer = BlogPostSerializer(instance=post, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, requset, pk):
        post = BlogItem.objects.get(pk=pk)
        post.delete()
        return Response({"message": "Item was succesfully deleted"})


class UserView(APIView):
    def get(self, request, *args, **kwargs):
        if kwargs:
            queryset = User.objects.get(pk=kwargs["pk"])
            serializer = UserGetSerializer(queryset)
        else:
            queryset = User.objects.all()
            serializer = UserGetSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = {
            "username": f"{request.data['username']}",
            "password": f"{request.data['password']}",
        }
        serializer = UserSerializer(data=data)
        print(request.data, serializer.is_valid())
        if serializer.is_valid():
            User.objects.create_user(
                username=request.data["username"], password=request.data["password"]
            )

            return Response(
                requests.post(
                    "http://127.0.0.1:8000/api/token/",
                    data={
                        "username": request.data["username"],
                        "password": request.data["password"],
                    },
                ).json(),
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if kwargs:
            queryset = BlogLike.objects.filter(blog_item__pk=kwargs["blog_item_pk"])
            serializer = LikeGetSerializer(queryset, many=True)
        else:
            queryset = BlogLike.objects.all()
            serializer = LikeGetSerializer(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            press_like_to_product(request, request.data["blog_item"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_blog_like_exists(request, blog_id):

    user = request.user
    try:
        BlogLike.objects.get(user=user, blog_item_id=blog_id)
        return Response({"result": True})
    except Exception as e:
        return Response({"result": False})


class CommentBlogView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        if kwargs:
            queryset = BlogComment.objects.filter(
                blog_item__pk=kwargs["blog_item"], parent=None
            )
            serializer = CommentGetSerializer(queryset, many=True)
        else:
            queryset = BlogComment.objects.all()
            serializer = CommentGetSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = CommentPostSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.data)
            create_comment(**serializer.data, user=request.user)
            return Response(
                CommentGetSerializer(BlogComment.objects.all(), many=True).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        post = BlogComment.objects.get(pk=pk)
        data = {**request.data, "user": request.user.id}
        serializer = CommentPutSerializer(instance=post, data=data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, requset, pk):
        post = BlogComment.objects.get(pk=pk)
        post.delete()
        return Response({"message": "Item was succesfully deleted"})


class CommentLikeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if kwargs:
            queryset = CommentLike.objects.filter(
                comment_blog_item__blog_item__pk=kwargs["comment_blog_item_pk"]
            )
            print(queryset)
            serializer = CommentLikeGetSerializer(queryset, many=True)
        else:
            queryset = CommentLike.objects.all()
            serializer = CommentLikeGetSerializer(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = CommentLikePostSerializer(data=request.data)
        print(request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            press_like_to_comment(request, request.data["comment_blog_item"])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_comment_like_exists(request, comment_id):

    user = request.user
    try:
        CommentLike.objects.get(user=user, comment_blog_item__id=comment_id)
        return Response({"result": True})
    except Exception as e:
        return Response({"result": False})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_blogs_for_user(request):

    user = request.user
    queryset = user.blogitem_set.all()

    serializer = BlogSerializer(queryset, many=True)
    return Response(serializer.data)
