USE MASTER 
GO
DROP DATABASE Integrador
GO
CREATE DATABASE Integrador
GO

USE Integrador
GO

--EMPRESA
IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'Empresa' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[Empresa]
END

CREATE TABLE [dbo].[Empresa](
	IDEmpresa BIGINT NOT NULL IDENTITY,
	Nombre VARCHAR(100) NOT NULL,
	RUC VARCHAR(11) NOT NULL,
	Direccion VARCHAR(200) NOT NULL,
	FechaCreacion DATE NOT NULL,
	CONSTRAINT PK_Empresa PRIMARY KEY(IDEmpresa),
)

--PROFORMA
GO
IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'Proforma' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[Proforma]
END
GO
CREATE TABLE [dbo].[Proforma](
	IDProforma BIGINT NOT NULL IDENTITY,
	IDEmpresa BIGINT NOT NULL,
	Numero INT NOT NULL,
	Solicitante VARCHAR(128) NOT NULL,
	Lugar VARCHAR(50) NOT NULL,
	Tiempo INT NOT NULL,
	FechaCreacion DATE NOT NULL,
	Estado TINYINT DEFAULT 1 NOT NULL,
	Garantia TINYINT NOT NULL,
	FormaPago TINYINT NOT NULL,
	Vencimiento TINYINT NOT NULL
	CONSTRAINT PK_Proforma PRIMARY KEY(IDProforma)
)
GO

--ITEM

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'Item' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[Item]
END

CREATE TABLE [dbo].[Item](
	IDItem BIGINT NOT NULL IDENTITY,
	Descripcion VARCHAR(300) NOT NULL,
	CONSTRAINT PK_Item PRIMARY KEY(IDItem),
)
GO

--MATERIAL

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'Material' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[Material]
END

CREATE TABLE [dbo].[Material](
	IDMaterial BIGINT NOT NULL IDENTITY,
	Descripcion VARCHAR(100) NOT NULL,
	CONSTRAINT PK_Material PRIMARY KEY(IDMaterial),
)
GO

--HERRAMIENTA

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'Herramienta' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[Herramienta]
END

CREATE TABLE [dbo].[Herramienta](
	IDHerramienta BIGINT NOT NULL IDENTITY,
	Descripcion VARCHAR(100) NOT NULL,
	CONSTRAINT PK_Herramienta PRIMARY KEY(IDHerramienta),
)
GO

--ProformaItem

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'ProformaItem' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[ProformaItem]
END

CREATE TABLE [dbo].[ProformaItem](
	IDProformaItem BIGINT NOT NULL IDENTITY,
	IDProforma BIGINT NOT NULL,
	IDItem BIGINT NOT NULL,
	Cantidad INT NOT NULL,
	PrecioUnitario DECIMAL(8,2) NOT NULL,
	PrecioTotal DECIMAL(8,2) NOT NULL,
	CONSTRAINT PK_ProformaItem PRIMARY KEY(IDProformaItem),
	CONSTRAINT FK_ProformaItem_Proforma FOREIGN KEY(IDProforma) REFERENCES Proforma(IDProforma),
	CONSTRAINT FK_ProformaItem_Item FOREIGN KEY(IDItem) REFERENCES Item(IDItem),
)
GO

--ProformaMaterial

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'ProformaMaterial' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[ProformaMaterial]
END

CREATE TABLE [dbo].[ProformaMaterial](
	IDProformaMaterial BIGINT NOT NULL IDENTITY,
	IDProforma BIGINT NOT NULL,
	IDMaterial BIGINT NOT NULL,
	CONSTRAINT PK_ProformaMaterial PRIMARY KEY(IDProformaMaterial),
	CONSTRAINT FK_ProformaMaterial_Proforma FOREIGN KEY(IDProforma) REFERENCES Proforma(IDProforma),
	CONSTRAINT FK_ProformaMaterial_Material FOREIGN KEY(IDMaterial) REFERENCES Material(IDMaterial),
)
GO


--ProformaHerramienta

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'ProformaHerramienta' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[ProformaHerramienta]
END

CREATE TABLE [dbo].[ProformaHerramienta](
	IDProformaMaterial BIGINT NOT NULL IDENTITY,
	IDProforma BIGINT NOT NULL,
	IDHerramienta BIGINT NOT NULL,
	CONSTRAINT PK_ProformaHerramienta PRIMARY KEY(IDProformaMaterial),
	CONSTRAINT FK_ProformaHerramienta_Proforma FOREIGN KEY(IDProforma) REFERENCES Proforma(IDProforma),
	CONSTRAINT FK_ProformaHerramienta_Herramienta FOREIGN KEY(IDHerramienta) REFERENCES Herramienta(IDHerramienta),
)
GO
--Informe

