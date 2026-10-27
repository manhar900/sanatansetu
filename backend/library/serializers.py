from rest_framework import serializers
from .models import Category, SacredContent, NaamJaapSession

class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(source='contents.count', read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'code', 'name', 'sanskrit', 'description', 'count']

class SacredContentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    sanskrit_badge = serializers.SerializerMethodField()
    class Meta:
        model = SacredContent
        fields = [
            'id', 'slug', 'title', 'category', 'category_name', 'sanskrit_badge',
            'content_type', 'description', 'body_english', 'body_hindi',
            'body_sanskrit', 'image_url', 'media_url', 'author', 'language',
            'tags', 'views', 'likes', 'featured', 'created_at'
        ]
    def get_sanskrit_badge(self, obj):
        return f"{obj.category.sanskrit} · {obj.category.name}"

class NaamJaapSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaamJaapSession
        fields = ['id', 'session_key', 'mantra_name', 'mantra_sanskrit', 'chants_count', 'malas_completed', 'daily_goal', 'duration_seconds', 'created_at']
        read_only_fields = ['malas_completed', 'created_at']
