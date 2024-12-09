from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, 
    ProductViewSet, 
    TimelineEventViewSet,
    TeamMemberViewSet,
    user_login,
    user_register,
    admin_staff_login,
    create_staff,
    list_staff,
    update_staff,
    logout_view
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('timeline-events', TimelineEventViewSet, basename='timeline-event')
router.register('team-members', TeamMemberViewSet, basename='team-member')

urlpatterns = [
    path('', include(router.urls)),
    
    path('auth/', include([
        # User auth
        path('user-login/', user_login, name='user-login'),
        path('user-register/', user_register, name='user-register'),
        
        # Admin/Staff auth
        path('admin-login/', admin_staff_login, name='admin-login'),
        
        # Staff management
        path('staff/', include([
            path('create/', create_staff, name='create-staff'),
            path('list/', list_staff, name='list-staff'),
            path('update/<int:staff_id>/', update_staff, name='update-staff'),
        ])),
        
        path('logout/', logout_view, name='logout'),
    ])),
]