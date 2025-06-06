import React, { useState } from "react";
import "./LocalLinkHubContainer.css";

/**
 * LIGHT THEME: Restores the simple LocalLink Hub dashboard with a green & yellow palette,
 * a horizontal tab navigation for Skill Exchange, Resources, Fund, and Crisis Support.
 * Removes the premium, map-centric, dark layout, and any gold/trust visual emphasis.
 */

const TABS = [
  { key: "exchange", label: "Skill Exchange", emoji: "🤝", Component: SkillBarteringTab },
  { key: "resources", label: "Resource Listings", emoji: "📦", Component: ResourceListingTab },
  { key: "fund", label: "Community Fund", emoji: "💸", Component: CommunityFundTab },
  { key: "crisis", label: "Crisis Support", emoji: "🚨", Component: CrisisSupportTab }
];

// PUBLIC_INTERFACE
function LocalLinkHubContainer() {
  const [currentTab, setCurrentTab] = useState(TABS[0].key);
  const CurrentTabComponent = TABS.find(tab => tab.key === currentTab)?.Component;

  return (
    <div className="llh-container">
      {/* Simple Navbar */}
      <header className="llh-navbar">
        <span className="llh-logo"><span className="llh-logo-symbol">*</span> LocalLink Hub</span>
        <span className="llh-navbar-verified">Verified Community</span>
      </header>

      {/* Tab Navigation */}
      <nav className="llh-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`llh-tab${currentTab === tab.key ? " selected" : ""}`}
            onClick={() => setCurrentTab(tab.key)}
            aria-label={tab.label}
          >
            <span>{tab.emoji}</span> <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="llh-main">
        <section className="llh-tab-panel">
          <CurrentTabComponent />
        </section>
        <aside className="llh-profile">
          <ProfileCard
            name="Jessie A."
            badge="Hillcrest Micro-Community"
          />
          <ProfileStats />
        </aside>
      </main>
    </div>
  );
}

// --- Tab Panels ---
function SkillBarteringTab() {
  return (
    <div className="llh-card">
      <h2>Skill Exchange Board</h2>
      <ul>
        <li>
          <b>Offer:</b> Guitar Lessons – <span className="llh-accent">Seeking:</span> Childcare
        </li>
        <li>
          <b>Request:</b> Bike Repair – <span className="llh-secondary">Offering:</span> Home-cooked Meal
        </li>
      </ul>
    </div>
  );
}

function ResourceListingTab() {
  return (
    <div className="llh-card">
      <h2>Available Resources</h2>
      <ul>
        <li>Tool Library: Ladders, drills, rakes <span className="llh-secondary">(3 available)</span></li>
        <li>Shared Garden Plots <span className="llh-accent">(Apply now!)</span></li>
      </ul>
    </div>
  );
}

function CommunityFundTab() {
  return (
    <div className="llh-card">
      <h2>Community Fund Grants</h2>
      <GrantStatus />
      <button className="llh-btn-accent">Apply for Micro-Grant</button>
    </div>
  );
}

function CrisisSupportTab() {
  return (
    <div className="llh-card llh-alert-card">
      <h2>
        <span role="img" aria-label="Emergency">🚨</span> Crisis/Emergency Support
      </h2>
      <p>If urgent help is needed, click below for instant actions.</p>
      <button className="llh-btn-crisis">Get Crisis Help</button>
      <ul>
        <li><b>Weather Emergency Alert!</b> Severe storm warning issued.</li>
        <li>Support lines: <span className="llh-accent">211, 988</span></li>
      </ul>
    </div>
  );
}

// --- Profile Card and Stats ---
function ProfileCard({ name, badge }) {
  return (
    <div className="llh-profile-card">
      <div className="llh-avatar" aria-label="profile avatar" />
      <div>
        <div className="llh-profile-name">{name}</div>
        <div className="llh-profile-badge">{badge}</div>
      </div>
    </div>
  );
}

function ProfileStats() {
  return (
    <ul className="llh-profile-stats-list">
      <li>
        <span className="llh-secondary">Impact Score:</span> <b>92</b>
      </li>
      <li>
        <span className="llh-secondary">Completed Exchanges:</span> 17
      </li>
      <li>
        <span className="llh-secondary">Community Since:</span> 2022
      </li>
    </ul>
  );
}

function GrantStatus() {
  return (
    <ul className="llh-grant-status-list">
      <li>
        <span className="llh-accent">Urban Garden</span>: $250 funded
      </li>
      <li>
        <span className="llh-secondary">Solar Battery Pool</span>: $180 pending
      </li>
      <li>
        <span className="llh-accent">Emergency HVAC Help</span>: $300 funded
      </li>
    </ul>
  );
}

export default LocalLinkHubContainer;
