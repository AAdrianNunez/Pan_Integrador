from django.db import models
from Empresa.models import Empresa
# Create your models here.
class Proforma(models.Model):
    IDProforma = models.AutoField(primary_key=True)
    IDEmpresa =models.ForeignKey(Empresa, on_delete=models.CASCADE,db_column='IDEmpresa')
    Numero = models.PositiveIntegerField()
    Solicitante = models.TextField(max_length = 50, null=True)
    Lugar = models.TextField(max_length = 50, null=True)
    Tiempo = models.PositiveSmallIntegerField(null=True)
    FechaCreacion = models.DateField()
    Estado = models.PositiveIntegerField(default=1) # 1= Pendiente, 2 = APROBADO, 3 = DESAPROBADO
    class Meta():
        db_table = 'Proforma'

class Item(models.Model):
    IDItem = models.AutoField(primary_key=True)
    Cantidad = models.PositiveIntegerField(default=1)
    Descripcion = models.TextField(max_length = 200)
    PrecioUnitario = models.DecimalField(max_digits=10, decimal_places = 2)
    PrecioTotal = models.DecimalField(max_digits=10,decimal_places = 2)
    class Meta():
        db_table = 'Item'

class ProformaItem (models.Model):
    IDProformaItem = models.AutoField(primary_key=True)
    IDProforma = models.ForeignKey(Proforma, on_delete=models.CASCADE,db_column='IDProforma')
    IDItem = models.ForeignKey(Item, on_delete=models.CASCADE,db_column='IDItem')
    class Meta():
        db_table = 'ProformaItem'

class Material (models.Model):
    IDMaterial = models.AutoField(primary_key=True)
    Descripcion = models.TextField(max_length = 100)
    class Meta():
        db_table = 'Material'

class ProformaMaterial(models.Model):
    IDProformaMaterial = models.AutoField(primary_key=True)
    IDProforma = models.ForeignKey(Proforma, on_delete=models.CASCADE, db_column='IDProforma')
    IDMaterial = models.ForeignKey(Material, on_delete=models.CASCADE, db_column='IDMaterial')
    class Meta():
        db_table = 'ProformaMaterial'

class Herramienta (models.Model):
    IDHerramienta = models.AutoField(primary_key=True)
    Descripcion = models.TextField(max_length = 100)
    class Meta():
        db_table = 'Herramienta'

class ProformaHerramienta(models.Model):
    IDProformaMaterial = models.AutoField(primary_key=True)
    IDProforma = models.ForeignKey(Proforma, on_delete=models.CASCADE, db_column='IDProforma')
    IDHerramienta = models.ForeignKey(Herramienta, on_delete=models.CASCADE, db_column='IDHerramienta')
    class Meta():
        db_table = 'ProformaHerramienta'
