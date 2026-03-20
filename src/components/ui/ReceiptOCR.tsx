"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createWorker } from "tesseract.js";
import { Loader2, Upload, Scan, X } from "lucide-react";

export interface ExtractedReceiptData {
  title?: string;
  amount?: number;
  date?: string;
  rawText?: string;
}

interface ReceiptOCRProps {
  onExtract: (data: ExtractedReceiptData) => void;
  initialImage?: string;
}

export function ReceiptOCR({ onExtract, initialImage }: ReceiptOCRProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setExtractedText("");
      };
      reader.readAsDataURL(file);
    }
  };

  const parseReceiptText = useCallback((text: string): ExtractedReceiptData => {
    const result: ExtractedReceiptData = { rawText: text };

    // Parse amount - look for Total, TOTAL, or currency patterns
    const amountPatterns = [
      /Total[:\s]*\$?\s*(\d+\.?\d*)/i,
      /TOTAL[:\s]*\$?\s*(\d+\.?\d*)/i,
      /Amount[:\s]*\$?\s*(\d+\.?\d*)/i,
      /\$(\d+\.\d{2})/g,
      /(\d+\.\d{2})/g,
    ];

    for (const pattern of amountPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        // Find the largest amount (likely the total)
        const amounts = matches
          .map((m) => parseFloat(m.replace(/[^\d.]/g, "")))
          .filter((n) => !isNaN(n) && n > 0);
        if (amounts.length > 0) {
          result.amount = Math.max(...amounts);
          break;
        }
      }
    }

    // Parse date - various formats
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}/i,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const parsed = new Date(match[0]);
          if (!isNaN(parsed.getTime())) {
            result.date = parsed.toISOString().split("T")[0];
            break;
          }
        } catch {
          // continue
        }
      }
    }

    // Parse title - first meaningful line (merchant name)
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 3);
    if (lines.length > 0) {
      // Skip lines that are just numbers or dates
      const firstNonNumeric = lines.find(
        (l) => !/^[\d\s\/\-\.]+$/.test(l) && l.length > 3
      );
      if (firstNonNumeric) {
        result.title = firstNonNumeric.substring(0, 100);
      }
    }

    return result;
  }, []);

  const handleExtract = async () => {
    if (!image) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const {
        data: { text },
      } = await worker.recognize(image);

      await worker.terminate();

      setExtractedText(text);
      const parsed = parseReceiptText(text);
      onExtract(parsed);
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setExtractedText("");
    setProgress(0);
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button type="button" variant="outline" className="w-full" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload Receipt Image
              </span>
            </Button>
          </label>
          {image && (
            <Button type="button" variant="ghost" size="icon" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {image && (
          <div className="space-y-3">
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Receipt preview"
                className="max-h-48 w-full object-contain bg-muted"
              />
            </div>

            <Button
              type="button"
              onClick={handleExtract}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning... {progress}%
                </>
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  Extract Data with OCR
                </>
              )}
            </Button>

            {extractedText && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Extracted Text:</p>
                <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-auto whitespace-pre-wrap">
                  {extractedText}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
