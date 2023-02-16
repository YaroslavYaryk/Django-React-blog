from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class BlogItem(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, db_constraint=False, null=True)

    def __str__(self):
        return f"BlogItem({self.title}, {self.body})"


class BlogLike(models.Model):
    user = models.ForeignKey(User, verbose_name=("user"), on_delete=models.CASCADE)
    blog_item = models.ForeignKey(BlogItem, on_delete=models.CASCADE)

    def __str__(self):
        return f"BlogLike({self.user}, {self.blog_item})"


class BlogComment(models.Model):
    user = models.ForeignKey(User, verbose_name=("user"), on_delete=models.CASCADE, null=True)
    blog_item = models.ForeignKey(BlogItem, on_delete=models.CASCADE)
    blog_body = models.TextField()

    parent = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"BlogComment({self.user}, {self.blog_item}, {self.blog_body})"

    def children(self):
        return BlogComment.objects.filter(parent=self)


class CommentLike(models.Model):
    user = models.ForeignKey(User, verbose_name=("user"), on_delete=models.CASCADE)
    comment_blog_item = models.ForeignKey(BlogComment, on_delete=models.CASCADE)

    def __str__(self):
        return f"CommentLike({self.user}, {self.comment_blog_item})"
