"use client";

import { useState } from "react";
import type { Availability, LaunchHints } from "@/lib/types";
import { ResourceBadge } from "@/components/ResourceBadge";

export function LabLauncher({
  title,
  launch,
  offlineOk,
  availability = "local",
  localExists = true,
}: {
  title: string;
  launch: LaunchHints;
  offlineOk: boolean;
  availability?: Availability;
  localExists?: boolean;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const cdCommand = `cd ${launch.cwd_hint.includes(" ") ? `"${launch.cwd_hint}"` : launch.cwd_hint}`;
  const reqHint = launch.requirements_path
    ? launch.requirements_path.includes(" ")
      ? `"${launch.requirements_path}"`
      : launch.requirements_path
    : null;

  return (
    <section className="lab-launcher" aria-label="Open lab">
      <h2>Open lab</h2>
      <p className="lab-launcher-lead">
        Run these commands in your terminal from the repository root. This is
        not an in-browser IDE.
      </p>

      <div className="module-meta" style={{ marginBottom: "0.75rem" }}>
        <ResourceBadge availability={availability} offlineOk={offlineOk} />
        {launch.entry_file && (
          <span className="badge">Entry: {launch.entry_file}</span>
        )}
      </div>

      {!localExists && (
        <p className="resolve-error" role="status">
          Lab files missing in this checkout—re-vendor the fork or pick another
          practice project.
        </p>
      )}

      <div className="sr-live" aria-live="polite" aria-atomic="true">
        {copied ? "Copied to clipboard" : ""}
      </div>

      <div className="launch-block">
        <div className="launch-block-head">
          <span>Working directory</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => copy(cdCommand, "cwd")}
            aria-label="Copy working directory command"
          >
            {copied === "cwd" ? "Copied" : "Copy"}
          </button>
        </div>
        <pre>
          <code>{cdCommand}</code>
        </pre>
        <p className="launch-path-hint" title={launch.cwd_hint}>
          Path detail (internal): <code>{launch.cwd_hint}</code>
        </p>
      </div>

      {reqHint && (
        <div className="launch-block">
          <div className="launch-block-head">
            <span>Requirements file</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                copy(`pip install -r ${reqHint}`, "req")
              }
              aria-label="Copy pip install requirements command"
            >
              {copied === "req" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre>
            <code>{`pip install -r ${reqHint}`}</code>
          </pre>
          <p className="launch-path-hint">
            Path detail (internal): <code>{launch.requirements_path}</code>
          </p>
        </div>
      )}

      {launch.commands.length > 0 && (
        <div className="launch-block">
          <div className="launch-block-head">
            <span>Suggested commands</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                copy([cdCommand, ...launch.commands].join("\n"), "cmds")
              }
              aria-label="Copy all suggested lab commands"
            >
              {copied === "cmds" ? "Copied" : "Copy all"}
            </button>
          </div>
          <ol className="launch-commands">
            {launch.commands.map((cmd) => (
              <li key={cmd}>
                <div className="launch-cmd-row">
                  <pre>
                    <code>{cmd}</code>
                  </pre>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => copy(cmd, cmd)}
                    aria-label={`Copy command: ${cmd}`}
                  >
                    {copied === cmd ? "Copied" : "Copy"}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {launch.notes && <p className="launch-notes">{launch.notes}</p>}

      <p className="launch-title-quiet">{title}</p>
    </section>
  );
}
