from blog.models import BlogItem, BlogLike


def press_like_to_product(request, product_id):

    user = request.user
    product = BlogItem.objects.get(id=product_id)
    like = BlogLike.objects.filter(user=user, blog_item=product)

    new_like = ""
    if like:
        like.delete()  # thre is like put
    else:
        new_like = BlogLike.objects.create(user=user, blog_item=product)  # create like
    return new_like.id if new_like else None
