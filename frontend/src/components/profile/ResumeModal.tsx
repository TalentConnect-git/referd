"use client";

import { ExternalLink, Loader2, X, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ResumeModalProps {
  resumeUrl: string;
  onClose: () => void;
}

export default function ResumeModal({ resumeUrl, onClose }: ResumeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const handleDownload = async (): Promise<void> => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Extract filename from URL or use default
      const filename = resumeUrl.split("/").pop() || "resume.pdf";
      link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab if download fails
      window.open(resumeUrl, "_blank");
    }
  };

  useEffect(() => {
    if (!resumeUrl || !canvasRef.current) return;

    let isCancelled = false;

    const renderPdf = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const pdfjsLib = await import("pdfjs-dist");

        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const response = await fetch(resumeUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch PDF file");
        }

        const arrayBuffer = await response.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({
          scale: 1.5,
        });

        const canvas = canvasRef.current;

        if (!canvas || isCancelled) return;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas context not found");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;

        if (!isCancelled) {
          setLoading(false);
        }
      } catch (err) {
        console.error("PDF render failed:", err);

        if (!isCancelled) {
          setError("PDF preview failed. Please download the resume.");
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
    };
  }, [resumeUrl]);

  if (!resumeUrl) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-white">
              Resume Preview
            </h2>
            <p className="text-[12px] text-[var(--text-primary)]">
              Resume loaded from PDF file
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 p-2 text-white transition hover:bg-white/10"
              aria-label="Close resume preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-auto bg-black/40 p-4">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-xl bg-black/80 px-4 py-3 text-sm font-semibold text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading PDF...
              </div>
            </div>
          )}

          {error ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="mb-4 text-sm font-semibold text-red-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-full justify-center">
              <canvas
                ref={canvasRef}
                className="h-fit max-w-full rounded-lg bg-white shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}