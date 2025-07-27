import Link from 'next/link';

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/basics', label: 'Basics' },
  { href: '/art', label: 'Art' },
  { href: '/collectibles', label: 'Collectibles' },
      { href: '/stories', label: 'Stories' },
    { href: '/loyalty-points', label: 'Loyalty Points' },
    { href: '/customer/dashboard', label: 'My Dashboard' },
    { href: '/admin/analytics-unified', label: 'AI Analytics' },
    { href: '/cart', label: 'Cart' },
];

const Header = () => (
  <header className="sticky top-0 z-50 bg-off-white border-b border-gray-200">
    <nav className="flex items-center justify-between h-16 px-4">
      <div className="font-heading text-xl">NATI</div>
      <ul className="flex gap-6">
        {navLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header; 