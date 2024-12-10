from django.core.management.base import BaseCommand
from api.models import CustomUser

# CUSTOM ADMIN
class Command(BaseCommand):
    help = 'Create a superuser/admin account'

    def handle(self, *args, **kwargs):
        try:
            if not CustomUser.objects.filter(username='admin').exists():
                CustomUser.objects.create_superuser(
                    username='admin',
                    email='admin@buckery.com',
                    password='admin123',
                    nama_lengkap='Admin Buckery',
                    user_type='ADMIN'
                )
                self.stdout.write(self.style.SUCCESS('Admin account created successfully'))
            else:
                self.stdout.write(self.style.WARNING('Admin account already exists'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating admin account: {str(e)}'))