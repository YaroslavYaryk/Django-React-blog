
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path as url
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from users.views import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("blog_api.urls")),
    path("users/", include("users.urls")),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
