import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Result = { error?: string; [key: string]: any };

interface Props {
  result: Result | null;
  resultProblem: number | null;
}

const ResultDisplay: React.FC<Props> = ({ result, resultProblem }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!result) return null;

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  const renderContent = () => {
    switch (resultProblem) {
      case 1:
        return (
          <p>
            The number{" "}
            <span className="font-mono">{String(result.pattern_number)}</span>{" "}
            is prime.
          </p>
        );
      case 2:
        return (
          <ul className="list-disc list-inside">
            {result.map((r: any) => (
              <li key={r.N}>
                N={r.N}: <span className="font-mono">{String(r.repunit)}</span>
              </li>
            ))}
          </ul>
        );
      case 3:
        return (
          <ul className="list-disc list-inside">
            {result.map((r: any) => (
              <li key={r.p}>
                p={r.p}:{" "}
                <span className="font-mono">{String(r.mersenne_prime)}</span>
              </li>
            ))}
          </ul>
        );
      case 4:
        return (
          <p>
            Found {result.primes_found.length} primes between{" "}
            {String(result.interval[0])} and {String(result.interval[1])}:
            <div className="flex flex-wrap gap-2 mt-2">
              {result.primes_found.map((p: number | string) => (
                <span
                  key={String(p)}
                  className="font-mono bg-gray-200 px-2 py-1 rounded"
                >
                  {String(p)}
                </span>
              ))}
            </div>
          </p>
        );
      case 5:
        return (
          <p>
            Found a palindromic prime with {result.digits} digits:
            <p className="font-mono bg-gray-200 px-2 py-1 rounded mt-2">
              {String(result.palindromic_prime)}
            </p>
          </p>
        );
      case 6:
        return (
          <div>
            <p>
              For p={result.p}, the perfect number is{" "}
              <span className="font-mono">{String(result.perfect_number)}</span>
              .
            </p>
            <div className="mt-4">
              <Document
                file={result.pdf_path}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Loading PDF..."
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </div>
          </div>
        );
      case 7:
        return (
          <p>
            The even number {result.n} can be expressed as the sum of two
            primes: {String(result.pair[0])} + {String(result.pair[1])}.
          </p>
        );
      default:
        return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <Alert>
      <AlertTitle>Result for Problem {resultProblem}</AlertTitle>
      <AlertDescription asChild>{renderContent()}</AlertDescription>
    </Alert>
  );
};

export default ResultDisplay;