IF EXISTS(SELECT NAME FROM sysobjects WHERE NAME = 'ProformaHerramienta' and TYPE = 'U')
BEGIN
	DROP TABLE [dbo].[ProformaHerramienta]
END

CREATE TABLE [dbo].[ProformaHerramienta](
	IDProformaMaterial BIGINT NOT NULL IDENTITY,
	IDProforma BIGINT NOT NULL,
	IDHerramienta BIGINT NOT NULL,
	CONSTRAINT PK_ProformaHerramienta PRIMARY KEY(IDProformaMaterial),
	CONSTRAINT FK_ProformaHerramienta_Proforma FOREIGN KEY(IDProforma) REFERENCES Proforma(IDProforma),
	CONSTRAINT FK_ProformaHerramienta_Herramienta FOREIGN KEY(IDHerramienta) REFERENCES Herramienta(IDHerramienta),
)
GO
-- INSERTS
INSERT INTO Empresa (Nombre, RUC, Direccion, FechaCreacion) VALUES ('Maersk Logistics & Services Peru S.A.', '20107012011', 'NESTOR GAMBETTA KM 14.5 CALLAO', '2024-06-20')

INSERT INTO Proforma(IDEmpresa, Numero, Solicitante, Lugar, Tiempo, FechaCreacion,Garantia, FormaPago,Vencimiento)
VALUES (1,3773,'LUIS ORDINOLA','DEMARES 1',12,'2024-06-24',6,60,15)
		
INSERT INTO Proforma(IDEmpresa, Numero, Solicitante, Lugar, Tiempo, FechaCreacion,Garantia, FormaPago,Vencimiento)
VALUES (1,3774,'YERSON ALANYA','CAJAMARQUILLA',7,'2024-06-28',6,60,15)
		
INSERT INTO Proforma(IDEmpresa, Numero, Solicitante, Lugar, Tiempo, FechaCreacion,Garantia, FormaPago,Vencimiento)
VALUES (1,3775,'YERSON ALANYA','CAJAMARQUILLA',10,'2024-06-28',6,60,15)
		
INSERT INTO Proforma(IDEmpresa, Numero, Solicitante, Lugar, Tiempo, FechaCreacion,Garantia, FormaPago,Vencimiento)
VALUES (1,3776,'LUIS ORDINOLA','DEMARES 1',3,'2024-06-28',6,60,15)
		
INSERT INTO Proforma(IDEmpresa, Numero, Solicitante, Lugar, Tiempo, FechaCreacion,Garantia, FormaPago,Vencimiento)
VALUES (1,3777,'MARCELO CRUZ','CAJAMARQUILLA',4,'2024-06-28',6,60,15)

INSERT INTO Item (Descripcion) VALUES ('FABRICACION DE UNA JAULA DE 6 MT LARGO X 3.00 MT. ALTO X 2.40 MT. PROF. CON 2 HOJAS CORREDIZAS Y POLICARBONATO')
INSERT INTO Item (Descripcion) VALUES ('MODIFICACION DE ESTRUCTURA CON DIVISION HORIZONTAL EN TUBO Y PLANCHA ADEMAS ENMALLADO DE LATERALES Y POSTERIOR')
INSERT INTO Item (Descripcion) VALUES ('FABRICACION DE ESTRUCTURA NUEVA CON DIVISION HORIZONTAL EN TUBO Y PLANCHA ADEMAS ENMALLADO DE LATERALES Y POSTERIOR')
INSERT INTO Item (Descripcion) VALUES ('SUMINISTRO E INSTALACION DE LUMINARIAS EN CONTENEDOR ALMACEN')
INSERT INTO Item (Descripcion) VALUES ('ANCLADO AL PISO DE JAULA DE PREINFLADO')

INSERT INTO ProformaItem(IDProforma,IDItem, Cantidad, PrecioUnitario, PrecioTotal)
VALUES (1,1,1,11000,11000)

INSERT INTO ProformaItem(IDProforma,IDItem, Cantidad, PrecioUnitario, PrecioTotal)
VALUES (2,2,1,2600,2600)

INSERT INTO ProformaItem(IDProforma,IDItem, Cantidad, PrecioUnitario, PrecioTotal)
VALUES (3,3,1,3200,3200)

INSERT INTO ProformaItem(IDProforma,IDItem, Cantidad, PrecioUnitario, PrecioTotal)
VALUES (4,4,1,900,900)

INSERT INTO ProformaItem(IDProforma,IDItem, Cantidad, PrecioUnitario, PrecioTotal)
VALUES (5,5,1,900,900)

SELECT * FROM Proforma
