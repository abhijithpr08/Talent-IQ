import React from "react";
import { Code2Icon, UsersIcon, VideoIcon } from "lucide-react";

function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          Everything You Need to <span className="text-primary font-mono">Succeed</span>
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Powerful features designed to make your coding interviews seamless and productive
        </p>
      </div>

      {/* FEATURES GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <VideoIcon className="size-8 text-primary" />
            </div>
            <h3 className="card-title">HD Video Call</h3>
            <p className="text-base-content/70">
              Crystal clear video and audio for seamless communication during interviews
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Code2Icon className="size-8 text-primary" />
            </div>
            <h3 className="card-title">Live Code Editor</h3>
            <p className="text-base-content/70">
              Collaborate in real-time with syntax highlighting and multiple language support
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <UsersIcon className="size-8 text-primary" />
            </div>
            <h3 className="card-title">Easy Collaboration</h3>
            <p className="text-base-content/70">
              Share your screen, discuss solutions, and learn from each other in real-time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

