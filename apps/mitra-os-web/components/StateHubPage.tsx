import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import geoData from "../lib/geoData.json";
import { HybridMovieWrapper } from "./HybridMovieWrapper";

export const StateHubPage: React.FC = () => {
  const { country, state } = useParams<{ country: string; state: string }>();

  const formattedState = state
    ? encodeURIComponent(state.replace(/-/g, " "))
    : "State";
  const formattedCountry = country
    ? encodeURIComponent(country.replace(/-/g, " "))
    : "Country";

  const decodedState = decodeURIComponent(formattedState)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const decodedCountry = decodeURIComponent(formattedCountry)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const stateNodes = useMemo(() => {
    return (geoData.locations as any[])
      .filter((loc) => loc.state === state && loc.country === country)
      .sort((a, b) => a.display_name.localeCompare(b.display_name));
  }, [state, country]);

  if (stateNodes.length === 0) {
    return <Navigate to="/coverage" replace />;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `https://dukaanmitra.in/solutions/${country}/${state}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dukaanmitra.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Coverage",
        item: "https://dukaanmitra.in/coverage",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: decodedState,
        item: `https://dukaanmitra.in/solutions/${country}/${state}`,
      },
    ],
  };

  const title = `Retail Automation & Billing Software in ${decodedState}, ${decodedCountry} | DukaanMitra`;
  const description = `Explore AI-powered retail software, Khata automation, and WhatsApp billing apps across ${stateNodes.length}+ cities in ${decodedState}. Upgrade your business today.`;

  return (
    <HybridMovieWrapper>
      <div className="bg-slate-50 min-h-screen py-24 px-6 lg:px-20">
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://dukaanmitra.in/solutions/${country}/${state}`}
          />
          <meta property="og:site_name" content="DukaanMitra" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <link
            rel="canonical"
            href={`https://dukaanmitra.in/solutions/${country}/${state}`}
          />
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        </Helmet>

        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            {/* Breadcrumbs Navigation */}
            <nav className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center justify-center space-x-2">
              <Link to="/" className="hover:text-emerald-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                to="/coverage"
                className="hover:text-emerald-400 transition-colors"
              >
                Coverage
              </Link>
              <span>/</span>
              <span className="text-slate-900">{decodedState}</span>
            </nav>

            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-4">
              State-Level Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
              Retail AI in <br className="md:hidden" />
              <span className="text-emerald-500">{decodedState}</span>
            </h1>
            <p className="text-slate-500 font-bold italic text-xl max-w-2xl mx-auto">
              DukaanMitra is empowering merchants across {decodedState}. Explore
              localized AI billing solutions for your city below.
            </p>
          </div>

          <div className="bg-white p-6 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
            {stateNodes.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stateNodes.map((loc) => (
                  <Link
                    key={loc.city}
                    to={`/solutions/${country}/${state}/${loc.city}`}
                    className="group p-5 md:p-6 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all flex flex-col items-start gap-2"
                  >
                    <span className="font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                      {loc.display_name}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {loc.industry || "Retail"} Sector
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                  No Cities Listed
                </h3>
                <p className="text-slate-500 font-bold mt-2">
                  Check back soon for expansion into {decodedState}.
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/coverage"
              className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest text-sm"
            >
              &larr; Back to Global Coverage
            </Link>
          </div>
        </div>
      </div>
    </HybridMovieWrapper>
  );
};
