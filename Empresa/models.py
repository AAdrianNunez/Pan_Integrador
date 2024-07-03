from django.db import models

# Create your models here.
class Empresa(models.Model):
    IDEmpresa = models.AutoField(primary_key=True)
    Nombre = models.TextField(max_length = 50, null=True)
    Ruc = models.TextField(max_length = 11, null=True)
    Direccion = models.TextField(max_length = 150, null=True)
    FechaCreacion = models.DateField()
    class Meta():
        db_table = 'Empresa'

class Sede(models.Model):
    IDSede = models.AutoField(primary_key=True)
    IDEmpresa = models.ForeignKey(Empresa, on_delete=models.CASCADE,db_column='IDEmpresa')
    Descripcion = models.TextField(max_length = 100, null=True)

    class Meta():
        db_table = "Sede"

class Solicitante(models.Model):
    IDSolicitante = models.AutoField(primary_key=True)
    IDEmpresa = models.ForeignKey(Empresa, on_delete=models.CASCADE,db_column='IDEmpresa')
    Nombre = models.TextField(max_length = 100, null=True)

    class Meta():
        db_table = "Solicitante"
