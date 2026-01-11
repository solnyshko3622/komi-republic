"""
Models for Komi Republic tourist attractions
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    """Category model for places"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Название (EN)")
    name_ru = models.CharField(max_length=100, verbose_name="Название (RU)")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")
    published = models.BooleanField(default=True, verbose_name="Опубликовано")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['name']

    def __str__(self):
        return self.name_ru


class Place(models.Model):
    """Place/Attraction model"""
    name = models.CharField(max_length=200, verbose_name="Название (EN)")
    name_ru = models.CharField(max_length=200, verbose_name="Название (RU)")
    description = models.TextField(verbose_name="Описание (EN)")
    description_ru = models.TextField(verbose_name="Описание (RU)", blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='places',
        verbose_name="Категория"
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name="Рейтинг"
    )
    image = models.ImageField(
        upload_to='places/images/',
        blank=True,
        null=True,
        verbose_name="Главное изображение"
    )
    address = models.CharField(max_length=300, verbose_name="Адрес (EN)")
    address_ru = models.CharField(max_length=300, verbose_name="Адрес (RU)", blank=True)
    opening_hours = models.CharField(max_length=200, blank=True, verbose_name="Часы работы (EN)")
    opening_hours_ru = models.CharField(max_length=200, blank=True, verbose_name="Часы работы (RU)")
    entry_fee = models.CharField(max_length=100, blank=True, verbose_name="Стоимость входа (EN)")
    entry_fee_ru = models.CharField(max_length=100, blank=True, verbose_name="Стоимость входа (RU)")
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name="Широта"
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name="Долгота"
    )
    amenities = models.JSONField(default=list, blank=True, verbose_name="Удобства")
    is_open = models.BooleanField(default=True, verbose_name="Открыто")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")
    published = models.BooleanField(default=True, verbose_name="Опубликовано")

    class Meta:
        verbose_name = "Место"
        verbose_name_plural = "Места"
        ordering = ['-rating', 'name_ru']

    def __str__(self):
        return self.name_ru


class PlaceImage(models.Model):
    """Additional images for places"""
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Место"
    )
    image = models.ImageField(upload_to='places/gallery/', verbose_name="Изображение")
    caption = models.CharField(max_length=200, blank=True, verbose_name="Подпись")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")

    class Meta:
        verbose_name = "Изображение места"
        verbose_name_plural = "Изображения мест"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.place.name_ru} - Image {self.order}"


class Review(models.Model):
    """Review model for places"""
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name="Место"
    )
    author = models.CharField(max_length=100, verbose_name="Автор")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Оценка"
    )
    comment = models.TextField(verbose_name="Комментарий")
    date = models.DateTimeField(verbose_name="Дата")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")
    published = models.BooleanField(default=True, verbose_name="Опубликовано")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-date']

    def __str__(self):
        return f"{self.author} - {self.place.name_ru} ({self.rating}/5)"
