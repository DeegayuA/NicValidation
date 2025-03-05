"use client";

    import { useState } from 'react';
    import { getGeminiResponse } from '@/lib/gemini';
    import { useToast } from '@/components/ui/use-toast-base';

    export function useAIResponse() {
      const [isLoading, setIsLoading] = useState(false);
      const [response, setResponse] = useState<string>('');
      const { toast } = useToast();

      const getResponse = async (input: string, imageBase64?: string) => {
        setIsLoading(true);
        try {
          const result = await getGeminiResponse(input, imageBase64);
          
          if (result.error) {
            toast({
              title: "Error",
              description: result.error,
              variant: "destructive"
            });
            return null;
          }

          setResponse(result.text);
          return result.text;
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get AI response. Please try again.",
            variant: "destructive"
          });
          return null;
        } finally {
          setIsLoading(false);
        }
      };

      return {
        isLoading,
        response,
        getResponse
      };
    }
