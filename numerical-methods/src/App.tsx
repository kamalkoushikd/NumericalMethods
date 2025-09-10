import React, { useState } from "react";

// Modern Prime Problems UI
// - Tailwind CSS assumed
// - Uses lucide-react for icons (install with `npm i lucide-react`)
// - Replaces raw JSON with formatted result cards, copy buttons and badges

import {
  Zap,
  Search,
  CheckCircle,
  XCircle,
  Copy,
  RefreshCw,
  List,
  Eye,
} from "lucide-react";
import ResultDisplay from "./ResultDisplay";

type Result = { error?: string; [key: string]: any } | null;

async function callAPI(endpoint: string, payload: object): Promise<Result> {
  try {
    const res = await fetch(`http://localhost:8000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      return { error: `HTTP ${res.status}: ${txt || res.statusText}` };
    }

    const json = await res.json();
    return json as Result;
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

/* --- Small UI primitives --- */
const Card: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => (
  <input
    {...props}
    className={`w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 ${props.className || ""}`}
  />
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={`inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-sm disabled:opacity-60 ${props.className || ""}`}
  >
    {children}
  </button>
);

const Badge: React.FC<{ children?: React.ReactNode; success?: boolean }> = ({
  children,
  success,
}) => (
  <span
    className={`inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded ${
      success ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"
    }`}
  >
    {children}
  </span>
);

/* --- Helpers --- */
function shortNumberDisplay(n: string | number, max = 24) {
  const s = String(n);
  if (s.length <= max) return s;
  return (
    s.slice(0, Math.max(8, Math.floor(max / 2))) +
    " … " +
    s.slice(-Math.floor(max / 2))
  );
}

async function copyToClipboard(txt: string) {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch {
    return false;
  }
}

/* --- Formatted result components --- */
const PrimeStatus: React.FC<{ isPrime?: boolean | null }> = ({ isPrime }) => {
  if (isPrime === true)
    return (
      <Badge success>
        <CheckCircle className="w-4 h-4" /> Prime
      </Badge>
    );
  if (isPrime === false)
    return (
      <Badge>
        <XCircle className="w-4 h-4" /> Composite
      </Badge>
    );
  return (
    <Badge>
      <List className="w-4 h-4" /> Unknown
    </Badge>
  );
};

const LargeNumberRow: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => {
  const s = value === undefined || value === null ? "—" : String(value);
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-xs text-slate-700 flex items-center gap-2">
        <code className="font-mono text-sm bg-slate-50 px-2 py-1 rounded">
          {shortNumberDisplay(s, 40)}
        </code>
        <button
          className="text-slate-400 hover:text-slate-700 p-1 rounded"
          onClick={async () => {
            await copyToClipboard(s);
            // tiny visual feedback could be added
          }}
          title="Copy full value"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* --- Problems UI --- */
const Problem1: React.FC = () => {
  const [n, setN] = useState<number>(10);
  const [maxN, setMaxN] = useState<number>(3000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-sky-600" />
          <div>
            <div className="font-semibold">Pattern Prime Finder</div>
            <div className="text-xs text-slate-500">
              Find a prime of pattern 123...n...321 in a range
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-2"
            onClick={() => {
              setN(10);
              setMaxN(3000);
              setResult(null);
            }}
            title="Reset"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Start n</div>
          <Input
            type="number"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Max n</div>
          <Input
            type="number"
            value={maxN}
            onChange={(e) => setMaxN(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={async () => {
              setLoading(true);
              setResult(null);
              const res = await callAPI("problem1", { n, max_n: maxN });
              setResult(res);
              setLoading(false);
            }}
            disabled={loading}
          >
            <Search className="w-4 h-4" /> {loading ? "Searching…" : "Find"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-4 space-y-3">
          {result.error ? (
            <div className="text-rose-700 text-sm">{result.error}</div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600">n</div>
                  <div className="font-medium text-slate-800">
                    {result.n ?? "—"}
                  </div>
                </div>
                <PrimeStatus isPrime={result.is_prime} />
              </div>

              <LargeNumberRow
                label="Pattern number"
                value={result.pattern_number ?? "—"}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const Problem2: React.FC = () => {
  const [limit, setLimit] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <List className="w-6 h-6 text-sky-600" />
          <div>
            <div className="font-semibold">Repunit Primes</div>
            <div className="text-xs text-slate-500">
              Check prime repunits for prime N up to limit
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4 items-end">
        <div className="w-36">
          <div className="text-xs text-slate-500 mb-1">Limit</div>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>

        <Button
          onClick={async () => {
            setLoading(true);
            setResult(null);
            const res = await callAPI("problem2", { limit });
            setResult(res);
            setLoading(false);
          }}
        >
          <Search className="w-4 h-4" /> {loading ? "Checking…" : "Run"}
        </Button>
      </div>

      {result && (
        <div className="space-y-2">
          {result.error ? (
            <div className="text-rose-700 text-sm">{result.error}</div>
          ) : (
            <div className="grid gap-2">
              {Array.isArray(result) && result.length === 0 && (
                <div className="text-sm text-slate-600">
                  No repunit primes found in range.
                </div>
              )}
              {Array.isArray(result) &&
                result.map((r: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded"
                  >
                    <div>
                      <div className="text-xs text-slate-500">N</div>
                      <div className="font-medium">{r.N}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-slate-500">length</div>
                      <div className="font-mono text-sm">
                        {String(r.repunit).length}
                      </div>
                      <button
                        onClick={() => copyToClipboard(String(r.repunit))}
                        className="p-1 text-slate-500 hover:text-slate-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const Problem3: React.FC = () => {
  const [start, setStart] = useState<number>(2201);
  const [end, setEnd] = useState<number>(2299);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-sky-600" />
          <div>
            <div className="font-semibold">Mersenne Primes</div>
            <div className="text-xs text-slate-500">
              Find 2^p - 1 primes for p in range
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Start</div>
          <Input
            type="number"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">End</div>
          <Input
            type="number"
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={async () => {
              setLoading(true);
              setResult(null);
              const res = await callAPI("problem3", { start, end });
              setResult(res);
              setLoading(false);
            }}
          >
            <Search className="w-4 h-4" /> {loading ? "Searching…" : "Find"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          {result.error ? (
            <div className="text-rose-700 text-sm">{result.error}</div>
          ) : (
            <div className="grid gap-2">
              {Array.isArray(result) && result.length === 0 && (
                <div className="text-sm text-slate-600">
                  No Mersenne primes found in range.
                </div>
              )}
              {Array.isArray(result) &&
                result.map((r: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-slate-500">p</div>
                      <div className="font-medium">{r.p}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-slate-500">value</div>
                      <div className="font-mono text-sm">
                        {shortNumberDisplay(String(r.mersenne_prime), 40)}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(String(r.mersenne_prime))
                        }
                        className="p-1 text-slate-500 hover:text-slate-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const Problem4: React.FC = () => {
  const [p1, setP1] = useState<number>(3);
  const [p2, setP2] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-sky-600" />
        <div>
          <div className="font-semibold">Primes between squares</div>
          <div className="text-xs text-slate-500">
            Find at least 4 primes between p1^2 and p2^2
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">p1</div>
          <Input
            type="number"
            value={p1}
            onChange={(e) => setP1(Number(e.target.value))}
          />
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">p2</div>
          <Input
            type="number"
            value={p2}
            onChange={(e) => setP2(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={async () => {
              setLoading(true);
              setResult(null);
              const res = await callAPI("problem4", { p1, p2 });
              setResult(res);
              setLoading(false);
            }}
          >
            <Search className="w-4 h-4" /> {loading ? "Searching…" : "Find"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          {result.error ? (
            <div className="text-rose-700">{result.error}</div>
          ) : (
            <div className="bg-slate-50 p-3 rounded">
              <div className="text-xs text-slate-500">Interval</div>
              <div className="font-medium mb-2">
                {result.interval
                  ? `${result.interval[0]} — ${result.interval[1]}`
                  : "—"}
              </div>

              <div className="text-xs text-slate-500">Primes found</div>
              <div className="flex gap-2 flex-wrap mt-2">
                {Array.isArray(result.primes_found) &&
                result.primes_found.length > 0 ? (
                  result.primes_found.map((p: number, i: number) => (
                    <div
                      key={i}
                      className="bg-white border px-2 py-1 rounded text-sm font-mono"
                    >
                      {p}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-600">No primes found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const Problem5: React.FC = () => {
  const [limitDigits, setLimitDigits] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Eye className="w-6 h-6 text-sky-600" />
        <div>
          <div className="font-semibold">Palindromic Prime</div>
          <div className="text-xs text-slate-500">
            Search for a palindromic prime with at least N digits
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-end mb-4">
        <div className="w-48">
          <div className="text-xs text-slate-500 mb-1">Minimum digits</div>
          <Input
            type="number"
            value={limitDigits}
            onChange={(e) => setLimitDigits(Number(e.target.value))}
          />
        </div>
        <Button
          onClick={async () => {
            setLoading(true);
            setResult(null);
            const res = await callAPI("problem5", {
              limit_digits: limitDigits,
            });
            setResult(res);
            setLoading(false);
          }}
        >
          <Search className="w-4 h-4" /> {loading ? "Searching…" : "Find"}
        </Button>
      </div>

      {result && (
        <div>
          {result.error ? (
            <div className="text-rose-700">{result.error}</div>
          ) : (
            <div className="bg-slate-50 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs text-slate-500">Digits</div>
                  <div className="font-medium">{result.digits ?? "—"}</div>
                </div>
                <PrimeStatus isPrime={true} />
              </div>

              <LargeNumberRow
                label="Palindromic prime"
                value={result.palindromic_prime ?? "—"}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};


const Problem6: React.FC = () => {
  const pdfPath = "problem6.pdf"; // ✅ replace with your actual path

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-sky-600" />
        <div>
          <div className="font-semibold">Problem 6 (PDF)</div>
          <div className="text-xs text-slate-500">
            Embedded PDF viewer
          </div>
        </div>
      </div>

      <div className="w-full h-[600px] border rounded-lg overflow-hidden">
        <iframe
          src={pdfPath}
          className="w-full h-full"
          title="Problem 6 PDF"
        />
      </div>
    </Card>
  );
};


const Problem7: React.FC = () => {
  const [evenN, setEvenN] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-sky-600" />
        <div>
          <div className="font-semibold">Goldbach Pair</div>
          <div className="text-xs text-slate-500">
            Find two primes that sum to an even number
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-end mb-4">
        <div className="w-40">
          <div className="text-xs text-slate-500 mb-1">Even n</div>
          <Input
            type="number"
            value={evenN}
            onChange={(e) => setEvenN(Number(e.target.value))}
          />
        </div>
        <Button
          onClick={async () => {
            setLoading(true);
            setResult(null);
            const res = await callAPI("problem7", { even_n: evenN });
            setResult(res);
            setLoading(false);
          }}
        >
          <Search className="w-4 h-4" /> {loading ? "Searching…" : "Find"}
        </Button>
      </div>

      {result && (
        <div>
          {result.error ? (
            <div className="text-rose-700">{result.error}</div>
          ) : (
            <div className="bg-slate-50 p-4 rounded">
              <div className="text-xs text-slate-500">n</div>
              <div className="font-medium mb-3">{result.n}</div>

              <div className="text-xs text-slate-500">Pair</div>
              <div className="flex gap-2 mt-2">
                {result.pair ? (
                  <>
                    <div className="bg-white border px-3 py-1 rounded font-mono">
                      {result.pair[0]}
                    </div>
                    <div className="text-slate-500">+</div>
                    <div className="bg-white border px-3 py-1 rounded font-mono">
                      {result.pair[1]}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-600">No pair found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default function App() {
  const tabs = [
    { id: "p1", label: "P1", title: "Pattern" },
    { id: "p2", label: "P2", title: "Repunits" },
    { id: "p3", label: "P3", title: "Mersenne" },
    { id: "p4", label: "P4", title: "Between squares" },
    { id: "p5", label: "P5", title: "Palindrome" },
    { id: "p6", label: "P6", title: "Custom" },
    { id: "p7", label: "P7", title: "Goldbach" },
  ];

  const [active, setActive] = useState<string>(tabs[0].id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800">
            Prime Problems — Modern UI
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Improved visual output, icons and copy-friendly results.
          </p>
        </header>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center gap-4 mb-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${active === t.id ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {t.label}
              </button>
            ))}
            <div className="ml-auto text-xs text-slate-400">
              Server: <span className="font-mono">http://localhost:8000</span>
            </div>
          </div>

          <div>
            {active === "p1" && <Problem1 />}
            {active === "p2" && <Problem2 />}
            {active === "p3" && <Problem3 />}
            {active === "p4" && <Problem4 />}
            {active === "p5" && <Problem5 />}
            {active === "p6" && <Problem6 />}
            {active === "p7" && <Problem7 />}
          </div>
        </div>

        <footer className="mt-6 text-xs text-slate-400">
          Tip: install <code className="font-mono">lucide-react</code> and
          ensure Tailwind is configured.
        </footer>
      </div>
    </div>
  );
}
