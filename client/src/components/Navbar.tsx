import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import logo from "../assets/mtbc_3.jpg";

interface MenuItem {
  label: string;
  to: string;
}

interface MenuGroup {
  label: string;
  key?: string;
  items: MenuItem[];
}

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const closeMenu = () => {
    setOpen(false);
    setDropdown(null);
  };

  const menuGroups: MenuGroup[] = [
    {
      label: "About Us",
      key: "about",
      items: [
        { label: "Home", to: "/" },
        { label: "About Us", to: "/aboutUs" },
        { label: "History", to: "/history" },
        { label: "Officers", to: "/officers" },
      ],
    },
    {
      label: "Teams",
      key: "teams",
      items: [
        { label: "Kennet A", to: "/team/kl/A" },
        { label: "Kennet B", to: "/team/kl/B" },
        { label: "KLV A", to: "/team/klv/A" },
        { label: "KLV B", to: "/team/klv/B" },
        { label: "KLV C", to: "/team/klv/C" },
        { label: "KLV D", to: "/team/klv/D" },
        { label: "Royal Shield", to: "/team/rs/A" },
        { label: "TV Ash", to: "/team/tv/A" },
        { label: "TV Beech", to: "/team/tv/B" },
      ],
    },
    {
      label: "News",
      key: "news",
      items: [
        { label: "Notice Board", to: "/noticeboard" },
        { label: "News Reports", to: "/newsReports" },
      ],
    },
    {
      label: "More",
      key: "more",
      items: [
        { label: "County Presidents", to: "/countyPresidents" },
        { label: "Presidents", to: "/presidents" },
      ],
    },
  ];

  return (
    <header className="shadow-md py-2 px-6 h-20 md:h-24 relative z-50">
      <div className="flex md:items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16 md:h-20 w-auto mr-4" />
        </Link>

        <div className="flex flex-col justify-center w-full">
          <h1 className="text-xl md:text-2xl font-bold leading-tight">Maidenhead Town</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap gap-1 tb:gap-8 lg:gap-12 xl:gap-20 text-base text-black font-medium mt-1 relative z-50">
            {menuGroups.map((menu) => (
              <div key={menu.label} className="relative group">
                <button className="flex items-center gap-2 hover:text-indigo-600">
                  {menu.label} <IoMdArrowDropdown />
                </button>
                <div className="absolute left-0 top-full invisible opacity-0 group-hover:visible group-hover:opacity-100 transition
                  bg-white shadow-md rounded-md py-2 px-4 mt-1 min-w-max flex flex-col whitespace-nowrap z-50"
                >
                  {menu.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="py-1 hover:text-indigo-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Non-dropdown links */}
            <Link to="/fixtures" className="hover:text-indigo-600">Fixtures</Link>
            <Link to="/booking" className="hover:text-indigo-600">Booking</Link>
            <Link to="/location" className="hover:text-indigo-600">Location</Link>
            <Link to="/contactUs" className="hover:text-indigo-600">Contact</Link>
            <Link to="/admin" className="hover:text-indigo-600">Admin</Link>
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
          {menuGroups.map((menu) => (
            <div key={menu.key}>
              <button
                onClick={() =>
                  setDropdown(dropdown === menu.key ? null : menu.key!)
                }
                className="flex w-full items-center justify-between px-2 py-1 hover:text-indigo-600"
              >
                {menu.label} <IoMdArrowDropdown />
              </button>
              {dropdown === menu.key && (
                <div className="pl-4 flex flex-col gap-1">
                  {menu.items.map((item) => (
                    <Link key={item.to} to={item.to} onClick={closeMenu}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to="/fixtures" onClick={closeMenu} className="px-2 py-1 hover:text-indigo-600">Fixtures</Link>
          <Link to="/booking" onClick={closeMenu} className="px-2 py-1 hover:text-indigo-600">Booking</Link>
          <Link to="/location" onClick={closeMenu} className="px-2 py-1 hover:text-indigo-600">Location</Link>
          <Link to="/contactUs" onClick={closeMenu} className="px-2 py-1 hover:text-indigo-600">Contact</Link>
          <Link to="/admin" onClick={closeMenu} className="px-2 py-1 hover:text-indigo-600">Admin</Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
