from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, unique=True)
    sanskrit = models.CharField(max_length=100)
    description = models.TextField()
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.sanskrit})"

class SacredContent(models.Model):
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='contents')
    content_type = models.CharField(max_length=20, default='Text')
    description = models.TextField()
    body_english = models.TextField(blank=True)
    body_hindi = models.TextField(blank=True)
    body_sanskrit = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    media_url = models.URLField(max_length=500, blank=True)
    author = models.CharField(max_length=200, default='Traditional Sanatan Shruti')
    language = models.CharField(max_length=50, default='Sanskrit')
    tags = models.JSONField(default=list, blank=True)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-featured', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:150]
        super().save(*args, **kwargs)

class NaamJaapSession(models.Model):
    session_key = models.CharField(max_length=120, default='anonymous')
    mantra_name = models.CharField(max_length=200)
    mantra_sanskrit = models.CharField(max_length=300, blank=True)
    chants_count = models.PositiveIntegerField(default=0)
    malas_completed = models.PositiveIntegerField(default=0)
    daily_goal = models.PositiveIntegerField(default=108)
    duration_seconds = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        self.malas_completed = self.chants_count // 108
        super().save(*args, **kwargs)
