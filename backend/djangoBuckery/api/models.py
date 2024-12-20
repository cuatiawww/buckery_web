from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

# CUSTOM USER
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('USER', 'Regular User'),
    )
    # Atribut private/protected
    user_type = models.CharField(
        max_length=10, 
        choices=USER_TYPE_CHOICES, 
        default='USER'
    )
    nama_lengkap = models.CharField(max_length=255)
    # Method ensk
    def save(self, *args, **kwargs):
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
    # Method override
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    class Meta:
        permissions = [
            ("can_access_admin", "Can access admin site"),
        ]

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"


# KATEGORI 

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(
        null=True,
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
    is_active = models.BooleanField(default=True) 

    def save(self, *args, **kwargs):
        if self.stock < 0:
            raise ValueError("Stock tidak boleh negatif")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    
# class HeroImage(models.Model):
#     image = models.ImageField(upload_to='hero/')
#     order = models.IntegerField(default=0)
#     is_active = models.BooleanField(default=True)

#     class Meta:
#         ordering = ['order']

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
    
# CONTACT INFORMATION
    
class ContactInformation(models.Model):
    location = models.CharField(max_length=255)
    whatsapp_number = models.CharField(max_length=20)  
    phone_number2 = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField()
    instagram = models.CharField(max_length=50)
    weekday_hours = models.CharField(max_length=50)  
    saturday_hours = models.CharField(max_length=50)
    sunday_hours = models.CharField(max_length=50)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    class Meta:
        verbose_name = 'Contact Information'
        verbose_name_plural = 'Contact Information'

    def __str__(self):
        return f"Contact Information - {self.whatsapp_number}"
    
#TESTIMONY
class Testimonial(models.Model):
    username = models.CharField(max_length=100)
    message = models.TextField()
    tagline = models.CharField(max_length=100)
    image = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"Testimonial by @{self.username}"

# PAYMENTMONITOR
class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('bank', 'Bank Transfer'),
        ('qris', 'QRIS'),
    )

    order_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
    customer_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()

    items = models.JSONField(default=dict) 
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    payment_method = models.CharField(
        max_length=10, 
        choices=PAYMENT_METHOD_CHOICES,
        default='bank'
    )
    payment_proof = models.ImageField(
        upload_to='payment_proofs/',
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=10, 
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        

    def __str__(self):
        return f"Payment {self.order_number} - {self.customer_name}"
    # abstrak
    def save(self, *args, **kwargs):
        if not self.order_number:
            import time
            self.order_number = f"ORD{int(time.time())}"
        super().save(*args, **kwargs)
    @property
    def payment_proof_url(self):
        if self.payment_proof:
            return f"{settings.MEDIA_URL}{self.payment_proof}"
        return None