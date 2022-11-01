from django.contrib import admin
from django.urls import path,include
from .models import Post
from rest_framework.routers import SimpleRouter

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view
from L15app.api import viewsets, views


schema_view = swagger_get_schema_view(openapi.Info(title="Posts Api", default_version='1.0.0', description="API documentation of App"), public=True)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include([
        path('L15app/',include(('L15app.api.urls','L15app'),namespace='L15app')),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-schema'),
    ]))
]