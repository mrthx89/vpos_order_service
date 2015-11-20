Imports VPOS.Models
Namespace Repository
    Public Interface IRSVPOS
        Function Index() As Boolean
        Function GetUserLogin(Kode As String, Pwd As String) As MUser
        Function GetUserByNoID(NoID As Integer) As MUser
        Function GetKategori() As List(Of MKategori)
        Function GetBarangByKategori(IDKategori As Integer) As List(Of MBarang)
        Function GetBarangByFilter(FilterBarang As String) As List(Of MBarang)
        Function GetDaftarMeja() As List(Of MTable)
        Function GetOrderByNoID(NoID As Integer) As MSO
        Function InsertTableOrder(IDTable As Integer, IDSalesman As Integer, JmlPengunjung As Integer) As MSO
        Function InsertTableOrderDetail(IDSO As Integer, IDBarang As Integer, Qty As Integer, Catatan As String) As List(Of MSOD)
        Function SetOrder(IDSO As Integer) As Pesan
        Function DeleteOrder(IDSO As Integer) As Pesan
        Function DeleteOrderDetil(NoID As Integer) As Pesan
        Function UpdateOrderDetil(NoID As Integer, Qty As Double) As Pesan
        Function UpdateJmlPengunjung(_UpdateJmlPengunjung As Integer, JmlPengunjung As Double) As Models.Pesan
    End Interface
End Namespace
