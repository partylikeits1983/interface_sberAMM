import { ExternalLink } from '#/ui/external-link';
import Link from 'next/link';

import Docs from './docs';

export const metadata = {
  title: 'Docs',
};

const items = [
  {
    name: 'Documentation',
    slug: 'search-params',
    description: 'Update searchParams using `useRouter` and `<Link>`',
  },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-gray-300">
        SberAMM Documentation
      </h1>
      <Docs />
    </div>
  );
}
