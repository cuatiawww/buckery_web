from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, UserSerializer
from django.db import IntegrityError 

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

@api_view(['POST'])
def login(request):
    username = request.data.get('username')  # Mengambil username bukan email
    password = request.data.get('password')
    
    print(f"Login attempt: {username}")  # Debug
    
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'status': 'success',
            'token': token.key
        })
    return Response({
        'status': 'error',
        'message': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'status': 'success', 'token': token.key})
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError:
        return Response({
            'status': 'error',
            'message': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def logout_view(request):
    print("User logged out")  # Debug log
    if request.user.is_authenticated:
        Token.objects.filter(user=request.user).delete()
    return Response({'message': 'Logged out successfully'})