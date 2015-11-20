Namespace Register
    Public Class Service
        Function VPOSServices() As Repository.IRSVPOS
            Return New Repository.IMPVPOS
        End Function
    End Class
End Namespace
