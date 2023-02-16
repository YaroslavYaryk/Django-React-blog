import factory
from blog import models


class RandomBlogFactory(factory.Factory):
    class Meta:
        model = models.BlogItem

    title = factory.Faker('first_name')
    body = factory.Faker('last_name')
