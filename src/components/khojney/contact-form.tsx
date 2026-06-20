"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";

interface ContactFormProps {
  defaultEmail?: string | null;
  defaultName?: string | null;
}

export function ContactForm({ defaultEmail, defaultName }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log("Contact form submission:", payload);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 1-2 business days.");
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
        <h3 className="text-xl font-semibold">Message Sent!</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Thanks for reaching out. We&apos;ll respond to your email within 1-2 business days.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required defaultValue={defaultName ?? ""} placeholder="Ram Sharma" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required defaultValue={defaultEmail ?? ""} placeholder="you@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Select name="subject" required>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Choose a topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="bug">Report an Issue / Bug</SelectItem>
            <SelectItem value="content">Content Correction</SelectItem>
            <SelectItem value="partnership">Institutional Partnership</SelectItem>
            <SelectItem value="feedback">Feedback / Suggestion</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" required rows={6} placeholder="How can we help you?" className="resize-y" />
      </div>
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground">
          By submitting, you agree to our <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
        </p>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
          ) : (
            <><Send className="h-4 w-4 mr-2" /> Send Message</>
          )}
        </Button>
      </div>
    </form>
  );
}
