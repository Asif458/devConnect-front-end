// src/components/shared/UserRoleBadge.jsx

import React from "react";

export default function UserRoleBadge({ role }) {
  if (!role) return null;
  let color = "bg-gray-400";
  if (role === "mentor") color = "bg-blue-600";
  if (role === "admin") color = "bg-red-600";
  if (role === "developer") color = "bg-green-600";
  return (
    <span className={`${color} text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase ml-2`}>
      {role}
    </span>
  );
}
