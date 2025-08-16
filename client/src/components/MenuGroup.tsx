import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

interface MenuItem {
  label: string;
  to: string;
}

export interface MenuGroupIf {
  label: string;
  key: string;
  items: MenuItem[];
}

interface MenuGroupProps {
  menu: MenuGroupIf;
  isMobile?: boolean;
  dropdown?: string | null;
  setDropdown?: (key: string | null) => void;
  closeMenu?: () => void;
}

const MenuGroup: React.FC<MenuGroupProps> = ({
  menu,
  isMobile = false,
  dropdown,
  setDropdown,
  closeMenu,
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (isMobile && setDropdown) {
      setDropdown(dropdown === menu.key ? null : menu.key);
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) &&
          !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (!isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") || [];

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isMobile) setOpen(true);
        items[0]?.focus();
        break;
      case "Escape":
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") || [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(index + 1) % items.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(index - 1 + items.length) % items.length].focus();
    } else if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className={`relative ${isMobile ? "" : "group"}`}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={open || (isMobile && dropdown === menu.key)}
        aria-controls={`menu-${menu.key}`}
        className={`flex items-center gap-2 w-full ${isMobile ? "justify-between px-2 py-1" : "hover:text-indigo-600"}`}
      >
        {menu.label} <IoMdArrowDropdown aria-hidden="true" />
      </button>

      {isMobile && dropdown === menu.key && (
        <div
          id={`menu-${menu.key}`}
          role="menu"
          className="pl-4 flex flex-col gap-1"
        >
          {menu.items.map((item) => (
            <Link
              key={item.to}
              role="menuitem"
              to={item.to}
              onClick={closeMenu}
              className="px-2 py-1 hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {!isMobile && open && (
        <div
          ref={menuRef}
          id={`menu-${menu.key}`}
          role="menu"
          aria-label={menu.label}
          className="absolute left-0 top-full bg-white shadow-md rounded-md py-2 px-4 mt-1 min-w-max flex flex-col whitespace-nowrap z-50"
        >
          {menu.items.map((item, idx) => (
            <Link
              key={item.to}
              role="menuitem"
              to={item.to}
              className="py-1 hover:text-indigo-600"
              onKeyDown={(e) => handleItemKeyDown(e, idx)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuGroup;
