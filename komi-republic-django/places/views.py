"""
Views for places app
"""
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Place, Review
from .serializers import (
    CategorySerializer,
    PlaceListSerializer,
    PlaceDetailSerializer,
    ReviewSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing categories
    """
    queryset = Category.objects.filter(published=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class PlaceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing places
    """
    queryset = Place.objects.filter(published=True).select_related('category').prefetch_related('images')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'name_ru', 'description', 'description_ru', 'address', 'address_ru']
    ordering_fields = ['rating', 'created_at', 'name', 'name_ru']
    ordering = ['-rating']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PlaceDetailSerializer
        return PlaceListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category__slug=category)
        
        # Search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(name_ru__icontains=search) |
                Q(description__icontains=search) |
                Q(description_ru__icontains=search)
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured places (top rated)"""
        limit = int(request.query_params.get('limit', 4))
        places = self.get_queryset().order_by('-rating')[:limit]
        serializer = self.get_serializer(places, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and creating reviews
    """
    queryset = Review.objects.filter(published=True)
    serializer_class = ReviewSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date', 'rating', 'created_at']
    ordering = ['-date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by place
        place_id = self.request.query_params.get('place', None)
        if place_id:
            queryset = queryset.filter(place_id=place_id)
        
        return queryset
