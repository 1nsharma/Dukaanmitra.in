import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a localized app structure, this root layout 
// acts as a pass-through for the localized layouts.
// Next.js 13+ App Router requires a root layout.
export default function RootLayout({children}: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
