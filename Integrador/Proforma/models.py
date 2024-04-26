from django.db import models

# Create your models here.
class Proforma(models.Model):
    IDProforma = models.AutoField(primary_key=True)
    Numero_Proforma = models.PositiveIntegerField()
    Solicitante = models.TextField(max_length = 50, null=True)
    Lugar = models.TextField(max_length = 50, null=True)
    Tiempo = models.PositiveSmallIntegerField(null=True)
    Fecha_Creacion = models.DateField()
    Estado = models.PositiveIntegerField(default=1) # 1= Pendiente, 2 = APROBADO, 3 = DESAPROBADO
    class Meta():
        db_table = 'Proforma'

class Item(models.Model):
    IDItem = models.AutoField(primary_key=True)
    Cantidad = models.PositiveIntegerField(default=1)
    Descripcion = models.TextField(max_length = 200)
    Precio_Unitario = models.DecimalField(max_digits=10, decimal_places = 2)
    Precio_Total = models.DecimalField(max_digits=10,decimal_places = 2)
    class Meta():
        db_table = 'Item'

class DetalleProforma (models.Model):
    IDProforma_Item = models.AutoField(primary_key=True)
    IDProforma = models.ForeignKey(Proforma, on_delete=models.CASCADE,db_column='IDProforma')
    IDItem = models.ForeignKey(Item, on_delete=models.CASCADE,db_column='IDItem')
    class Meta():
        db_table = 'DetalleProforma'

class Materiales (models.Model):
    IDMateriales = models.AutoField(primary_key=True)
    Descripcion = models.TextField(max_length = 100)
    class Meta():
        db_table = 'Materiales'

class PF_Materiales(models.Model):
    IDPF_Materiales = models.AutoField(primary_key=True)
    IDProforma = models.ForeignKey(Proforma, on_delete=models.CASCADE, db_column='IDProforma')
    IDMateriales = models.ForeignKey(Materiales, on_delete=models.CASCADE, db_column='IDMateriales')
    class Meta():
        db_table = 'PF_Materiales'
    

