from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, SacredContent, NaamJaapSession
from .serializers import CategorySerializer, SacredContentSerializer, NaamJaapSessionSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SacredContentViewSet(viewsets.ModelViewSet):
    queryset = SacredContent.objects.filter(is_approved=True).select_related('category')
    serializer_class = SacredContentSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['post'])
    def like(self, request, slug=None):
        item = self.get_object()
        item.likes = models.F('likes') + 1
        item.save(update_fields=['likes'])
        item.refresh_from_db()
        return Response({'likes': item.likes})

class NaamJaapSessionViewSet(viewsets.ModelViewSet):
    queryset = NaamJaapSession.objects.all()
    serializer_class = NaamJaapSessionSerializer
