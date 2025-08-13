// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { signOut, useSession } from 'next-auth/react';

// export default function Navbar() {
//   const pathname = usePathname();
//   const {data: session, status} = useSession();
//   const role = session?.user?.role;

//   return (
//     <nav className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
//       <div className="space-x-4">
//         <Link
//           href="/dashboard"
//           className={`font-medium ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-800'}`}
//         >
//           Dashboard
//         </Link>
//         <Link
//           href="/create-ticket"
//           className={`font-medium ${pathname === '/create-ticket' ? 'text-blue-600' : 'text-gray-800'}`}
//         >
//           Create Ticket
//         </Link>
//       </div>
//       <div className = "flex items-center gap-4">
//         {status==='loading'? null:(
//           <span className="text-sm text-gray-600">
//             {role === 'admin' ? 'Admin' : 'User'}
//           </span>
//         )}
//         <Button variant="outline" onClick={() => signOut({ callbackUrl: '/login' })}>
//           Log out
//         </Button>
//       </div>
//     </nav>
//   );
// }