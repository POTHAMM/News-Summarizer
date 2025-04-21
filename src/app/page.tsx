"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { summarizeArticle } from "@/ai/flows/summarize-article";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      const result = await summarizeArticle({ url });
      setSummary(result.summary);
    } catch (error: any) {
      console.error("Error summarizing article:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to summarize article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast({
      description: "Summary copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">NewsDigest</h1>
      <div className="flex flex-col space-y-2">
        <Input
          type="url"
          placeholder="Enter URL of news article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <>
              Summarizing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Summarize"
          )}
        </Button>
        {summary && (
          <div className="relative">
            <Textarea
              readOnly
              value={summary}
              className="bg-muted text-foreground"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
