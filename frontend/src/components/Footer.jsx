export default function Footer() {
  return (
    <footer className="bg-primary text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Gestion des Achats. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
