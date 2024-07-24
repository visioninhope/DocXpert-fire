import { UserAccountNav } from "@/components/navbar/user-account-nav";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-black">
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-4 lg:px-16 2xl:max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image alt="docxpert" src="/logo.png" width={100} height={100} />
              <span className="font-bold text-white text-2xl ">DocXpert</span>
            </div>
          </Link>
          {session ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Button
              size="sm"
              className="bg-green-500 text-black hover:bg-green-400"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
