import time
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Category, ContactInformation, CustomUser, Payment, Product, Testimonial, TimelineEvent, TeamMember, UserProfile

# CATEGORY

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
# PRODUCT or MENU

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'stock', 'image', 'category', 'created_at']
        
    def create(self, validated_data):
        return Product.objects.create(**validated_data)

# TENTANG KAMI

class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = ['id', 'year', 'title', 'description', 'image', 'order']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'quote', 'image', 'member_type', 'order']

# USER, ADMIN, STAFF

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    nama_lengkap = serializers.CharField(source='user.nama_lengkap')
    user_type = serializers.CharField(source='user.user_type')

    class Meta:
        model = UserProfile
        fields = [
            'username',
            'email', 
            'nama_lengkap',
            'user_type',
            'phone',
            'address',
            'notes',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['username', 'email', 'nama_lengkap', 'user_type', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        # Hanya update field yang bisa diubah
        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.save()
        return instance
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    nama_lengkap = serializers.CharField(required=True)
    user_type = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'nama_lengkap', 'user_type')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'nama_lengkap': {'required': True}
        }

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        try:
            user = CustomUser.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                nama_lengkap=validated_data['nama_lengkap'],
                user_type='USER'  # Default to regular user
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))

class AdminStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    nama_lengkap = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'nama_lengkap', 'user_type')
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'nama_lengkap': {'required': True},
            'user_type': {'required': True}
        }

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        try:
            user = CustomUser.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                nama_lengkap=validated_data['nama_lengkap'],
                user_type=validated_data['user_type']
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))
        
# CONTACT INFO
class ContactInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInformation
        fields = '__all__'

#TESTIMONY
class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'username', 'message', 'tagline', 'image', 'is_active', 'order', 'created_at']
        
    def create(self, validated_data):
        return Testimonial.objects.create(**validated_data)
        
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.message = validated_data.get('message', instance.message)
        instance.tagline = validated_data.get('tagline', instance.tagline)
        instance.image = validated_data.get('image', instance.image)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.order = validated_data.get('order', instance.order)
        instance.save()
        return instance
    
# PAYMENT
class PaymentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Tambahkan ini

    class Meta:
        model = Payment
        fields = [
            'id',
            'user',  # Tambahkan ini
            'order_number',
            'customer_name',
            'phone',
            'email',
            'address',
            'items',
            'total',
            'payment_method',
            'payment_proof',
            'status',
            'created_at',
            'notes'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'user']

    def create(self, validated_data):
        # Generate unique order number
        order_number = f"ORD{int(time.time())}"
        validated_data['order_number'] = order_number
        return super().create(validated_data)