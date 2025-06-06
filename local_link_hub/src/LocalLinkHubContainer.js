import React, { useState } from "react";
import "./LocalLinkHubContainer.css";

/**
 * DARK-PREMIUM THEME: Implements a map-centric dashboard (center), prominent trust/profile on the right, tabbed navigation (top),
 * highlighted AI/alerts, and minimalist, modern style with premium, accessible color scheme.
 */

// Tab navigation info
const TABS = [
  {
    key: "exchange",
    label: "Skill Exchange",
    emoji: "🤝",
    Component: SkillBarteringTab
  },
  {
    key: "resources",
    label: "Resource Listings",
    emoji: "📦",
    Component: ResourceListingTab
  },
  {
    key: "fund",
    label: "Community Fund",
    emoji: "💸",
    Component: CommunityFundTab
  },
  {
    key: "crisis",
    label: "Crisis Support",
    emoji: "🚨",
    Component: CrisisSupportTab
  }
];

// PUBLIC_INTERFACE
function LocalLinkHubContainer() {
  const [currentTab, setCurrentTab] = useState(TABS[0].key);

  const CurrentTabComponent = TABS.find((tab) => tab.key === currentTab)
    ?.Component;

  return (
    <div className="llh-root llh-dark-theme">
      {/* Top Fixed Navbar */}
      <header className="llh-navbar-premium">
        <div className="llh-logo-premium">
          <span className="llh-logo-gold">*</span>
          LocalLink Hub
          <span className="llh-profile-verification">Verified</span>
        </div>
        <TrustIndicator />
        <UrgentAlert />
      </header>
      {/* Tab Navigation */}
      <nav className="llh-tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`llh-tab-btn${currentTab === tab.key ? " selected" : ""}`}
            onClick={() => setCurrentTab(tab.key)}
            aria-label={tab.label}
          >
            <span>{tab.emoji}</span> <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="llh-main-premium">
        {/* Map-Centric Area */}
        <section className="llh-map-area">
          <MapPlaceholder />
          <AISuggestionBlurb />
        </section>

        {/* Tabbed content, swapped via tab state */}
        <section className="llh-tab-panel">
          <CurrentTabComponent />
        </section>
      </main>
      {/* Right/Profile Area: Prominent, uncluttered, always visible */}
      <aside className="llh-profile-premium">
        <ProfileCardPremium
          name="Jessie A."
          badge="Verified • Hillcrest Micro-Community"
        />
        <ProfileStats />
        <div className="llh-trust-details">
          <TrustBadge />
        </div>
      </aside>
    </div>
  );
}

// =================
// TABBED PANEL LOGIC
// =================
function SkillBarteringTab() {
  return (
    <div className="llh-card-premium">
      <h2>Skill Exchange Board</h2>
      <ul>
        <li>
          <b>Offer:</b> Guitar Lessons – <span className="llh-premium-accent">Seeking</span>: Childcare
        </li>
        <li>
          <b>Request:</b> Bike Repair – <span className="llh-premium-accent">Offering</span>: Home-cooked Meal
        </li>
      </ul>
    </div>
  );
}

function ResourceListingTab() {
  return (
    <div className="llh-card-premium">
      <h2>Available Resources</h2>
      <ul>
        <li>Tool Library: Ladders, drills, rakes <span className="llh-premium-secondary">(3 available)</span></li>
        <li>Shared Garden Plots <span className="llh-premium-accent">(Apply now!)</span></li>
      </ul>
    </div>
  );
}

function CommunityFundTab() {
  return (
    <div className="llh-card-premium">
      <h2>Community Fund Grants</h2>
      <GrantStatus />
      <button className="llh-btn-rich">Apply for Micro-Grant</button>
    </div>
  );
}

function CrisisSupportTab() {
  return (
    <div className="llh-card-premium llh-alert-card">
      <h2>
        <span role="img" aria-label="Emergency">🚨</span> Crisis/Emergency Support
      </h2>
      <p>If you or someone needs urgent help, click below for instant actions.</p>
      <button className="llh-btn-crisis">Get Crisis Help</button>
      <ul>
        <li><b>Weather Emergency Alert!</b> Severe storm warning issued.</li>
        <li>Connect with local support lines: <span className="llh-premium-accent">211, 988</span></li>
      </ul>
    </div>
  );
}

// =================
// AUXILIARY COMPONENTS (Minimal, trust-focused)
// =================

// Map Placeholder
function MapPlaceholder() {
  return (
    <div className="llh-map-premium">
      <div className="llh-map-bg">[Map visualization placeholder]</div>
      {/* Real map would integrate here */}
    </div>
  );
}

// AI Suggestion / Alert Highlight
function AISuggestionBlurb() {
  return (
    <div className="llh-ai-suggestion">
      <span className="llh-ai-icon">🤖</span>
      <span>
        <b>AI suggestion:</b> Neighbor skill exchange matches found. Connect now to maximize local resources!
      </span>
    </div>
  );
}

// Prominent Urgent Alert
function UrgentAlert() {
  return (
    <div className="llh-urgent-alert" role="alert">
      <span className="llh-alert-icon">⚡</span>
      <span>Urgent: Power outage reported nearby &mdash; get real-time updates</span>
    </div>
  );
}

// Trust/Verification cues
function TrustIndicator() {
  return (
    <div className="llh-trust-indicator">
      <span role="img" aria-label="Trusted">🛡️</span> Trust Verified
    </div>
  );
}

function TrustBadge() {
  return (
    <div className="llh-trust-badge">
      <span role="img" aria-label="ID check">✔️</span> ID-Verified&nbsp;
      <span className="llh-premium-accent">Community Confirmed</span>
    </div>
  );
}

function ProfileCardPremium({ name, badge }) {
  return (
    <div className="llh-profile-card-premium">
      <div className="llh-avatar-premium" aria-label="profile avatar" />
      <div>
        <div className="llh-profile-name-premium">{name}</div>
        <div className="llh-profile-badge-premium">{badge}</div>
      </div>
    </div>
  );
}

function ProfileStats() {
  // Example trust and community/activity stats
  return (
    <ul className="llh-profile-stats-list">
      <li>
        <span className="llh-premium-accent">Impact Score:</span> <b>92</b>
      </li>
      <li>
        <span className="llh-premium-secondary">Completed Exchanges:</span> 17
      </li>
      <li>
        <span className="llh-premium-secondary">Community Since:</span> 2022
      </li>
    </ul>
  );
}

function GrantStatus() {
  return (
    <ul className="llh-grant-status-list">
      <li>
        <span className="llh-premium-accent">Urban Garden</span>: $250 funded
      </li>
      <li>
        <span className="llh-premium-secondary">Solar Battery Pool</span>: $180 pending
      </li>
      <li>
        <span className="llh-premium-accent">Emergency HVAC Help</span>: $300 funded
      </li>
    </ul>
  );
}

export default LocalLinkHubContainer;
