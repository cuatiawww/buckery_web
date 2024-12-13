from django.apps import AppConfig

class ApiConfig(AppConfig):  # Sesuaikan dengan nama app Anda
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'  # Sesuaikan dengan nama app Anda

    def ready(self):
        import api.signals  # Sesuaikan dengan nama app Anda