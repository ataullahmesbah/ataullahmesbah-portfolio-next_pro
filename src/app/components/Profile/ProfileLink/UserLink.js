// components/Profile/ProfileLink/UserLink.js
import Link from 'next/link';

export default function UserLink({ author }) {
  
  if (!author) {
    return <span className="text-gray-600">Unknown Author</span>;
  }


  if (typeof author === 'string') {
    const username = author.toLowerCase().replace(/\s+/g, '-');
    return (
      <Link 
        href={`/u/${username}`}
        className="text-blue-500 hover:text-blue-700 transition-colors"
      >
        {author}
      </Link>
    );
  }


  return (
    <Link 
      href={`/u/${author.username}`}
      className="text-blue-500 hover:text-blue-700 transition-colors"
    >
      {author.displayName || author.username}
    </Link>
  );
}