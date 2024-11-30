import { useEffect, useState } from "react";

import RetroInput from "@/components/forms/retro-input";
import { closeNewsLetter, useNewsletterStore } from "@/lib/newsletter-store";

export default function EmailAlerts() {
  const isOpen = useNewsletterStore((s) => s.isOpen);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeNewsLetter();
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    isOpen && (
      <form
        action="https://leretroprojecteur.us6.list-manage.com/subscribe/post?u=00a9245e71d3375ef4542a588&amp;id=3270cdb251&amp;f_id=00e804e3f0"
        method="post"
        target="_blank"
      >
        <div className="fixed bottom-[3.5rem] left-[18.75rem] z-50 flex drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-20px">
            <div className="bg-retro-blue px-20px pb-20px">
              <div className="relative flex items-center justify-center border-b">
                <div className="py-10px text-center text-22px font-medium uppercase text-retro-gray">
                  « Up Close »
                </div>
                <div
                  className="absolute right-0 cursor-pointer"
                  onClick={closeNewsLetter}
                >
                  <svg
                    className="h-22px w-22px fill-retro-gray stroke-retro-blue"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="22" height="22" />
                    <line
                      x1="4.79289"
                      y1="16.8929"
                      x2="16.793"
                      y2="4.89282"
                      strokeWidth="2"
                    />
                    <line
                      x1="16.7931"
                      y1="17.1072"
                      x2="4.79306"
                      y2="5.10712"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="border-b px-1px py-18px text-center font-degular text-71px font-black uppercase leading-58px tracking-[0.01em] text-retro-gray">
                S&apos;INSCRIRE
                <br />À L&apos;ALERTE
                <br />
                DU FILM
              </div>
              <div className="flex flex-col justify-center gap-10px pb-10px pt-20px">
                <RetroInput
                  blue
                  value={email}
                  setValue={setEmail}
                  name="EMAIL"
                  placeholder="adresse@mail.com"
                  grayText
                />
              </div>
              <div className="flex">
                <input
                  type="submit"
                  value="s'inscrire"
                  className="h-42px grow cursor-pointer border bg-retro-gray text-center text-20px font-medium uppercase text-retro-blue hover:bg-retro-blue hover:text-retro-gray lg:h-48px"
                  onClick={closeNewsLetter}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  );
}
