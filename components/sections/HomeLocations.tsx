const UK_LOCATIONS = [
  { name: "Hemel Hempstead", address: "30 Lawn Lane, Hemel Hempstead, HP3 9HL" },
  { name: "Luton", address: "32 Kimpton Rd, Luton, LU2 0SX" },
  { name: "Hammersmith", address: "130 King St, London, W6 0QU" },
  { name: "High Barnet", address: "119 High Street, Barnet, EN5 5UZ" },
  { name: "Dalston", address: "517 Kingsland Rd, London, E8 4AR" },
  { name: "Kentish Town", address: "JML House, Regis Rd, London, NW5 3EW" },
] as const;

export function HomeLocations() {
  return (
    <section className="bg-paper px-5 py-16 text-ink sm:px-8 sm:py-24" aria-labelledby="locations-heading">
      <div className="mx-auto max-w-6xl">
        <header className="text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/45">Find your nearest BRIM</p><h2 id="locations-heading" className="mt-3 font-display text-4xl uppercase leading-none sm:text-6xl">UK locations</h2></header>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {UK_LOCATIONS.map((location) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`BRIM Burgers ${location.address}`)}`;
            return <article key={location.name} className="flex min-h-56 flex-col items-center justify-between rounded-lg bg-ink px-6 py-9 text-center text-paper sm:px-9"><div><h3 className="font-display text-2xl uppercase leading-tight sm:text-3xl">{location.name}</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-paper/65">{location.address}</p></div><a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-extrabold uppercase text-ink transition-transform hover:scale-[1.01]">View location <span aria-hidden>↗</span></a></article>;
          })}
        </div>
      </div>
    </section>
  );
}
