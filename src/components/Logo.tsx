import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="text-2xl font-bold tracking-tight text-primary hover:text-primary/90 transition-colors">
      Cine<span className="text-accent">Booker</span>
    </Link>
  );
}
