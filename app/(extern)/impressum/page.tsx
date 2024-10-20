import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Impressum</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">I. Herausgeber</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">ExampleCompany</h3>
          <p>vertreten durch:</p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">ExampleCompany Abteilung</h3>
          <p><strong>Verantwortlich gemäß § 18 Abs. 2 MStV für die Inhalte mit Herausgeberkennzeichnung:</strong></p>
          <p>Max Mustermann, Pressesprecher</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">ExampleCompany Abteilung (ECA)</h3>
          <p>Besucheradresse:<br />
          Musterstraße 123<br />
          12345 Musterstadt<br />
          OT Muster</p>

          <p>Telefon: +49 123 456-789</p>
          <p>Telefax: +49 123 456-987</p>
          <p>E-Mail: max.mustermann@example.com</p>
          <p>Webseite: www.example.com</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">II. Rechtliche Hinweise</h2>
          <h3 className="text-lg font-semibold mt-4 mb-2">1. Haftung für Inhalte</h3>
          <p>Die Inhalte unseres Internetauftritts wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">2. Haftung für Links</h3>
          <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">3. Urheberrecht</h3>
          <p>Die Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">III. Hinweis zur Finanzierung des Internetauftrittes</h2>
          <p>Dieser Internetauftritt wird durch ExampleCompany finanziert.</p>
        </CardContent>
      </Card>
    </div>
  )
}
