# Generated by Django 5.1.3 on 2024-12-07 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_category_options_category_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='TeamMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('role', models.CharField(max_length=100)),
                ('quote', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='team/')),
                ('member_type', models.CharField(choices=[('FOUNDER', 'Founder'), ('TEAM', 'Team Member')], default='TEAM', max_length=10)),
                ('order', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='TimelineEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.CharField(max_length=4)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='timeline/')),
                ('order', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'year'],
            },
        ),
    ]
