from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Category, ContactInformation, CustomUser, Product, Testimonial, TimelineEvent, TeamMember

# CATEGORY

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
# PRODUCT or MENU

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

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