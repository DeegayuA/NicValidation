"use client";

    import { Button } from '@/components/ui/button';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
    } from '@/components/ui/dialog';
    import { Check, Camera, Mic, MessageSquare } from 'lucide-react';
    import { useSettings } from '@/components/settings-provider';
    import { cn } from '@/lib/utils';

    interface OnboardingDialogProps {
      onComplete: () => void;
    }

    export function OnboardingDialog({ onComplete }: OnboardingDialogProps) {
      const { fontSize, accentColor } = useSettings();
      return (
        <Dialog open onOpenChange={onComplete}>
          <DialogContent className="sm:max-w-[425px]" style={{ fontSize: `${fontSize / 16}rem` }}>
            <DialogHeader>
              <DialogTitle>Welcome to Lifesight</DialogTitle>
              <DialogDescription>
                Let's get you started with using our AI-powered assistant.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="flex items-start space-x-3">
                <Camera className="w-5 h-5 mt-0.5" style={{ color: accentColor }} />
                <div>
                  <h3 className="font-medium">Camera Access</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll use your camera to help understand your surroundings
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mic className="w-5 h-5 mt-0.5" style={{ color: accentColor }} />
                <div>
                  <h3 className="font-medium">Voice Commands</h3>
                  <p className="text-sm text-muted-foreground">
                    Speak naturally to interact with the assistant
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 mt-0.5" style={{ color: accentColor }} />
                <div>
                  <h3 className="font-medium">Text Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Type your questions if you prefer text communication
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onComplete} className="w-full" style={{ backgroundColor: accentColor }}>
                <Check className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
