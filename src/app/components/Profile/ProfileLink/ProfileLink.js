// components/ProfileLink.js
import Link from 'next/link';

export default function ProfileLink({ profile, children, className = '' }) {
  return (
    <Link
      href={`/u/${profile.slug}`}
      className={`hover:text-blue-600 transition-colors ${className}`}
      title={`View ${profile.displayName}'s profile`}
    >
      {children || profile.displayName}
    </Link>
  );
}