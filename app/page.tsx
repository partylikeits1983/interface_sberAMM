import { demos } from '#/lib/demos';
import Link from 'next/link';

import { Analytics } from '@vercel/analytics/react';

// import { AddressBar } from '#/ui/address-bar';

export default function Page() {
  return (
    <div className="space-y-8">
      <h1 className="font-large text-xl text-gray-300">
        Sberbank AMM
      </h1>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="https://companieslogo.com/img/orig/SBER.ME-10de1f5f.png?t=1629633978"
          alt="Stockfish Icon"
          style={{ maxWidth: '40%', maxHeight: '40%' }}
        />
      </div>

      <div className="space-y-10 text-white">
        {demos.map((section) => {
          return (
            <div key={section.name} className="space-y-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {section.name}
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {section.items.map((item) => {
                  return (
                    <Link
                      href={`/${item.slug}`}
                      key={item.name}
                      className="group block space-y-1.5 rounded-lg bg-gray-900 px-5 py-3 hover:bg-gray-800"
                    >
                      <div className="font-medium text-gray-200 group-hover:text-gray-50">
                        {item.name}
                      </div>

                      {item.description ? (
                        <div className="line-clamp-3 text-sm text-gray-400 group-hover:text-gray-300">
                          {item.description}
                        </div>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Analytics />
    </div>
  );
}
