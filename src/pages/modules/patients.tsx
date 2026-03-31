import * as React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface IPatientProfile {
  id: string
  firstName: string
  lastName: string
  createdAt: string
}

export const PatientsPage: React.FC = () => {
  const { t } = useTranslation()
  const [patients, setPatients] = React.useState<IPatientProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    fetch(`${import.meta.env.VITE_BACKEND_API_URL}/patients`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setPatients(data.data ?? [])
      })
      .catch((e) => {
        setError(e.message || "Failed to load patients.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>{t("patients.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">{t("patients.loading")}</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">{t("patients.firstName", "Imię")}</th>
                  <th className="text-left p-2">{t("patients.lastName", "Nazwisko")}</th>
                  <th className="text-left p-2">{t("patients.createdAt", "Data utworzenia")}</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2">{p.firstName}</td>
                    <td className="p-2">{p.lastName}</td>
                    <td className="p-2">
                      {new Date(p.createdAt).toLocaleDateString("pl-PL")}
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