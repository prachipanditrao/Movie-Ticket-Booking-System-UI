export function Footer() {
  return (
    <footer className="py-8 mt-12 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} CineBooker. All rights reserved.</p>
        <p className="mt-1">Experience the Magic of Cinema.</p>
      </div>
    </footer>
  );
}
