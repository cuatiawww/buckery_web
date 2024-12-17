from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, 
    ProductViewSet, 
    TimelineEventViewSet,
    TeamMemberViewSet,
    ContactInformationViewSet,
    TestimonialViewSet,
    PaymentViewSet,  
    user_login,
    user_register,
    admin_staff_login,
    create_staff,
    list_staff,
    update_staff,
    logout_view,
    user_profile 
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('timeline-events', TimelineEventViewSet, basename='timeline-event')
router.register('team-members', TeamMemberViewSet, basename='team-member')
router.register('contact-info', ContactInformationViewSet, basename='contact-info')
router.register('testimonials', TestimonialViewSet, basename='testimonial')
router.register('payments', PaymentViewSet, basename='payment')  # Add this

urlpatterns = [
    path('', include(router.urls)),
    
    path('auth/', include([
        # User auth
        path('user-login/', user_login, name='user-login'),
        path('admin-login/', admin_staff_login, name='admin-login'),
        path('user-register/', user_register, name='user-register'),
        
        # Staff management
        path('staff/', include([
            path('create/', create_staff, name='create-staff'),
            path('list/', list_staff, name='list-staff'),
            path('update/<int:staff_id>/', update_staff, name='update-staff'),
        ])),
        
        path('logout/', logout_view, name='logout'),
    ])),

    # User profile
    path('user/profile/', user_profile, name='user-profile'),
    
    path('payments/<int:pk>/confirm/', PaymentViewSet.as_view({'post': 'confirm_payment'}), name='confirm-payment'),
    path('payments/<int:pk>/reject/', PaymentViewSet.as_view({'post': 'reject_payment'}), name='reject-payment'),
]