'use client'

import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [cookies] = useCookies(['accessToken']);

  useEffect(() => {
    const { accessToken } = cookies;
    console.log(accessToken);
    if (accessToken) {
      router.push('/exchange');
    } else {
      router.push('/login');
    }
  }, [cookies]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
    </div>
  );
}
