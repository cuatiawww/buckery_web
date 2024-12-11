import logging
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.db import transaction  # Tambahkan import ini
from .models import Category, ContactInformation, CustomUser, Product, Testimonial, TimelineEvent, TeamMember
from .serializers import (
    AdminStaffSerializer,
    CategorySerializer,
    ContactInformationSerializer, 
    ProductSerializer,
    TestimonialSerializer, 
    UserSerializer,
    TimelineEventSerializer,
    TeamMemberSerializer
)
from django.db import IntegrityError

logger = logging.getLogger(__name__)
@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'status': 'error',
            'message': 'Both username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'status': 'success',
                    'token': token.key,
                    'user_type': user.user_type,
                    'username': user.username,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Account is disabled'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'status': 'error',
                'message': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'An error occurred during login'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
def user_register(request):
    logger.info(f"Received registration request with data: {request.data}")
    with transaction.atomic():  
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                logger.info("Data validated successfully")
                user = serializer.save()
                logger.info(f"User created successfully: {user.username}")
                token, _ = Token.objects.get_or_create(user=user)  # Create token for user
                return Response({
                    'status': 'success',
                    'message': 'Registration successful',
                    'token': token.key,  # Return token to frontend
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'nama_lengkap': user.nama_lengkap
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Validation errors: {serializer.errors}")
                return Response({
                    'status': 'error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("Error during registration")
            return Response({
                'status': 'error',
                'message': str(e),
                'error_type': type(e).__name__
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin & Staff Management Views
@api_view(['POST'])
@permission_classes([IsAdminUser])
def register_staff(request):
    """Create new staff account (admin only)"""
    try:
        data = request.data.copy()
        data['user_type'] = 'STAFF'
        
        serializer = AdminStaffSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            # Pastikan user dianggap sebagai staf oleh Django
            user.is_staff = True
            user.save()
            
            return Response({
                'status': 'success',
                'message': 'Staff account created successfully',
                'data': {
                    'username': user.username,
                    'email': user.email,
                    'nama_lengkap': user.nama_lengkap,
                    'user_type': user.user_type
                }
            }, status=status.HTTP_201_CREATED)
            
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error creating staff account: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def admin_staff_login(request):
    """Login for admin and staff users"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'status': 'error',
            'message': 'Both username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = authenticate(username=username, password=password)
        if user is not None and (user.is_staff or user.is_superuser):
            if user.is_active:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'status': 'success',
                    'token': token.key,
                    'user_type': user.user_type,
                    'username': user.username,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'nama_lengkap': user.nama_lengkap
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Account is disabled'
                }, status.HTTP_403_FORBIDDEN)
        return Response({
            'status': 'error',
            'message': 'Invalid credentials or insufficient permissions'
        }, status.HTTP_401_UNAUTHORIZED)
        
    except Exception as e:
        logger.error(f"Admin login error: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([IsAdminUser])  # Restrict access to admin only
def create_staff(request):
    """Create new staff or admin account."""
    try:
        serializer = AdminStaffSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'status': 'success',
                'message': 'User account created successfully',
                'data': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'nama_lengkap': user.nama_lengkap,
                    'user_type': user.user_type
                }
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    """List all users with filtering by user_type."""
    try:
        user_type = request.query_params.get('user_type', None)  # Filter by user_type
        if user_type:
            users = CustomUser.objects.filter(user_type=user_type)
        else:
            users = CustomUser.objects.all()

        data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'nama_lengkap': user.nama_lengkap,
                'user_type': user.user_type
            }
            for user in users
        ]
        return Response({
            'status': 'success',
            'data': data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error listing users: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['GET'])  # Tambahkan ini
@permission_classes([IsAdminUser])  # Tambahkan ini
def list_staff(request):
    """Get list of all staff members (admin only)"""
    try:
        staff_users = CustomUser.objects.filter(user_type='STAFF')
        data = []
        for user in staff_users:
            data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'nama_lengkap': user.nama_lengkap,
                'user_type': user.user_type,
                'is_active': user.is_active
            })
            
        return Response({
            'status': 'success',
            'data': data
        })
    except Exception as e:
        logger.error(f"Error fetching staff list: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_staff(request, staff_id):
    """Update staff account (admin only)"""
    try:
        user = CustomUser.objects.get(id=staff_id, user_type='STAFF')
        
        if 'nama_lengkap' in request.data:
            user.nama_lengkap = request.data['nama_lengkap']
        if 'email' in request.data:
            user.email = request.data['email']
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
            
        user.save()
        
        return Response({
            'status': 'success',
            'message': 'Staff account updated successfully',
            'data': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'nama_lengkap': user.nama_lengkap,
                'is_active': user.is_active
            }
        })
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Staff not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error updating staff: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def logout_view(request):
    """
    Logout view that doesn't require authentication
    """
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            try:
                token = Token.objects.get(key=token_key)
                token.delete()
            except Token.DoesNotExist:
                pass 

        return Response({
            'status': 'success',
            'message': 'Successfully logged out'
        })
    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        return Response({
            'status': 'success',
            'message': 'Successfully logged out'
        })

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

class TimelineEventViewSet(viewsets.ModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TeamMember.objects.all()
        member_type = self.request.query_params.get('type', None)
        if member_type:
            queryset = queryset.filter(member_type=member_type)
        return queryset
    
# CONTACT INFO
class ContactInformationViewSet(viewsets.ModelViewSet):
    queryset = ContactInformation.objects.all()
    serializer_class = ContactInformationSerializer
    permission_classes = [AllowAny]  # type: ignore 

#TESIMONY
class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)