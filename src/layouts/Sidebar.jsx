import React from "react";

export default function Sidebar({ items, activeSlug, setActiveSlug, header = "Dashboard", className = "" }) {
  return (
    <aside className={`w-64 bg-[#032f60] text-white flex flex-col py-8 shadow-lg ${className}`}>
      <div className="mb-10 px-6">
        <h1 className="text-2xl font-semibold mb-8">{header}</h1>
        {items.map(item => (
          <button
            key={item.slug}
            className={`block w-full text-left px-4 py-3 rounded-lg mb-1 transition ${
              activeSlug === item.slug
                ? "bg-white text-[#032f60] font-semibold"
                : "hover:bg-blue-900 hover:text-white"
            }`}
            onClick={() => setActiveSlug(item.slug)}
          >
            {item.icon && <item.icon className="inline-block mr-2 w-5 h-5" />}
            {item.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
