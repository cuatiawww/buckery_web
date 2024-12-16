from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, 
    Category,
    Payment, 
    Product, 
    TimelineEvent, 
    TeamMember,
    ContactInformation,
    Testimonial,
    UserProfile 
)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'nama_lengkap', 'user_type', 'is_staff', 'is_active',)
    list_filter = ('user_type', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'nama_lengkap', 'user_type')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'nama_lengkap', 'password1', 'password2', 'user_type', 'is_staff', 'is_active')
        }),
    )
    search_fields = ('username', 'email', 'nama_lengkap')
    ordering = ('username',)
    

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock')
    list_filter = ('category',)
    search_fields = ('name', 'description')

@admin.register(TimelineEvent)
class TimelineEventAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'description')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'member_type', 'order')
    list_filter = ('member_type',)
    list_editable = ('order',)
    search_fields = ('name', 'role')

@admin.register(ContactInformation)
class ContactInformationAdmin(admin.ModelAdmin):
    list_display = ('location', 'whatsapp_number', 'email', 'instagram')
    search_fields = ('location', 'whatsapp_number', 'email')

@admin.register(Testimonial) 
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('username', 'tagline', 'is_active', 'order', 'created_at')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active') 
    search_fields = ('username', 'message', 'tagline')
    ordering = ('order', '-created_at')

# Register CustomUser
admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'phone', 'address')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'total', 'payment_method', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'customer_name', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']