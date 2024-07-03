CREATE PROC USPRegistrarEmpresa
	 @Nombre	VARCHAR(128)
	,@Ruc	VARCHAR(128)
	,@Direccion		CHAR(8)
AS
BEGIN
	INSERT INTO [dbo].[Empresa](
		 Nombre
		,Ruc
		,Direccion
		,FechaCreacion
	) VALUES (
		 @Nombre
		,@Ruc
		,@Direccion
		,CAST(GETDATE() AS DATE)
	)
END
GO
CREATE PROC USPListarEmpresas
AS
BEGIN
	SELECT
		 IDEmpresa
		 ,Nombre
		 ,Ruc
		 ,Direccion
	FROM [dbo].[Empresa]
END
GO
CREATE PROC USPListarSoliciantes
AS
BEGIN
	SELECT DISTINCT
		 Solicitante
	FROM [dbo].[Proforma]
END
GO
CREATE PROC USPListarLugar
AS
BEGIN
	SELECT DISTINCT
		 Lugar
	FROM [dbo].[Proforma]
END

GO
ALTER PROC USPCrearProforma
	 @IDEmpresa		int
	,@Solicitante	NVARCHAR(MAX)
	,@Lugar			NVARCHAR(MAX)
	,@Items			NVARCHAR(MAX)
	,@Material		NVARCHAR(MAX)
	,@Herramienta	NVARCHAR(MAX)
	,@Tiempo		TINYINT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @IDProforma INT;
	DECLARE @IDItem INT;
	DECLARE @IDMaterial INT;
	DECLARE @IDHerramienta INT;

	INSERT INTO [dbo].[Proforma](
		 IDEmpresa
		,Numero
		,Solicitante
		,Lugar
		,Tiempo
		,FechaCreacion
		,Garantia
		,FormaPago
		,Vencimiento
	) 
	VALUES (
		 @IDEmpresa
		,(SELECT MAX(NUMERO)+1 FROM [dbo].[Proforma])
		,@Solicitante
		,@Lugar
		,@Tiempo
		,CAST(GETDATE() AS DATE)
		,6
		,60
		,15
	);
	SET @IDProforma = SCOPE_IDENTITY();
	INSERT INTO [dbo].[Item](
		Descripcion
	) SELECT
	JSON_VALUE(value, '$[1]') AS Descripcion
	FROM OPENJSON(@Items)
	WHERE JSON_VALUE(value, '$[1]') NOT IN (SELECT DESCRIPCION FROM Item);

	INSERT INTO [dbo].[Material](
		Descripcion
	) SELECT
	JSON_VALUE(value, '$[0]') AS Descripcion
	FROM OPENJSON(@Material)
	WHERE JSON_VALUE(value, '$[0]') NOT IN (SELECT DESCRIPCION FROM Material);

	INSERT INTO [dbo].[Herramienta](
		Descripcion
	) SELECT
	JSON_VALUE(value, '$[0]') AS Descripcion
	FROM OPENJSON(@Herramienta)
	WHERE JSON_VALUE(value, '$[0]') NOT IN (SELECT DESCRIPCION FROM [Herramienta]);
	
	INSERT INTO [dbo].[ProformaItem](
		 IDProforma
		,IDItem
		,Cantidad
		,PrecioUnitario
		,PrecioTotal

	) SELECT
			@IDProforma,
			IDItem,
			ParsedItems.Cantidad,
			ParsedItems.PrecioUnitario,
			ParsedItems.PrecioTotal
		FROM Item
		CROSS APPLY (
			SELECT 
				JSON_VALUE(value, '$[0]') AS Cantidad,
				JSON_VALUE(value, '$[1]') AS Descripcion,
				JSON_VALUE(value, '$[2]') AS PrecioUnitario,
				JSON_VALUE(value, '$[3]') AS PrecioTotal
			FROM OPENJSON(@Items)
		) AS ParsedItems
		WHERE Item.Descripcion = ParsedItems.Descripcion;

	INSERT INTO [dbo].[ProformaMaterial](
		IDProforma,
		IDMaterial
	) SELECT 
		@IDProforma
		,IDMaterial
	FROM Material 
	where Descripcion IN (SELECT
							JSON_VALUE(value, '$[0]') AS Descripcion
						FROM OPENJSON(@Material));

	INSERT INTO [dbo].[ProformaHerramienta](
		IDProforma,
		IDHerramienta
	) SELECT
		@IDProforma
		,IDHerramienta
	FROM Herramienta 
	where Descripcion IN (SELECT
							JSON_VALUE(value, '$[0]') AS Descripcion
						FROM OPENJSON(@Herramienta));
	
	SELECT CONCAT(MAX(Numero), '-', YEAR(GETDATE())) FROM Proforma P
	 
END
SELECT * FROM PROFORMA
SELECT * FROM ProformaItem WHERE IDProforma = 18
SELECT * FROM Item
SELECT * FROM Material
GO
CREATE PROC USPListarProforma
AS
BEGIN
	SELECT P.IDProforma, Numero, I.Descripcion,E.Nombre, Solicitante, Lugar, P.FechaCreacion, PFI.PrecioTotal 
	FROM [dbo].[Proforma] P
    INNER JOIN [dbo].[Empresa] E ON P.IDEmpresa = E.IDEmpresa
    INNER JOIN [dbo].[ProformaItem] PFI ON PFI.IDProforma = P.IDProforma
    INNER JOIN [dbo].[Item] I ON I.IDItem = PFI.IDItem
END
GO
CREATE PROC USPProformaPorID
		@IDProforma int
AS
BEGIN
	SELECT Solicitante, Lugar, Tiempo, IDEmpresa 
	FROM [dbo].[Proforma]
	WHERE IDProforma = @IDProforma
END
GO
CREATE PROC USPItemPorProforma
		@IDProforma int
AS
BEGIN
	SELECT Cantidad, Descripcion, PrecioUnitario, PrecioTotal,IDProforma
	FROM [dbo].[Item] I
	INNER JOIN [dbo].[ProformaItem] PFI
	ON PFI.IDItem = I.IDItem
	WHERE PFI.IDProforma = @IDProforma
END
GO
CREATE PROC USPMaterialPorProforma
		@IDProforma int
AS
BEGIN
	SELECT Descripcion 
	FROM [dbo].[Material] M
	INNER JOIN [dbo].[ProformaMaterial] PM
	ON PM.IDMaterial = M.IDMaterial
	WHERE PM.IDProforma = @IDProforma
END
GO
CREATE PROC USPHerramientaPorProforma
		@IDProforma int
AS
BEGIN
	SELECT Descripcion 
	FROM [dbo].[Herramienta] H
	INNER JOIN [dbo].[ProformaHerramienta] PH
	ON PH.IDHerramienta = H.IDHerramienta
	WHERE PH.IDProforma = @IDProforma
END
	


