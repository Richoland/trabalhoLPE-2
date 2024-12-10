import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import Menu from '@/componentes/Menu';
import { NextAuthProvider } from './providers/NextAuthProvider';
export const metadata = {
  title: "eShop com Next 14",
  description: "App com Next Fullstack",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Menu />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
