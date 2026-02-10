import React from "react";
import { ArrowRightIcon, CheckIcon, VideoIcon, ZapIcon } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-20 min-h-[calc(100vh-80px)] flex justify-center items-center">
        <div className="space-y-7 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Code Together,
            </span>
            <br />
            <span className="text-base-content">Learn Together</span>
          </h1>

          <div className="badge badge-primary badge-lg gap-2 mx-auto">
            <ZapIcon className="size-4" />
            Real-time Collaboration
          </div>

          <p className="text-lg sm:text-xl text-base-content/95 leading-relaxed max-w-xl mx-auto">
            The ultimate platform for collaborative coding interviews and pair programming.
            Connect face-to-face, code in real-time, and ace your technical interviews.
          </p>

          {/* FEATURE PILLS */}
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="badge badge-lg badge-outline">
              <CheckIcon className="size-4 text-success" />
              Live Video Chat
            </div>
            <div className="badge badge-lg badge-outline">
              <CheckIcon className="size-4 text-success" />
              Code Editor
            </div>
            <div className="badge badge-lg badge-outline">
              <CheckIcon className="size-4 text-success" />
              Multi-Language
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-lg">
                Start Coding Now
                <ArrowRightIcon className="size-5" />
              </button>
            </SignInButton>

            <button className="btn btn-outline btn-lg">
              <VideoIcon className="size-5" />
              Watch Demo
            </button>
          </div>

          {/* STATS */}
          <div className="stats stats-vertical sm:stats-horizontal bg-base-100 shadow-md mx-auto">
            <div className="stat">
              <div className="stat-value text-primary">10K+</div>
              <div className="stat-title">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-value text-secondary">50K+</div>
              <div className="stat-title">Sessions</div>
            </div>
            <div className="stat">
              <div className="stat-value text-accent">99.9%</div>
              <div className="stat-title">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

