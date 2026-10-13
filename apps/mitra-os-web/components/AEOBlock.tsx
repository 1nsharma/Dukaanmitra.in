import React from "react";

export const AEOBlock: React.FC<{ items: { q: string; a: string }[] }> = ({
  items,
}) => {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-2">{item.q}</h3>
          <p className="text-slate-600">{item.a}</p>
        </div>
      ))}
    </div>
  );
};
