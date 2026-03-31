import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ROUTES } from '@/routes/paths'
import { apiRequest } from '@/utils/api'

interface IPatientProfile {
  id: string
  firstName: string
  lastName: string
  createdAt: string
}

interface IPatientsListResponse {
  data: IPatientProfile[]
}

export const PatientsPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [patients, setPatients] = React.useState<IPatientProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    apiRequest<IPatientsListResponse>('/patients')
      .then(data => {
        setPatients(data.data ?? [])
      })
      .catch(e => {
        setError(e.message || 'Failed to load patients.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>{t('patients.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">{t('patients.loading')}</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">{t('patients.firstName', 'Imię')}</th>
                  <th className="text-left p-2">{t('patients.lastName', 'Nazwisko')}</th>
                  <th className="text-left p-2">{t('patients.createdAt', 'Data utworzenia')}</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(ROUTES.PATIENTS.DETAIL(p.id))}
                  >
                    <td className="p-2">{p.firstName}</td>
                    <td className="p-2">{p.lastName}</td>
                    <td className="p-2">
                      {new Date(p.createdAt).toLocaleDateString(i18n.language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
