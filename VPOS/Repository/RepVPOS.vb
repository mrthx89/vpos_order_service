Imports VPOS.Models
Imports System.Data.SqlClient

Namespace Repository
    Public Module PublicVPOS
        Public NamaApplikasi As String = "VPOS Service"

    End Module

    Public Class RepVPOS
        Public Function TestKoneksi() As Boolean
            Dim Result As Boolean = False
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Try
                    cn.Open()
                    Result = True
                Catch ex As Exception
                    'MsgBox("Error : " & ex.Message, MsgBoxStyle.Exclamation, NamaApplikasi)
                End Try
            End Using
            Return Result
        End Function
        Public Function GetUserLogin(Kode As String, Pwd As String) As MUser
            Dim UserLogin As New MUser
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT * FROM MUser (NOLOCK) WHERE IsActive=1 AND UPPER(Kode)=@Kode AND UPPER(Pwd)=@Pwd"
                    com.Parameters.Clear()
                    com.Parameters.Add(New SqlParameter("@Kode", Kode.ToUpper))
                    com.Parameters.Add(New SqlParameter("@Pwd", Utils.EncryptText(Pwd.ToUpper, "vpoint")))
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        UserLogin.NoID = Utils.NullToInt(oDR.Item("NoID"))
                        UserLogin.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        UserLogin.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        UserLogin.Pwd = Utils.DecryptText(Utils.NullToStr(oDR.Item("Pwd")), "vpoint")
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return UserLogin
        End Function
        Public Function GetUserByNoID(NoID As Long) As MUser
            Dim UserLogin As New MUser
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT * FROM MUser (NOLOCK) WHERE IsActive=1 AND NoID=@NoID"
                    com.Parameters.Clear()
                    com.Parameters.Add(New SqlParameter("@NoID", NoID))
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        UserLogin.NoID = Utils.NullToInt(oDR.Item("NoID"))
                        UserLogin.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        UserLogin.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        UserLogin.Pwd = Utils.DecryptText(Utils.NullToStr(oDR.Item("Pwd")), "vpoint")
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return UserLogin
        End Function
        Public Function GetKategori() As List(Of MKategori)
            Dim DaftarKategori As New List(Of MKategori)
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT * FROM MKategori (NOLOCK) WHERE IsActive=1 AND IsPOS=1"
                    com.Parameters.Clear()
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Dim Obj As New MKategori
                        Obj.NoID = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        DaftarKategori.Add(Obj)
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return DaftarKategori
        End Function
        Public Function GetBarangByKategori(IDKategori As Long) As List(Of MBarang)
            Dim Daftar As New List(Of MBarang)
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT B.NoID, B.IDBarang, B.IDSatuan, B.Barcode, A.Kode, A.Nama, B.HargaJual, C.Kode AS Satuan " & vbCrLf &
                                      " FROM MBarang (NOLOCK) A " & vbCrLf &
                                      " INNER JOIN MBarangD (NOLOCK) B ON A.NoID=B.IDBarang " & vbCrLf &
                                      " LEFT JOIN MSatuan (NOLOCK) C ON C.NoID=B.IDSatuan " & vbCrLf &
                                      " WHERE A.IsActive=1 AND B.IsActive=1 AND B.IsJualPOS=1 AND A.IDKategori=" & IDKategori
                    com.Parameters.Clear()
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Dim Obj As New MBarang
                        Obj.IDBarangD = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.IDBarang = Utils.NullToInt(oDR.Item("IDBarang"))
                        Obj.Barcode = Utils.NullToStr(oDR.Item("Barcode"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        Obj.Satuan = Utils.NullToStr(oDR.Item("Satuan"))
                        Obj.IDSatuan = Utils.NullToInt(oDR.Item("IDSatuan"))
                        Obj.HargaJual = Utils.NullToDbl(oDR.Item("HargaJual"))
                        Daftar.Add(Obj)
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Daftar
        End Function
        Public Function GetBarangByFilter(FilterBarang As String) As List(Of MBarang)
            Dim Daftar As New List(Of MBarang)
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT B.NoID, B.IDBarang, B.IDSatuan, B.Barcode, A.Kode, A.Nama, B.HargaJual, C.Kode AS Satuan " & vbCrLf &
                                      " FROM MBarang (NOLOCK) A " & vbCrLf &
                                      " INNER JOIN MBarangD (NOLOCK) B ON A.NoID=B.IDBarang " & vbCrLf &
                                      " LEFT JOIN MSatuan (NOLOCK) C ON C.NoID=B.IDSatuan " & vbCrLf &
                                      " WHERE A.IsActive=1 AND B.IsActive=1 AND B.IsJualPOS=1 AND (UPPER(A.Kode) LIKE UPPER(@Filter) OR UPPER(A.Nama) LIKE UPPER(@Filter) OR UPPER(A.Barcode) LIKE UPPER(@Filter))"
                    com.Parameters.Clear()
                    com.Parameters.Add(New SqlParameter("@Filter", "%" & FilterBarang & "%"))
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Dim Obj As New MBarang
                        Obj.IDBarangD = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.IDBarang = Utils.NullToInt(oDR.Item("IDBarang"))
                        Obj.Barcode = Utils.NullToStr(oDR.Item("Barcode"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        Obj.Satuan = Utils.NullToStr(oDR.Item("Satuan"))
                        Obj.IDSatuan = Utils.NullToInt(oDR.Item("IDSatuan"))
                        Obj.HargaJual = Utils.NullToDbl(oDR.Item("HargaJual"))
                        Daftar.Add(Obj)
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Daftar
        End Function
        Public Function GetBarangByID(IDBarangD As Long) As MBarang
            Dim Obj As New MBarang
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT B.NoID, B.IDBarang, B.IDSatuan, B.Barcode, A.Kode, A.Nama, B.HargaJual, C.Kode AS Satuan " & vbCrLf &
                                      " FROM MBarang (NOLOCK) A " & vbCrLf &
                                      " INNER JOIN MBarangD (NOLOCK) B ON A.NoID=B.IDBarang " & vbCrLf &
                                      " LEFT JOIN MSatuan (NOLOCK) C ON C.NoID=B.IDSatuan " & vbCrLf &
                                      " WHERE B.NoID=" & IDBarangD
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Obj.IDBarangD = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.IDBarang = Utils.NullToInt(oDR.Item("IDBarang"))
                        Obj.Barcode = Utils.NullToStr(oDR.Item("Barcode"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        Obj.Satuan = Utils.NullToStr(oDR.Item("Satuan"))
                        Obj.IDSatuan = Utils.NullToInt(oDR.Item("IDSatuan"))
                        Obj.HargaJual = Utils.NullToDbl(oDR.Item("HargaJual"))
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function
        Public Function GetOrderByID(NoID As Long) As MSO
            Dim Obj As New MSO
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT MSO.* " & vbCrLf &
                                      " FROM MSO (NOLOCK) " & vbCrLf &
                                      " WHERE NoID=" & NoID
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Obj.NoID = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.Tanggal = Utils.NullToDate(oDR.Item("Tanggal"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.JmlPengunjung = Utils.NullToInt(oDR.Item("JmlPengunjung"))
                        Obj.IDSalesman = Utils.NullToStr(oDR.Item("IDBagPenjualan"))
                        Obj.Catatan = Utils.NullToStr(oDR.Item("Catatan"))
                        Obj.Table = GetTableByID(Utils.NullToInt(oDR.Item("IDTable")))
                        Obj.DataDetil = GetOrderDetailByIDSO(Obj.NoID)
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function
        Public Function GetOrderDetailByIDSO(NoID As Long) As List(Of MSOD)
            Dim Daftar As New List(Of MSOD)
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT MSOD.* " & vbCrLf &
                                      " FROM MSOD (NOLOCK) " & vbCrLf &
                                      " WHERE MSOD.IDSO=" & NoID
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Daftar.Add(New MSOD With {
                                   .NoID = Utils.NullToInt(oDR.Item("NoID")),
                                   .Barang = GetBarangByID(Utils.NullToLong(oDR.Item("IDBarangD"))),
                                   .Catatan = Utils.NullToStr(oDR.Item("Catatan")),
                                   .HargaJual = Utils.NullToDbl(oDR.Item("Harga")),
                                   .Qty = Utils.NullToDbl(oDR.Item("Qty")),
                                   .Jumlah = Utils.NullToDbl(oDR.Item("Jumlah"))}
                                   )
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Daftar
        End Function
        Public Function GetTableByID(NoID As Long) As MTable
            Dim Obj As New MTable
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT vTable.* " & vbCrLf &
                                      " FROM vTable (NOLOCK) " & vbCrLf &
                                      " WHERE NoID=" & NoID
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Obj.NoID = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        Obj.Status = Utils.NullToStr(oDR.Item("StatusTable"))
                        Obj.Aktif = Utils.NullToBool(oDR.Item("IsActive"))
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function
        Public Function GetDaftarMeja() As List(Of MTable)
            Dim Daftar As New List(Of MTable)
            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Dim oDR As SqlDataReader = Nothing
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "SELECT * FROM vTable (NOLOCK) ORDER BY vTable.NoID"
                    oDR = com.ExecuteReader()
                    While oDR.Read
                        Dim Obj As New MTable
                        Obj.NoID = Utils.NullToInt(oDR.Item("NoID"))
                        Obj.Kode = Utils.NullToStr(oDR.Item("Kode"))
                        Obj.Nama = Utils.NullToStr(oDR.Item("Nama"))
                        Obj.Status = Utils.NullToStr(oDR.Item("StatusTable"))
                        Obj.Aktif = Utils.NullToBool(oDR.Item("IsActive"))
                        Daftar.Add(Obj)
                    End While
                    oDR.Close()
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Daftar
        End Function
        Public Function InsertTableOrder(IDTable As Integer, IDSalesman As Integer, JmlPengunjung As Integer) As MSO
            Dim Obj As New MSO
            Dim NoID As Long = -1

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    'Cek Meja Kosong atau Tidak
                    com.CommandText = "SELECT StatusTable FROM vTable WHERE NoID = " & IDTable
                    If Utils.NullToStr(com.ExecuteScalar()).ToLower <> "Isi".ToLower Then 'Kosong Diorder
                        com.CommandText = "SELECT MAX(NoID) FROM MSO (NOLOCK)"
                        NoID = Utils.NullToLong(com.ExecuteScalar()) + 1
                        com.CommandText = "INSERT INTO MSO (NoID, Kode, Tanggal, IDTable, IDBagPenjualan, JmlPengunjung, Catatan) VALUES (" & vbCrLf &
                                          NoID & ", '" & Now().ToString("yyMMddHHmmss") & "', GETDATE(), " & IDTable & ", " & IDSalesman & ", " & JmlPengunjung & ", '')"
                        com.ExecuteNonQuery()
                    Else
                        com.CommandText = "SELECT TOP 1 NoID FROM MSO WHERE IDTable=" & IDTable & " AND YEAR(MSO.Tanggal)=YEAR(GETDATE()) AND MONTH(MSO.Tanggal)=MONTH(GETDATE()) AND DAY(MSO.Tanggal)=DAY(GETDATE()) ORDER BY MSO.IsSelesai DESC"
                        NoID = Utils.NullToLong(com.ExecuteScalar())
                        com.CommandText = "UPDATE MSO SET IsSO=0 WHERE NoID=" & NoID
                        com.ExecuteNonQuery()
                    End If

                    Obj = GetOrderByID(NoID)
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function
        Public Function InsertTableOrderDetail(IDSO As Integer, IDBarang As Integer, Qty As Integer, Catatan As String) As List(Of MSOD)
            Dim Daftar As New List(Of MSOD)
            Dim NoID As Long = -1
            Dim Barang As New MBarang

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    'Sementara insertkan terus saja
                    Barang = GetBarangByID(IDBarang)
                    com.CommandText = "SELECT MAX(NoID) FROM MSOD (NOLOCK)"
                    NoID = Utils.NullToLong(com.ExecuteScalar()) + 1
                    com.CommandText = "INSERT INTO MSOD (NoID, IDSO, IDBarangD, IDBarang, IDSatuan, Harga, Qty, Jumlah, Catatan) VALUES (" & vbCrLf &
                                      NoID & ", " & IDSO & ", " & Barang.IDBarangD & ", " & Barang.IDBarang & ", " & Barang.IDSatuan & ", " & Utils.FixKoma(Barang.HargaJual) & ", " & Utils.FixKoma(Qty) & ", " & Utils.FixKoma(Barang.HargaJual * Qty) & ", '" & Utils.FixApostropi(Catatan) & "')"
                    com.ExecuteNonQuery()

                    Daftar = GetOrderDetailByIDSO(IDSO)
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Daftar
        End Function

        Public Function SetOrder(IDSO As Integer) As Pesan
            Dim Obj As New Pesan

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "UPDATE MSO SET IsSO=1, TanggalStock=GETDATE() WHERE NoID=" & IDSO

                    If Utils.NullToLong(com.ExecuteNonQuery()) >= 1 Then
                        Obj.Pesan = "Order telah berhasil disimpan. Terima Kasih."
                        Obj.Value = True
                        Obj.Catatan = ""
                    End If
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function

        Public Function DeleteOrder(IDSO As Integer) As Pesan
            Dim Obj As New Pesan

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "DELETE FROM MSOD WHERE IDSO=" & IDSO
                    com.ExecuteNonQuery()

                    com.CommandText = "DELETE FROM MSO WHERE NoID=" & IDSO
                    If Utils.NullToLong(com.ExecuteNonQuery()) >= 1 Then
                        Obj.Pesan = "Order telah berhasil dihapus. Terima Kasih."
                        Obj.Value = True
                        Obj.Catatan = ""
                    End If
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function

        Public Function DeleteOrderDetil(NoID As Integer) As Pesan
            Dim Obj As New Pesan

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "DELETE FROM MSOD WHERE NoID=" & NoID
                    If Utils.NullToLong(com.ExecuteNonQuery()) >= 1 Then
                        Obj.Pesan = "Detil order telah berhasil dihapus. Terima Kasih."
                        Obj.Value = True
                        Obj.Catatan = ""
                    End If
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function

        Public Function UpdateOrderDetil(NoID As Integer, Qty As Double) As Pesan
            Dim Obj As New Pesan

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "UPDATE MSOD SET Qty=" & Utils.FixKoma(Qty) & ", Jumlah=Harga*" & Utils.FixKoma(Qty) & " WHERE NoID=" & NoID
                    If Utils.NullToLong(com.ExecuteNonQuery()) >= 1 Then
                        Obj.Pesan = "Detil order telah berhasil dirubah. Terima Kasih."
                        Obj.Value = True
                        Obj.Catatan = ""
                    End If
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function

        Public Function UpdateJmlPengunjung(NoID As Integer, JmlPengunjung As Double) As Pesan
            Dim Obj As New Pesan

            Using cn As New SqlConnection(My.Settings.DBConfig.ToString)
                Dim com As New SqlCommand
                Try
                    cn.Open()
                    com.Connection = cn
                    com.CommandTimeout = cn.ConnectionTimeout

                    com.CommandText = "UPDATE MSO SET JmlPengunjung=" & Utils.FixKoma(JmlPengunjung) & " WHERE NoID=" & NoID
                    If Utils.NullToLong(com.ExecuteNonQuery()) >= 1 Then
                        Obj.Pesan = "Jml Pengunjung telah berhasil dirubah. Terima Kasih."
                        Obj.Value = True
                        Obj.Catatan = ""
                    End If
                Catch ex As Exception

                Finally
                    com.Dispose()
                End Try
            End Using
            Return Obj
        End Function
    End Class
End Namespace