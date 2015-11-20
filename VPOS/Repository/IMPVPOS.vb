Imports VPOS.Models
Imports VPOS.Repository

Namespace Repository
    Public Class IMPVPOS
        Implements IRSVPOS

        Private Rep As New RepVPOS

        Public Function DeleteOrder(IDSO As Integer) As Pesan Implements IRSVPOS.DeleteOrder
            Return Rep.DeleteOrder(IDSO)
        End Function

        Public Function DeleteOrderDetil(NoID As Integer) As Pesan Implements IRSVPOS.DeleteOrderDetil
            Return Rep.DeleteOrderDetil(NoID)
        End Function

        Public Function GetBarangByFilter(FilterBarang As String) As List(Of MBarang) Implements IRSVPOS.GetBarangByFilter
            Return Rep.GetBarangByFilter(FilterBarang)
        End Function

        Public Function GetBarangByKategori(IDKategori As Integer) As List(Of MBarang) Implements IRSVPOS.GetBarangByKategori
            Return Rep.GetBarangByKategori(IDKategori)
        End Function

        Public Function GetDaftarMeja() As List(Of MTable) Implements IRSVPOS.GetDaftarMeja
            Return Rep.GetDaftarMeja()
        End Function

        Public Function GetKategori() As List(Of MKategori) Implements IRSVPOS.GetKategori
            Return Rep.GetKategori()
        End Function

        Public Function GetOrderByNoID(NoID As Integer) As MSO Implements IRSVPOS.GetOrderByNoID
            Return Rep.GetOrderByID(NoID)
        End Function

        Public Function GetUserByNoID(NoID As Integer) As MUser Implements IRSVPOS.GetUserByNoID
            Return Rep.GetUserByNoID(NoID)
        End Function

        Public Function GetUserLogin(Kode As String, Pwd As String) As MUser Implements IRSVPOS.GetUserLogin
            Return Rep.GetUserLogin(Kode, Pwd)
        End Function

        Public Function Index() As Boolean Implements IRSVPOS.Index
            Return Rep.TestKoneksi()
        End Function

        Public Function InsertTableOrder(IDTable As Integer, IDSalesman As Integer, JmlPengunjung As Integer) As MSO Implements IRSVPOS.InsertTableOrder
            Return Rep.InsertTableOrder(IDTable, IDSalesman, JmlPengunjung)
        End Function

        Public Function InsertTableOrderDetail(IDSO As Integer, IDBarang As Integer, Qty As Integer, Catatan As String) As List(Of MSOD) Implements IRSVPOS.InsertTableOrderDetail
            Return Rep.InsertTableOrderDetail(IDSO, IDBarang, Qty, Catatan)
        End Function

        Public Function SetOrder(IDSO As Integer) As Pesan Implements IRSVPOS.SetOrder
            Return Rep.SetOrder(IDSO)
        End Function

        Public Function UpdateJmlPengunjung(_UpdateJmlPengunjung As Integer, JmlPengunjung As Double) As Pesan Implements IRSVPOS.UpdateJmlPengunjung
            Return Rep.UpdateJmlPengunjung(_UpdateJmlPengunjung, JmlPengunjung)
        End Function

        Public Function UpdateOrderDetil(NoID As Integer, Qty As Double) As Pesan Implements IRSVPOS.UpdateOrderDetil
            Return Rep.UpdateOrderDetil(NoID, Qty)
        End Function
    End Class
End Namespace
