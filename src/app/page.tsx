import Link from "next/link";

interface DemoRoom {
  roomNumber: string;
  slug: string;
  type: string;
  floor: number;
  status: string;
}

const DEMO_ROOMS: DemoRoom[] = [
  { roomNumber: "101", slug: "room-101-slug", type: "Deluxe King", floor: 1, status: "OCCUPIED" },
  { roomNumber: "102", slug: "room-102-slug", type: "Executive Suite", floor: 1, status: "OCCUPIED" },
  { roomNumber: "201", slug: "room-201-slug", type: "Ocean View Villa", floor: 2, status: "OCCUPIED" },
  { roomNumber: "301", slug: "room-301-slug", type: "Penthouse Suite", floor: 3, status: "OCCUPIED" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-canvas text-brand-dark flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-brand-border/60 bg-white/95 backdrop-blur sticky top-0 z-50 shadow-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-dark to-brand-surface flex items-center justify-center text-accent font-black text-xl shadow-sm border border-brand-surface">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl text-brand-dark">StayFix</span>
                <span className="inline-flex items-center rounded-md bg-accent-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                  Hospitality OS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-brand-border bg-white px-4 py-2 text-xs font-bold text-brand-dark hover:bg-brand-linen hover:border-brand-muted/50 transition shadow-xs"
            >
              Staff Portal
            </Link>
            <Link
              href="/report/room-101-slug"
              className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-hover transition shadow-sm"
            >
              Simulate QR Scan
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white via-brand-canvas to-brand-canvas border-b border-brand-border/40">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent border border-accent/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>Zero-Friction In-Room Issue Dispatch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.15]">
              Seamless Hotel Maintenance <br className="hidden sm:inline" />
              <span className="text-accent">&amp; Guest Resolution</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-brand-muted leading-relaxed font-normal">
              Empower hotel guests to report room issues in seconds with in-room QR codes.
              Engineering and housekeeping triage, track, and resolve tickets in real time with auto-sync status updates.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/report/room-101-slug"
                className="w-full sm:w-auto rounded-xl bg-accent px-7 py-4 text-sm font-bold text-white shadow-md hover:bg-accent-hover transition text-center flex items-center justify-center gap-2"
              >
                <span>Report Room Issue (Guest View)</span>
                <span className="text-base">&rarr;</span>
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto rounded-xl bg-brand-surface px-7 py-4 text-sm font-bold text-white shadow-md hover:bg-brand-dark transition text-center flex items-center justify-center gap-2 border border-brand-surface"
              >
                <span>Staff Kanban Board</span>
              </Link>
            </div>

            {/* Quick stats / trust strip */}
            <div className="mt-12 grid grid-cols-3 max-w-md mx-auto rounded-xl bg-white border border-brand-border/60 p-4 shadow-xs">
              <div className="text-center border-r border-brand-border/40">
                <p className="text-lg font-black text-brand-dark">&lt; 30s</p>
                <p className="text-[11px] font-semibold text-brand-muted uppercase">To Report</p>
              </div>
              <div className="text-center border-r border-brand-border/40">
                <p className="text-lg font-black text-accent">10s</p>
                <p className="text-[11px] font-semibold text-brand-muted uppercase">Live Polling</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-brand-dark">100%</p>
                <p className="text-[11px] font-semibold text-brand-muted uppercase">App-Free</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Rooms Section */}
        <section className="py-14 bg-brand-canvas">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent">Interactive Simulator</span>
                <h2 className="text-2xl font-bold text-brand-dark mt-1">Select A Hotel Room QR Code</h2>
              </div>
              <p className="text-xs text-brand-muted mt-1 sm:mt-0 max-w-xs">
                Simulate scanning a real nightstand QR code in one of the seeded hotel suites:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEMO_ROOMS.map((room) => (
                <Link
                  key={room.slug}
                  href={`/report/${room.slug}`}
                  className="group rounded-2xl bg-white p-5 shadow-xs border border-brand-border hover:border-accent hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-accent bg-accent-tint px-2 py-0.5 rounded-md border border-accent/20">
                        Floor {room.floor}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted bg-brand-linen px-2 py-0.5 rounded">
                        QR Active
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-black text-brand-dark group-hover:text-accent transition">
                        Room {room.roomNumber}
                      </p>
                      <p className="text-xs font-medium text-brand-muted mt-1">{room.type}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between text-xs font-bold text-brand-dark group-hover:text-accent transition">
                    <span>Submit Issue</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 bg-white border-t border-brand-border/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Hospitality Architecture</span>
              <h2 className="text-2xl font-bold text-brand-dark mt-1">Built For Hotel Guests &amp; Engineering Teams</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-brand-border/80 p-6 bg-brand-canvas shadow-xs">
                <div className="h-11 w-11 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
                  1
                </div>
                <h3 className="font-bold text-brand-dark text-base">In-Room QR Resolution</h3>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  Guests simply scan a desk or bedside QR code. The application instantly loads the verified room number and building details without authentication barriers.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-border/80 p-6 bg-brand-canvas shadow-xs">
                <div className="h-11 w-11 rounded-xl bg-brand-surface text-white flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
                  2
                </div>
                <h3 className="font-bold text-brand-dark text-base">Live Auto-Sync Tracker</h3>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  Guests are redirected to a private tracker with a 10-second auto-refresh polling interval, showing real-time updates and staff resolution comments.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-border/80 p-6 bg-brand-canvas shadow-xs">
                <div className="h-11 w-11 rounded-xl bg-accent-hover text-white flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
                  3
                </div>
                <h3 className="font-bold text-brand-dark text-base">Staff Kanban Dashboard</h3>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  Hotel staff manage tickets across categorized columns (Pending, In Progress, Resolved) with immediate status updates and SLA monitoring.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border/60 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-brand-muted sm:px-6 lg:px-8">
          <p className="font-semibold text-brand-dark">&copy; 2026 StayFix Hospitality Platform. All rights reserved.</p>
          <p className="mt-1 text-brand-muted/70">Next.js 14 • TypeScript • Tailwind CSS • PostgreSQL • Express TSOA</p>
        </div>
      </footer>
    </div>
  );
}
