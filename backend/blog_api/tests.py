import json
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from blog.models import BlogItem, BlogLike, BlogComment, CommentLike
from rest_framework.test import APIClient
from django.contrib.auth.models import User


class BlogTests(APITestCase):

    def setUp(self) -> None:
        self.first_blog = BlogItem.objects.create(title="blog title 1", body="blog body 1")
        BlogItem.objects.create(title="blog title 2", body="blog body 2")
        User.objects.create_user(username="user", password="user", email="user@user.com")

        self.client = APIClient()

        self.credentials = {
            "username": "user", "password": "user"
        }
        response = self.client.post(reverse("token_obtain_pair"), data=json.dumps(self.credentials),
                                    content_type="application/json")

        self.access_token = response.data["access"]

    def test_get_blogs(self):
        response = self.client.get(reverse("get_all_blogs"))
        self.assertEqual(len(response.data), 2)

    def test_get_blog_details(self):
        response = self.client.get(reverse("get_blog_info", kwargs={"pk": self.first_blog.id}))
        expected_data = {'id': 1, 'author': None, 'title': 'blog title 1', 'body': 'blog body 1'}

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)

    def test_post_blog(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "title": "first blog",
            "body": "first body"
        }
        response = self.client.post(reverse("create_blog"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        expected_data = {
            "title": "first blog",
            "body": "first body"
        }
        self.assertEqual(response.data, expected_data)

    def test_change_blog(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        new_data = {
            "title": "changed title",
            "body": "changed body"
        }

        response = self.client.put(reverse("update_blog", kwargs={"pk": 1}), data=new_data, format="json")

        updated_blog_from_db = BlogItem.objects.get(pk=1)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(updated_blog_from_db.title, "changed title")
        self.assertEqual(updated_blog_from_db.body, "changed body")

    def test_delete_blog(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.delete(reverse("delete_blog", kwargs={"pk": 1}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(BlogItem.objects.count(), 1)


class BlogCommentTests(APITestCase):

    def setUp(self) -> None:
        self.first_blog = BlogItem.objects.create(title="blog title 1", body="blog body 1")
        User.objects.create_user(username="user", password="user", email="user@user.com")
        self.comment_blog1 = BlogComment.objects.create(blog_item=self.first_blog, blog_body="comment_body1")
        self.comment_blog2 = BlogComment.objects.create(blog_item=self.first_blog, blog_body="comment_body2")

        self.client = APIClient()

        self.credentials = {
            "username": "user", "password": "user"
        }
        response = self.client.post(reverse("token_obtain_pair"), data=json.dumps(self.credentials),
                                    content_type="application/json")

        self.access_token = response.data["access"]

    def test_get_comments(self):
        response = self.client.get(reverse("get_all_comments"))
        self.assertEqual(len(response.data), 1)

    def test_post_comment(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "blog_item": self.first_blog.id,
            "blog_body": "new comment"
        }
        response = self.client.post(reverse("create_blog_comment"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get("blog_item"), self.first_blog.id)
        self.assertEqual(response.data.get("blog_body"), "new comment")

    def test_change_comment(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        comment_id = self.comment_blog2.id

        new_data = {
            "blog_item": self.first_blog.id,
            "blog_body": "changed comment",
            "parent": self.comment_blog1.id
        }

        response = self.client.put(reverse("update_comment", kwargs={"pk": comment_id}), data=new_data, format="json")

        updated_comment_from_db = BlogComment.objects.get(pk=comment_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(updated_comment_from_db.blog_item, self.first_blog)
        self.assertEqual(updated_comment_from_db.blog_body, "changed comment")
        self.assertEqual(updated_comment_from_db.parent, self.comment_blog1)

    def test_delete_blog(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        comment_id = self.comment_blog2.id

        response = self.client.delete(reverse("delete_comment", kwargs={"pk": comment_id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(BlogComment.objects.count(), 1)


class UserTests(APITestCase):

    def setUp(self) -> None:
        self.created_user = User.objects.create_user(username="user", password="user", email="user@user.com")
        BlogItem.objects.create(title="blog title 2", body="blog body 2", author=self.created_user)
        self.client = APIClient()

        self.credentials = {
            "username": "user", "password": "user"
        }
        response = self.client.post(reverse("token_obtain_pair"), data=json.dumps(self.credentials),
                                    content_type="application/json")

        self.access_token = response.data["access"]

    def test_get_all_users(self):
        response = self.client.get(reverse("get_all_users"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_user_details(self):
        response = self.client.get(reverse("get_user_details", kwargs={"pk": self.created_user.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("id"), self.created_user.id)
        self.assertEqual(response.data.get("email"), "user@user.com")
        self.assertEqual(response.data.get("username"), "user")

    #
    def test_get_blogs_for_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.get(reverse("get_blogs_for_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class BlogLikeTests(APITestCase):

    def setUp(self) -> None:
        self.first_blog = BlogItem.objects.create(title="blog title 1", body="blog body 1")
        self.second_blog = BlogItem.objects.create(title="blog title 2", body="blog body 2")
        self.third_blog = BlogItem.objects.create(title="blog title 3", body="blog body 3")
        self.created_user = User.objects.create_user(username="user", password="user", email="user@user.com")
        self.blog_like1 = BlogLike.objects.create(user=self.created_user, blog_item=self.first_blog)
        self.blog_like2 = BlogLike.objects.create(user=self.created_user, blog_item=self.second_blog)
        self.client = APIClient()

        self.credentials = {
            "username": "user", "password": "user"
        }
        response = self.client.post(reverse("token_obtain_pair"), data=json.dumps(self.credentials),
                                    content_type="application/json")

        self.access_token = response.data["access"]

    def test_get_all_likes(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("get_all_likes"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_blog_likes(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("get_likes_for_blog", kwargs={"blog_item_pk": self.first_blog.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_like(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "blog_item": self.third_blog.id,
        }
        response = self.client.post(reverse("create_like"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get("blog_item"), self.third_blog.id)
        self.assertTrue(response.data.get("like_id"))

    def test_delete_like(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "blog_item": self.first_blog.id,
        }
        response = self.client.post(reverse("create_like"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get("blog_item"), self.first_blog.id)
        self.assertFalse(response.data.get("like_id"))

    def test_check_like(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.get(reverse("check_like_exists", kwargs={"blog_id": self.first_blog.id}), )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data.get("result"), True)


class BlogCommentLikeTests(APITestCase):

    def setUp(self) -> None:
        self.first_blog = BlogItem.objects.create(title="blog title 1", body="blog body 1")
        self.second_blog = BlogItem.objects.create(title="blog title 2", body="blog body 2")

        self.created_user = User.objects.create_user(username="user", password="user", email="user@user.com")

        self.comment_blog1 = BlogComment.objects.create(blog_item=self.first_blog, blog_body="comment_body1")
        self.comment_blog2 = BlogComment.objects.create(blog_item=self.first_blog, blog_body="comment_body2")
        self.comment_blog3 = BlogComment.objects.create(blog_item=self.second_blog, blog_body="comment_body3")

        self.comment_like1 = CommentLike.objects.create(user=self.created_user, comment_blog_item=self.comment_blog1)
        self.comment_like2 = CommentLike.objects.create(user=self.created_user, comment_blog_item=self.comment_blog2)
        self.client = APIClient()

        self.credentials = {
            "username": "user", "password": "user"
        }
        response = self.client.post(reverse("token_obtain_pair"), data=json.dumps(self.credentials),
                                    content_type="application/json")

        self.access_token = response.data["access"]

    def test_get_all_comment_likes(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("get_all_comment_likes"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_comment_likes(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("get_comment_likes", kwargs={"comment_blog_item_pk": self.comment_blog1.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_comment_like(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "comment_blog_item": self.comment_blog3.id,
        }
        response = self.client.post(reverse("create_comment_like"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get("comment_blog_item"), self.comment_blog3.id)
        self.assertTrue(response.data.get("like_id"))

    def test_delete_like(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        data = {
            "comment_blog_item": self.comment_blog1.id,
        }
        response = self.client.post(reverse("create_comment_like"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get("comment_blog_item"), self.comment_blog1.id)
        self.assertFalse(response.data.get("like_id"))

    def test_check_comment_like(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.get(reverse("check_comment_like", kwargs={"comment_id": self.comment_blog1.id}), )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("result"), True)
