Namespace Models
    Public Class MSO
        Public Property NoID As Nullable(Of Integer)
        Public Property Kode As String
        Public Property Tanggal As Nullable(Of Date)
        Public Property IDSalesman As Nullable(Of Integer)
        Public Property Table As MTable
        Public Property JmlPengunjung As Nullable(Of Integer)
        Public Property Catatan As String
        Public Property DataDetil As List(Of MSOD)
    End Class
End Namespace
