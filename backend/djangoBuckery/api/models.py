from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('USER', 'Regular User'),
    )
    
    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES, 
        default='USER'
    )
    nama_lengkap = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        # Set is_staff and is_superuser based on user_type
        if self.user_type == 'ADMIN':
            self.is_staff = True
            self.is_superuser = True
        elif self.user_type == 'STAFF':
            self.is_staff = True
            self.is_superuser = False
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    class Meta:
        permissions = [
            ("can_access_admin", "Can access admin site"),
        ]

#CRUD DATABASE

# KATEGORI 

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(
        null=True,  #klo null ada defaultnya
        blank=True,  
        default="Default category description"  
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name
    
#PRODUK

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class HeroImage(models.Model):
    image = models.ImageField(upload_to='hero/')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

#TENTANG KAMI
class TimelineEvent(models.Model):
    year = models.CharField(max_length=4)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='timeline/', null=True, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'year']

    def __str__(self):
        return f"{self.year} - {self.title}"

class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('FOUNDER', 'Founder'),
        ('TEAM', 'Team Member')
    ]
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    quote = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='team/', null=True, blank=True)
    member_type = models.CharField(max_length=10, choices=ROLE_CHOICES, default='TEAM')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.role}"
