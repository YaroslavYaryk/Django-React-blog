from django.contrib import admin
from .models import BlogComment, BlogItem, Author, BlogLike, CommentLike

# Register your models here.


class BlogItemAdmin(admin.ModelAdmin):

    list_display = ('id', 'title', "body", "author")
    list_display_links = ('id', 'title', "author")


class AuthorAdmin(admin.ModelAdmin):

    list_display = ('id', 'name',)
    list_display_links = ('id', 'name')


class LikeAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', "blog_item")
    list_display_links = ('id', 'user', "blog_item")


class CommentBlogAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', "blog_item", "blog_body")
    list_display_links = ('id', 'user', "blog_item")


class CommentLikeAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', "comment_blog_item")
    list_display_links = ('id', 'user', "comment_blog_item")


admin.site.register(BlogItem, BlogItemAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(BlogLike, LikeAdmin)
admin.site.register(BlogComment, CommentBlogAdmin)
admin.site.register(CommentLike, CommentLikeAdmin)
