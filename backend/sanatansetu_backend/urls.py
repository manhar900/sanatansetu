from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from library.views import CategoryViewSet, SacredContentViewSet, NaamJaapSessionViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'contents', SacredContentViewSet, basename='sacred-content')
router.register(r'jaap-sessions', NaamJaapSessionViewSet, basename='jaap-session')

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
