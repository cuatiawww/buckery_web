from rest_framework.decorators import action
import logging
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser 
from rest_framework.authtoken.models import Token
from django.db import transaction  
from .models import Category, ContactInformation, CustomUser, Payment, Product, Testimonial, TimelineEvent, TeamMember, UserProfile
from .serializers import (
    AdminStaffSerializer,
    CategorySerializer,
    ContactInformationSerializer,
    PaymentSerializer, 
    ProductSerializer,
    TestimonialSerializer,
    UserProfileSerializer, 
    UserSerializer,
    TimelineEventSerializer,
    TeamMemberSerializer
)
from django.db import IntegrityError

logger = logging.getLogger(__name__)
@api_view(['POST'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])  # Tambahkan ini
def admin_staff_login(request):
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
                    'is_superuser': user.is_superuser
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Account is disabled'
                }, status=status.HTTP_403_FORBIDDEN)
        return Response({
            'status': 'error',
            'message': 'Invalid credentials or insufficient permissions'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    try:
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'phone': '',
                'address': '',
                'notes': ''
            }
        )

        if request.method == 'GET':
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
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
    authentication_classes = [TokenAuthentication]
    parser_classes = (MultiPartParser, FormParser) 
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
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
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    authentication_classes = [TokenAuthentication]
    parser_classes = (MultiPartParser, FormParser)
    
    def get_permissions(self):
        """
        Override untuk mengizinkan akses publik ke list dan detail,
        tapi tetap membutuhkan admin untuk create/update/delete
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = []  # Publik bisa akses
        else:
            permission_classes = [IsAdminUser]  # Hanya admin yang bisa modifikasi
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Pengguna publik hanya bisa lihat testimonial yang aktif,
        Admin bisa lihat semua
        """
        if self.request.user and self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    def get_queryset(self):
        if self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        try:
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        """
        - List/retrieve: Admin can see all, User can only see their own
        - Create: Authenticated users
        - Update/Delete: Admin only
        """
        if self.action in ['update', 'partial_update', 'destroy', 'confirm_payment', 'reject_payment']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter payments based on user role"""
        if self.request.user.is_staff:
            return Payment.objects.all().order_by('-created_at')
        return Payment.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'confirmed'
        payment.save()
        
        # You might want to add additional logic here
        # Like sending confirmation email/notification to user
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject_payment(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'rejected'
        payment.save()
        
        # You might want to add additional logic here
        # Like sending rejection notification to user
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_payment_stats(self, request):
        """Get payment statistics for admin dashboard"""
        if not request.user.is_staff:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        total_payments = self.get_queryset().count()
        pending_payments = self.get_queryset().filter(status='pending').count()
        confirmed_payments = self.get_queryset().filter(status='confirmed').count()
        rejected_payments = self.get_queryset().filter(status='rejected').count()

        return Response({
            "total_payments": total_payments,
            "pending_payments": pending_payments,
            "confirmed_payments": confirmed_payments,
            "rejected_payments": rejected_payments
        })
    
