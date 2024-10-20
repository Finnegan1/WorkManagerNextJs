import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Impressum</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
          <p>Sachsenforst</p>
          <p>Bonnewitzer Str. 34</p>
          <p>01796 Pirna</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">Vertreten durch</h2>
          <p>Max Mustermann</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">Kontakt</h2>
          <p>Telefon: 03501 542-0</p>
          <p>E-Mail: poststelle.sbs-graupa@smul.sachsen.de</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>Erika Musterfrau</p>
          <p>Bonnewitzer Str. 34</p>
          <p>01796 Pirna</p>
        </CardContent>
      </Card>
    </div>
  )
}
