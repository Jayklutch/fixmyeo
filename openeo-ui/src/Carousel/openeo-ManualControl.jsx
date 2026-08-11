import React, { useMemo, useRef, useState, useEffect } from "react";
import AmpSlider from "./openeo-AmpSlider";
import Toggle from "./openeo-Toggle";
import HelpModal from "../openeo-HelpModal";

export default function ManualControl({ schedule, onChange, onCommit,setTimersActive,active }) {

  return (
<div className="flex flex-col items-center p-5 gap-3 w-fit justify-center">


  <HelpModal title="Manual Control">
    <p>Manual Control lets you directly manage EV charging behaviour.</p>
    <p><b>Timers Enabled/Disabled</b> allows or prevents scheduled charging periods to run automatically.</p>
    <p><b>Charging Enabled/Disabled</b> When set to "Enabled", this will immediately enable charging, regardless of any timed schedules defined.</p>
    <p>Use the <b>amp slider</b> to control the maximum charging current when manually charging.</p>
  </HelpModal>
  <div className="absolute top-0 left-0 right-0 flex justify-center mt-5 unselectable">
    <span className="eo-eyebrow">
      <span className={`eo-eyebrow-dot ${schedule.enabled ? "is-live" : "is-idle"}`} />
      Manual Control
    </span>
  </div>

  <Toggle
    enabled={schedule.scheduler_enabled}
    onChange={(v) => {
      if(active) {
        schedule.scheduler_enabled=v;
        onChange({ ...schedule, scheduler_enabled: v });
        setTimersActive(v)
        onCommit();
      }
    }}
  />
  <div className="eo-mono text-sm mb-2" style={{ color: "var(--eo-text-dim)" }}>
    Timers <span style={{ color: schedule.scheduler_enabled ? "var(--eo-accent)" : "var(--eo-text-dim)" }}>{schedule.scheduler_enabled ? "Enabled" : "Disabled"}</span>
  </div>
  
  <Toggle
    enabled={schedule.enabled}
    onChange={(v) => {
      if(active) {
        schedule.enabled=v;
        onChange({ ...schedule, enabled: v });
        onCommit();
      }
    }}
  />

  <div className="eo-mono text-sm mb-3" style={{ color: "var(--eo-text-dim)" }}>
    Charging <span style={{ color: schedule.enabled ? "var(--eo-vehicle)" : "var(--eo-text-dim)" }}>{schedule.enabled ? "Enabled" : "Disabled"}</span>
  </div>

     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] mb-[5px]">
    <AmpSlider
      value={schedule.amps}
      min={6}
      max={32}
      onChange={(v) => { active &&  onChange({ ...schedule, amps: v })} }
      onCommit={active && onCommit}
      active={active}
    />
  </div>
</div>

  );
}
