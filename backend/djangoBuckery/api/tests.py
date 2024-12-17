from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Product, Category, Payment, TeamMember, UserProfile, ContactInformation

class ModelTests(TestCase):
    def setUp(self):
        """Setup untuk semua test cases"""
        # setup user, kategori,d an produk
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@email.com',
            nama_lengkap='Test User'
        )
        self.category = Category.objects.create(
            name='Test Category',
            description='Test Description'
        )
        self.product = Product.objects.create(
            category=self.category,
            name='Test Product',
            price=100000,
            description='Test Description',
            stock=10
        )

    def test_create_user(self):
        """Test 1: Pembuatan user baru"""
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@email.com')
        self.assertTrue(self.user.check_password('testpass123'))

    def test_create_category(self):
        """Test 2: Pembuatan kategori"""
        self.assertEqual(self.category.name, 'Test Category')
        self.assertEqual(self.category.description, 'Test Description')

    def test_create_product(self):
        """Test 3: Pembuatan produk"""
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.price, 100000)
        self.assertEqual(self.product.stock, 10)

    def test_product_str_method(self):
        """Test 4: String representation product"""
        self.assertEqual(str(self.product), 'Test Product')

    def test_category_products(self):
        """Test 5: Relasi category-product"""
        Product.objects.create(
            category=self.category,
            name='Product 2',
            price=200000,
            description='Description 2',
            stock=20
        )
        self.assertEqual(self.category.product_set.count(), 2)

    def test_user_profile_creation(self):
        """Test 6: Pembuatan user profile otomatis"""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsInstance(self.user.profile, UserProfile)

    def test_admin_user_type(self):
        """Test 7: Pembuatan admin user"""
        admin = get_user_model().objects.create_user(
            username='admin',
            password='admin123',
            email='admin@email.com',
            nama_lengkap='Admin User',
            user_type='ADMIN'
        )
        admin.save()
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_product_stock_validation(self):
        """Test 8: Validasi stok produk"""
        self.product.stock = -1
        with self.assertRaises(Exception):
            self.product.save()

    def test_team_member_creation(self):
        """Test 9: Pembuatan team member"""
        team_member = TeamMember.objects.create(
            name='Team Member 1',
            role='Developer',
            member_type='TEAM',
            quote='Test Quote'
        )
        self.assertEqual(team_member.name, 'Team Member 1')
        self.assertEqual(team_member.role, 'Developer')

    def test_contact_information(self):
        """Test 10: Pembuatan contact information"""
        contact = ContactInformation.objects.create(
            location='Test Location',
            whatsapp_number='08123456789',
            email='contact@test.com',
            instagram='@test',
            weekday_hours='9-5',
            saturday_hours='9-3',
            sunday_hours='Closed'
        )
        self.assertEqual(contact.location, 'Test Location')
        self.assertEqual(contact.whatsapp_number, '08123456789')