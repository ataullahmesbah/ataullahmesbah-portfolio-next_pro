export async function getAllPages() {
    return [
      { slug: '' }, // Home Page
      { slug: 'about' },
      { slug: 'contact' },
      { slug: 'services' },
      { slug: 'portfolio' },
      { slug: 'blog' },
    ];
  }
  