import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-4 text-center sm:flex-row">
        <Link href="/">
          <Image
            alt="logo"
            src="/assets/images/logo.svg"
            height={38}
            width={128}
          />
        </Link>
        <p> 2024 Evently. All Rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
