import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface Quote {
  text: string;
  author: string;
}

export function MotivationalQuoteCard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: quote, isLoading } = useQuery<Quote>({
    queryKey: ["/api/quotes/daily", refreshKey],
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="relative mx-auto max-w-5xl p-8 md:p-12 rounded-2xl shadow-md">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleRefresh}
          disabled={isLoading}
          data-testid="button-refresh-quote"
          className="absolute right-4 top-4 h-8 w-8"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>

        {isLoading ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ) : quote ? (
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 text-center"
          >
            <p 
              className="font-accent text-lg italic leading-relaxed text-foreground md:text-xl"
              data-testid="text-quote"
            >
              "{quote.text}"
            </p>
            <p 
              className="font-accent text-right text-sm text-muted-foreground"
              data-testid="text-quote-author"
            >
              — {quote.author}
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground" data-testid="text-quote-error">
            No quote available
          </p>
        )}
      </Card>
    </motion.div>
  );
}
