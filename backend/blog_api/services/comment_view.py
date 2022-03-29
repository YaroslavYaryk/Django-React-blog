from blog.models import BlogItem, BlogLike, BlogComment, CommentLike
from django.contrib.auth.models import User


def get_blog_by_id(blog_id):
    return BlogItem.objects.get(pk=blog_id)


def get_user_by_id(id):
    return User.objects.get(pk=id)


def create_comment(user, blog_item, blog_body, parent):
    blog_item = get_blog_by_id(blog_item)
    parent_obj = None
    if parent:
        try:
            parent_obj = BlogComment.objects.get(id=parent)
        except:
            pass

    BlogComment.objects.create(
        blog_item=blog_item, user=user, blog_body=blog_body, parent=parent_obj
    )


def press_like_to_comment(request, comment_id):

    user = request.user
    comment = BlogComment.objects.get(id=comment_id)
    like = CommentLike.objects.filter(user=user, comment_blog_item=comment)
    print(like)
    if like:
        like.delete()  # thre is like put
    else:
        CommentLike.objects.create(user=user, comment_blog_item=comment)  # create like
