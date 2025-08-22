import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/mtbc_3.jpg";
import MenuGroup, { MenuGroupIf } from "./MenuGroup";

// Menu definitions
const menuGroup1: MenuGroupIf[] = [
  {
    label: "About Us",
    key: "about",
    items: [
      { label: "Home", to: "/" },
      { label: "About Us", to: "/aboutUs" },
    ],
  },
  {
    label: "Leagues",
    key: "teams",
    items: [
      { label: "Kennet A", to: "/team/kl/A" },
      { label: "Kennet B", to: "/team/kl/B" },
      { label: "KLV A", to: "/team/klv/A" },
      { label: "KLV B", to: "/team/klv/B" },
      { label: "KLV C", to: "/team/klv/C" },
      { label: "KLV D", to: "/team/klv/D" },
      { label: "Royal Shield", to: "/team/rs/A" },
      { label: "TVL Ash", to: "/team/tv/A" },
      { label: "TVL Beech", to: "/team/tv/B" },
    ],
  },
];

const menuGroup2: MenuGroupIf[] = [
  {
    label: "More",
    key: "more",
    items: [
      { label: "Admin", to: "/admin" },
    ],
  },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const closeMenu = () => {
    setOpen(false);
    setDropdown(null);
  };

  // Refs for keyboard navigation
  const topLevelRefs = useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>([]);

  const handleTopLevelKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const refs = topLevelRefs.current;
    if (!refs.length) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % refs.length;
      refs[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + refs.length) % refs.length;
      refs[prev]?.focus();
    }
  };

  return (
    <header className="shadow-md py-2 px-6 h-20 md:h-24 relative z-50">
      <div className="flex md:items-center">
        <Link to="/" className="mr-4">
          <img src={logo} alt="Logo" className="h-16 md:h-20 w-auto" />
        </Link>

        <div className="flex flex-col justify-center w-full">
          <h1 className="text-xl md:text-3xl font-bold leading-tight">Maidenhead Town</h1>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex flex-wrap gap-1 tb:gap-8 lg:gap-12 xl:gap-20 text-2xl text-black font-medium mt-1 relative z-50"
            role="menubar"
          >
            {menuGroup1.map((menu, idx) => (
              <MenuGroup
                key={menu.key}
                menu={menu}
                isMobile={false}
                ref={(el: HTMLButtonElement | null) =>
                  (topLevelRefs.current[idx] = el)
                }
              />
            ))}

            {/* Non-dropdown links */}
            {["/fixtures", "/booking", "/location", "/contactUs"].map((to, idx) => {
              const labels = ["Fixtures", "Booking", "Location", "Contact"];
              const refIndex = menuGroup1.length + idx;
              return (
                <Link
                  key={to}
                  to={to}
                  className="hover:text-indigo-600"
                  role="menuitem"
                  ref={(el) => (topLevelRefs.current[refIndex] = el)}
                  onKeyDown={(e) => handleTopLevelKeyDown(e, refIndex)}
                >
                  {labels[idx]}
                </Link>
              );
            })}

            {menuGroup2.map((menu, idx) => {
              const refIndex = menuGroup1.length + 4 + idx;
              return (
                <MenuGroup
                  key={menu.key}
                  menu={menu}
                  isMobile={false}
                  ref={(el: HTMLButtonElement | null) =>
                    (topLevelRefs.current[refIndex] = el)
                  }
                />
              );
            })}
          </nav>
        </div>

        {/* Mobile toggle */}
        <div className="flex justify-between items-center md:hidden mt-4">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            className="text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav className="flex flex-col bg-white md:hidden mt-1 gap-2 text-base text-black font-medium w-full">
          {menuGroup1.map((menu) => (
            <MenuGroup
              key={menu.key}
              menu={menu}
              isMobile
              dropdown={dropdown}
              setDropdown={setDropdown}
              closeMenu={closeMenu}
            />
          ))}

          {["/fixtures", "/booking", "/location", "/contactUs"].map((to, idx) => {
            const labels = ["Fixtures", "Booking", "Location", "Contact"];
            return (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className="px-2 py-1 hover:text-indigo-600"
              >
                {labels[idx]}
              </Link>
            );
          })}

          {menuGroup2.map((menu) => (
            <MenuGroup
              key={menu.key}
              menu={menu}
              isMobile
              dropdown={dropdown}
              setDropdown={setDropdown}
              closeMenu={closeMenu}
            />
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
