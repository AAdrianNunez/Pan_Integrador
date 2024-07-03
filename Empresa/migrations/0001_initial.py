# Generated by Django 5.0.1 on 2024-06-08 23:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Empresa',
            fields=[
                ('IDEmpresa', models.AutoField(primary_key=True, serialize=False)),
                ('Ruc', models.TextField(max_length=50, null=True)),
                ('Direccion', models.TextField(max_length=150, null=True)),
                ('FechaCreacion', models.DateField()),
            ],
            options={
                'db_table': 'Empresa',
            },
        ),
        migrations.CreateModel(
            name='Sede',
            fields=[
                ('IDSede', models.AutoField(primary_key=True, serialize=False)),
                ('Descripcion', models.TextField(max_length=100, null=True)),
                ('IDEmpresa', models.ForeignKey(db_column='IDEmpresa', on_delete=django.db.models.deletion.CASCADE, to='Empresa.empresa')),
            ],
            options={
                'db_table': 'Sede',
            },
        ),
        migrations.CreateModel(
            name='Solicitante',
            fields=[
                ('IDSolicitante', models.AutoField(primary_key=True, serialize=False)),
                ('Nombre', models.TextField(max_length=100, null=True)),
                ('IDEmpresa', models.ForeignKey(db_column='IDEmpresa', on_delete=django.db.models.deletion.CASCADE, to='Empresa.empresa')),
            ],
            options={
                'db_table': 'Solicitante',
            },
        ),
    ]