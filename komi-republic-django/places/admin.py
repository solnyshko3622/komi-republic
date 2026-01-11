"""
Admin configuration for places app
"""
from django.contrib import admin
from .models import Category, Place, PlaceImage, Review


class PlaceImageInline(admin.TabularInline):
    """Inline admin for place images"""
    model = PlaceImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model"""
    list_display = ('name_ru', 'name', 'slug', 'published', 'created_at')
    list_filter = ('published', 'created_at')
    search_fields = ('name', 'name_ru', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    """Admin for Place model"""
    list_display = ('name_ru', 'category', 'rating', 'is_open', 'published', 'created_at')
    list_filter = ('category', 'published', 'is_open', 'created_at')
    search_fields = ('name', 'name_ru', 'description', 'description_ru', 'address', 'address_ru')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PlaceImageInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'name_ru', 'category', 'rating', 'published')
        }),
        ('Описание', {
            'fields': ('description', 'description_ru')
        }),
        ('Изображение', {
            'fields': ('image',)
        }),
        ('Адрес и координаты', {
            'fields': ('address', 'address_ru', 'latitude', 'longitude')
        }),
        ('Дополнительная информация', {
            'fields': ('opening_hours', 'opening_hours_ru', 'entry_fee', 'entry_fee_ru', 'amenities', 'is_open')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PlaceImage)
class PlaceImageAdmin(admin.ModelAdmin):
    """Admin for PlaceImage model"""
    list_display = ('place', 'caption', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('place__name', 'place__name_ru', 'caption')
    ordering = ('place', 'order')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Admin for Review model"""
    list_display = ('author', 'place', 'rating', 'date', 'published', 'created_at')
    list_filter = ('rating', 'published', 'date', 'created_at')
    search_fields = ('author', 'comment', 'place__name', 'place__name_ru')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-date',)
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('place', 'author', 'rating', 'date', 'published')
        }),
        ('Отзыв', {
            'fields': ('comment',)
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# Customize admin site
admin.site.site_header = "Администрирование Туризм Республики Коми"
admin.site.site_title = "Туризм РК"
admin.site.index_title = "Управление контентом"
