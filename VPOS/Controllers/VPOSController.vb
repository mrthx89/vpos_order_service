Imports System.Web.Http
Imports System.Web.Http.Results

Namespace Controllers
    Public Class VPOSController
        Inherits ApiController
        Private Rep As New Register.Service

        <HttpGet()>
        Public Function GetKoneksi(Str As String) As JsonResult(Of Models.Pesan)
            Dim ObjPesan As New Models.Pesan
            Dim Obj = Rep.VPOSServices.Index
            If Obj Then
                Using cn As New SqlClient.SqlConnection(My.Settings.DBConfig.ToString)
                    ObjPesan.Pesan = "Server Database : " & cn.DataSource.ToString & ", Database : " & cn.Database.ToString
                    ObjPesan.Value = "Koneksi Terhubung"
                    ObjPesan.Catatan = My.Settings.DBConfig.ToString
                End Using
            Else
                ObjPesan.Pesan = "Server tidak dapat tersambung."
                ObjPesan.Value = "Koneksi gagal terhubung"
                ObjPesan.Catatan = My.Settings.DBConfig.ToString
            End If
            Return Json(ObjPesan)
        End Function

        <HttpGet()>
        Public Function GetUserLogin(Kode As String, Pwd As String) As JsonResult(Of Models.MUser)
            Dim Obj = Rep.VPOSServices.GetUserLogin(Kode, Pwd)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function GetUserByNoID(NoID As Long) As JsonResult(Of Models.MUser)
            Dim Obj = Rep.VPOSServices.GetUserByNoID(NoID)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function GetKategori(Kategori As String) As JsonResult(Of List(Of Models.MKategori))
            Dim Obj = Rep.VPOSServices.GetKategori()
            Return Json(Obj.ToList)
        End Function

        <HttpGet()>
        Public Function GetDaftarMeja(Meja As String) As JsonResult(Of List(Of Models.MTable))
            Dim Obj = Rep.VPOSServices.GetDaftarMeja()
            Return Json(Obj.ToList)
        End Function

        <HttpGet()>
        Public Function GetBarangByKategori(IDKategori As Integer) As JsonResult(Of List(Of Models.MBarang))
            Dim Obj = Rep.VPOSServices.GetBarangByKategori(IDKategori)
            Return Json(Obj.ToList)
        End Function

        <HttpGet()>
        Public Function GetBarangByFilter(FilterBarang As String) As JsonResult(Of List(Of Models.MBarang))
            Dim Obj = Rep.VPOSServices.GetBarangByFilter(FilterBarang)
            Return Json(Obj.ToList)
        End Function

        <HttpGet()>
        Public Function GetOrderByNoID(IDOrder As Integer) As JsonResult(Of Models.MSO)
            Dim Obj = Rep.VPOSServices.GetOrderByNoID(IDOrder)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function InsertOrder(IDTable As Integer, IDSalesman As Integer, JmlPengunjung As Integer) As JsonResult(Of Models.MSO)
            Dim Obj = Rep.VPOSServices.InsertTableOrder(IDTable, IDSalesman, JmlPengunjung)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function InsertOrderDetail(IDSO As Integer, IDBarang As Integer, Qty As Integer, Catatan As String) As JsonResult(Of List(Of Models.MSOD))
            Dim Obj = Rep.VPOSServices.InsertTableOrderDetail(IDSO, IDBarang, Qty, Catatan)
            Return Json(Obj.ToList)
        End Function

        <HttpGet()>
        Public Function SetOrder(_SetOrder As Integer) As JsonResult(Of Models.Pesan)
            Dim Obj = Rep.VPOSServices.SetOrder(_SetOrder)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function DeleteOrder(_DeleteOrder As Integer) As JsonResult(Of Models.Pesan)
            Dim Obj = Rep.VPOSServices.DeleteOrder(_DeleteOrder)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function DeleteOrderDetil(_DeleteOrderDetil As Integer) As JsonResult(Of Models.Pesan)
            Dim Obj = Rep.VPOSServices.DeleteOrderDetil(_DeleteOrderDetil)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function UpdateOrderDetil(_UpdateOrderDetil As Integer, Qty As Double) As JsonResult(Of Models.Pesan)
            Dim Obj = Rep.VPOSServices.UpdateOrderDetil(_UpdateOrderDetil, Qty)
            Return Json(Obj)
        End Function

        <HttpGet()>
        Public Function UpdateJmlPengunjung(_UpdateJmlPengunjung As Integer, JmlPengunjung As Double) As JsonResult(Of Models.Pesan)
            Dim Obj = Rep.VPOSServices.UpdateJmlPengunjung(_UpdateJmlPengunjung, JmlPengunjung)
            Return Json(Obj)
        End Function
    End Class
End Namespace