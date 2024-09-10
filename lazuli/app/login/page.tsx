import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a40] text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-blue-700">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">Lazuli</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold">Connexion à votre compte</h2>
            <p className="mt-2 text-sm text-blue-300">
              Entrez vos identifiants pour accéder à la simulation
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="email-address" className="sr-only">
                  Adresse e-mail
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-blue-800 text-blue-100 placeholder-blue-400"
                  placeholder="Adresse e-mail"
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-blue-800 text-blue-100 placeholder-blue-400"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            <div>
              <Link href="/Dashboard">
                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
                    Se connecter</Button>
              </Link>  
            </div>
          </form>
          <div className="text-center">
            <Link className="text-sm text-blue-300 hover:text-blue-200" href="#">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-6 border-t border-blue-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-blue-400">© 2023 Lazuli. Tous droits réservés. Ceci est une plateforme de simulation.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm text-blue-400 hover:text-blue-300" href="#">
              Conditions d'utilisation
            </Link>
            <Link className="text-sm text-blue-400 hover:text-blue-300" href="#">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}