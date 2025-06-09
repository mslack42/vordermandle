"use client";

import Link from "next/link";

export default function Home() {
  const now = new Date(Date.now())
  const dailyLink = `/daily/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full flex flex-row justify-center p-8">
        <div className="bg-theme-blue w-96 flex flex-col p-5 border-foreground border-6 select-none ">
          <h1 className="w-full text-5xl text-center">Vordermandle</h1>
          <h2 className="w-full text-xl text-center">
            A Countdown-inspired Wordlelike
          </h2>
        </div>
      </div>
      <ul className="w-full px-3 flex flex-col gap-3 grow justify-center">
        <li className="w-full flex flex-row justify-center">
          <MenuButton link={dailyLink}>Daily</MenuButton>
        </li>
        <li className="w-full flex flex-row justify-center">
          <MenuButton link="/daily">Archive</MenuButton>
        </li>
        {/* <li className="w-full flex flex-row justify-center">
          <MenuButton>Campaign</MenuButton>
        </li>
        <li className="w-full flex flex-row justify-center">
          <MenuButton>FAQ</MenuButton>
        </li> */}
      </ul>
    </div>
  );
}

type MenuButtonProps = React.PropsWithChildren & {
  link?: string;
  onClick?: () => void;
  disabled?: boolean;
};
function MenuButton(props: MenuButtonProps) {
  let content = (
    <button className="p-2 text-lg bg-theme-red rounded-xl border-foreground border-4 hover:bg-theme-red-darker w-44">
      {props.children}
    </button>
  );
  if (props.link) {
    content = <Link href={props.link}>{content}</Link>;
  }
  return content;
}
