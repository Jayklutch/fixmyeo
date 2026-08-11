import React, { useMemo, useRef, useState, useEffect } from "react";
import { Sun, CloudSun } from "lucide-react";
import { buildUrl } from './utils/funcs';

export default function StatusPanel(
  {status}
) {
  const [error, setError] = useState(null);


  function FriendlyState(status) {
    let state=status.eo_charger_state;
    /* Convert the state into a user-friendly message, that summarises roughly
    what is going on. */
    if (state == 'car-connected') {
      if (status.eo_amps_requested == 0) {
        state = 'charge-suspended';
      }
    } else if (state == 'charge-complete') {
      /* The EO controller reports the charge is complete after any session is 
      stopped by the vehicle, but realistically this is wrong.  We have no idea 
      why the car stopped charging.  Correct this to 'car-connected' if we are
      requesting current and 'charge-suspended' if we aren't.  If we are requesting
      current then the EVSE is ready to charge, but the car -isn't- for whatever 
      reason.   Could be a full battery, could be a schedule, could be a fault, 
      could be Octopii interference;  we have no idea, and neither does EO! */
      if (status.eo_amps_requested > 0) {
        state = 'car-connected';
      } else {
        state = 'charge-suspended';
      }
    }
    
    if (state == 'idle' || state == 'plug-present' ) {
      state = "Idle"; 
    } else if (state == 'car-connected') {
      state = "Connected";
    } else if (state == 'mains-fault') {
      state = "Error";
    } else if (state == 'charging' && status.eo_amps_requested > 0) {
      state = "Charging";
    } else if (state == 'charging' || state == 'charge-complete' || state == 'charge-suspended' || state== 'charge-paused') {
      state = "Paused";
    } else if (state == 'charge-simulated'){
      state = "Simulated";
    } else {
      state = "Unknown";
    }
    return state;
  }

  return (
    <>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!status ? ( <p className="eo-mono" style={{ color: "var(--eo-text-dim)" }}>Loading…</p> ) : (

      <>
        <div
          className="status-info flex justify-center items-center flex-wrap"
          style={{
            background: "var(--eo-panel)",
            border: "1px solid var(--eo-border)",
            borderRadius: "12px",
            padding: "10px 18px",
          }}
        >
          {!status.eo_connected_to_controller ? (
            <span className="status-item eo-mono" style={{ color: "var(--eo-text-dim)" }}>Waiting…</span>
          ) : (
            <span
              className="status-item flex items-center gap-1.5"
              style={{
                color: FriendlyState(status) === "Charging" ? "var(--eo-vehicle)" : "var(--eo-text)",
                fontWeight: 600,
              }}
            >
              {FriendlyState(status)}
              <div className="relative group inline-block">
              {status.eo_solar_active == true && status.eo_solar_charge_current > 0 && (<Sun size={16} style={{ color: "var(--eo-solar)" }} className="cursor-help" />)}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                   w-max max-w-xs bg-gray-800 text-white text-xs rounded px-2 py-1
                   opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Solar charging active
                </span>
              </div>

              <div className="relative group inline-block">
              {status.eo_solar_active == true && status.eo_solar_charge_current == 0 && (<CloudSun size={16} style={{ color: "var(--eo-solar)" }} className="cursor-help" />)}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                   w-max max-w-xs bg-gray-800 text-white text-xs rounded px-2 py-1
                   opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Solar Charging enabled, but generated output not sufficient - check charging statistics page.
                </span>
              </div>
            </span>
          )}

          <span className="status-item eo-mono" style={{ color: "var(--eo-text)" }}>{Math.round(status.eo_current_vehicle)}/{Math.round(status.eo_amps_requested)}A</span>
          <span className="status-item eo-mono" style={{ color: "var(--eo-text)" }}>{Math.round(status.eo_live_voltage)}V</span>
          <span className="status-item eo-mono" style={{ color: "var(--eo-text)" }}>{Number(Math.round(10*status.eo_power_delivered)/10).toFixed(1)}kW</span>
          <span className="status-item eo-mono" style={{ color: "var(--eo-text)" }}>{Number(Math.round(10*status.eo_session_kwh)/10).toFixed(1)}kWh</span>
          <span className="status-item eo-mono" style={{ color: "var(--eo-text-dim)" }}>{status.eo_localtime}</span>
        </div>
        <div id="version-info" className="version-info eo-mono" style={{ color: "var(--eo-text-dim)", fontSize: "11px", marginTop: "6px" }}>
          {status.openeo_latest_version === undefined || status.app_version === status.openeo_latest_version ? (
            <span id="statusVersion">openeo {status.app_version}</span>
          ) : (
            <span id="statusVersion" style={{color: "var(--eo-danger)", cursor: "pointer"}} onClick={() => (window.location.href="update.html")}>openeo {status.app_version} (Update Available)</span>
          )}
        </div>
      </>
    )}
  </>
  );
}