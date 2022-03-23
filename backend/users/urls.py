from django.urls import path
from .views import get_some

urlpatterns = [
    path("", get_some)
]
