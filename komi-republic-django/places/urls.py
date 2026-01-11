"""
URL configuration for places app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, PlaceViewSet, ReviewViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'places', PlaceViewSet, basename='place')
router.register(r'reviews', ReviewViewSet, basename='review')

app_name = 'places'

urlpatterns = [
    path('', include(router.urls)),
]
