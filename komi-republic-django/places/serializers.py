"""
Serializers for places app
"""
from rest_framework import serializers
from .models import Category, Place, PlaceImage, Review


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'name_ru', 'slug']


class PlaceImageSerializer(serializers.ModelSerializer):
    """Serializer for PlaceImage model"""
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = PlaceImage
        fields = ['id', 'url', 'caption', 'order']
    
    def get_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PlaceListSerializer(serializers.ModelSerializer):
    """Serializer for Place list view"""
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_name_ru = serializers.CharField(source='category.name_ru', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Place
        fields = [
            'id', 'name', 'name_ru', 'description', 'description_ru',
            'category_slug', 'category_name_ru', 'rating', 'image_url',
            'address', 'address_ru', 'latitude', 'longitude'
        ]
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PlaceDetailSerializer(serializers.ModelSerializer):
    """Serializer for Place detail view"""
    category = CategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    images = PlaceImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Place
        fields = [
            'id', 'name', 'name_ru', 'description', 'description_ru',
            'category', 'rating', 'image_url', 'images',
            'address', 'address_ru', 'opening_hours', 'opening_hours_ru',
            'entry_fee', 'entry_fee_ru', 'latitude', 'longitude',
            'amenities', 'is_open', 'created_at', 'updated_at'
        ]
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    
    class Meta:
        model = Review
        fields = ['id', 'place', 'author', 'rating', 'comment', 'date', 'created_at']
        read_only_fields = ['created_at']
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
