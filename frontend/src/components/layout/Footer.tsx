export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
      <p>&copy; {currentYear} AI Data Catalog Builder. All rights reserved.</p>
    </footer>
  )
}
