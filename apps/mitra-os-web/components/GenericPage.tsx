import React from "react";
import { Helmet } from "react-helmet-async";

export const GenericPage = ({ title }: { title: string }) => {
  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center min-h-[60vh]">
      <Helmet>
        <title>{title} - DukaanMitra OS</title>
      </Helmet>
      <div className="text-center space-y-6 max-w-2xl px-6">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900">
          {title}
        </h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          This page is currently being updated for DukaanMitra OS v3.0 Beta.
          Please check back later for detailed information regarding{" "}
          {title.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};
