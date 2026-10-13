import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import geoData from "../lib/geoData.json";

export const Coverage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Group locations by Country -> State -> Cities
  const hierarchy = useMemo(() => {
    const struct: Record<
      string,
      Record<
        string,
        { city: string; state: string; country: string; display_name: string }[]
      >
    > = {};

    geoData.locations.forEach((loc) => {
      const country = loc.country;
      const state = loc.state;

      if (!struct[country]) struct[country] = {};
      if (!struct[country][state]) struct[country][state] = [];

      struct[country][state].push(loc);
    });

    return struct;
  }, []);

  const [filteredHierarchy, count] = useMemo(() => {
    if (!searchTerm) {
      return [hierarchy, geoData.locations.length] as const;
    }

    let matchCount = 0;
    const term = searchTerm.toLowerCase();
    const filtered: Record<
      string,
      Record<
        string,
        { city: string; state: string; country: string; display_name: string }[]
      >
    > = {};

    Object.keys(hierarchy).forEach((country) => {
      Object.keys(hierarchy[country]).forEach((state) => {
        const matches = hierarchy[country][state].filter(
          (loc) =>
            loc.city.toLowerCase().includes(term) ||
            loc.display_name.toLowerCase().includes(term) ||
            loc.state.toLowerCase().includes(term) ||
            loc.country.toLowerCase().includes(term),
        );

        if (matches.length > 0) {
          if (!filtered[country]) filtered[country] = {};
          filtered[country][state] = matches;
          matchCount += matches.length;
        }
      });
    });

    return [filtered, matchCount] as const;
  }, [searchTerm, hierarchy]);

  const formatName = (slug: string) => {
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-6 lg:px-20">
      <Helmet>
        <title>
          Global Coverage Directory - AI Retail Solutions | DukaanMitra
        </title>
        <meta
          name="description"
          content="Explore DukaanMitra's AI-powered retail and billing solutions available across thousands of cities globally. Find your local city and transform your shop today."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-[10px] mb-4">
            Global Presence Matrix
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
            Empowering Retailers <br />{" "}
            <span className="text-indigo-600">Worldwide</span>
          </h1>
          <p className="text-slate-500 font-bold italic text-xl max-w-2xl mx-auto">
            From India's Business hubs to Global Retail Centers, DukaanMitra’s
            Semantic AI engine is modernizing khata and inventory everywhere.
          </p>
        </div>

        <div className="w-full h-[600px] mb-16 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <iframe
            src="https://storage.googleapis.com/maps-solutions-e4nho2tbux/locator-plus/659g/locator-plus.html"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="DukaanMitra Store Locator"
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by city, state, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-200 text-slate-900 px-6 py-4 rounded-2xl font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          />
          <div className="mt-3 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
            Showing {count} Locations
          </div>
        </div>

        <div className="space-y-16">
          {Object.keys(filteredHierarchy)
            .sort()
            .map((country) => (
              <div key={country} className="space-y-8">
                <h2 className="text-4xl font-black italic text-slate-900 uppercase border-b-2 border-slate-200 pb-4 inline-block">
                  {formatName(country)}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {Object.keys(filteredHierarchy[country])
                    .sort()
                    .map((state) => (
                      <div
                        key={`${country}-${state}`}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                      >
                        <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">
                          {formatName(state)}
                        </h3>
                        <ul className="space-y-3">
                          {filteredHierarchy[country][state]
                            .sort((a, b) =>
                              a.display_name.localeCompare(b.display_name),
                            )
                            .map((loc) => (
                              <li key={loc.city}>
                                <Link
                                  to={`/solutions/${country}/${state}/${loc.city}`}
                                  className="text-slate-500 font-bold hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></span>
                                  {loc.display_name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            ))}

          {count === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic">
                No Locations Found
              </h3>
              <p className="text-slate-500 font-bold mt-2">
                DukaanMitra is accessible anywhere via WhatsApp, even if your
                city isn't listed!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
