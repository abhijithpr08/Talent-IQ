import React from "react";
import { ArrowRightIcon, CheckIcon, VideoIcon, ZapIcon } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-20 min-h-[calc(100vh-80px)] flex items-center justify-center">
        {/* ONLY LEFT: copy, centered */}
        <div className="space-y-7 text-center flex flex-col items-center max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-base-100/80 px-3 py-1 text-xs font-medium text-base-content/70 shadow-sm">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10">
                <ZapIcon className="size-3 text-primary" />
              </span>
              Interview-ready in minutes
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Run better
              </span>
              <br />
              <span className="text-base-content">technical interviews, together.</span>
            </h1>

            <p className="text-lg sm:text-xl text-base-content/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Talent IQ combines live video, collaborative code, and structured problems into a
              single workspace — so you focus on signal, not setup.
            </p>

            {/* key points */}
            <div className="grid gap-4 text-sm text-base-content/80 sm:grid-cols-3">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="badge badge-outline badge-sm mb-1">
                  <CheckIcon className="size-3 text-success" />
                  <span className="ml-1">Real-time editor</span>
                </div>
                <p className="text-xs sm:text-[13px]">
                  Share a zero-setup coding environment with live cursors and language support.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="badge badge-outline badge-sm mb-1">
                  <CheckIcon className="size-3 text-success" />
                  <span className="ml-1">Built-in video</span>
                </div>
                <p className="text-xs sm:text-[13px]">
                  Keep communication and code in the same place for smoother interviews.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="badge badge-outline badge-sm mb-1">
                  <CheckIcon className="size-3 text-success" />
                  <span className="ml-1">Problem library</span>
                </div>
                <p className="text-xs sm:text-[13px]">
                  Use curated problems or bring your own for consistent candidate experience.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  Start for free
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-lg">
                <VideoIcon className="size-5" />
                Watch product walkthrough
              </button>
            </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

