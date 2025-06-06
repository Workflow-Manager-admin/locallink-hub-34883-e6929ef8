import React, { useState } from "react";
import "./LocalLinkHubContainer.css";

/**
 * LIGHT THEME: Restores the simple LocalLink Hub dashboard with a green & yellow palette,
 * a horizontal tab navigation for Skill Exchange, Resources, Fund, and Crisis Support.
 * Removes the premium, map-centric, dark layout, and any gold/trust visual emphasis.
 */

const TABS = [
  { key: "dashboard", label: "Dashboard", emoji: "🏠", Component: DashboardTab },
  { key: "exchange", label: "Skill Bartering", emoji: "🤝", Component: SkillBarteringTab },
  { key: "payitforward", label: "Pay-It-Forward", emoji: "🔄", Component: PayItForwardTab },
  { key: "emergency", label: "Emergency", emoji: "🚨", Component: EmergencyTab },
  { key: "aidhub", label: "Aid Hub", emoji: "🤲", Component: AidHubTab },
  { key: "resources", label: "Resources Tracker", emoji: "📦", Component: ResourcesTrackerTab },
  { key: "echorecs", label: "Echo Recs", emoji: "🔊", Component: EchoRecsTab },
  { key: "impactscore", label: "Impact Score", emoji: "💯", Component: ImpactScoreTab },
  { key: "groups", label: "Groups", emoji: "👥", Component: GroupsTab },
  { key: "event", label: "Event", emoji: "📅", Component: EventTab },
  { key: "mentalhealth", label: "Mental Health", emoji: "🧠", Component: MentalHealthTab },
  { key: "wellness", label: "Wellness", emoji: "🌱", Component: WellnessTab },
  { key: "knowledge", label: "Knowledge", emoji: "📖", Component: KnowledgeTab },
  { key: "skillrec", label: "Skill Recommendation", emoji: "💡", Component: SkillRecommendationTab },
  { key: "impacttracker", label: "Impact Tracker", emoji: "📈", Component: ImpactTrackerTab },
  { key: "disastertools", label: "Disaster Tools", emoji: "🛠️", Component: DisasterToolsTab }
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

/* === Feature Placeholder Components === */

// PUBLIC_INTERFACE
function DashboardTab() {
  return (
    <div className="llh-card" data-section="dashboard">
      <h2>Dashboard</h2>
      <p>Your personalized overview will appear here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function SkillBarteringTab() {
  return (
    <div className="llh-card" data-section="skillbartering">
      <h2>Skill Bartering / Exchange Board</h2>
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

// PUBLIC_INTERFACE
function PayItForwardTab() {
  return (
    <div className="llh-card" data-section="payitforward">
      <h2>Pay-It-Forward</h2>
      <p>Pay-it-forward opportunities and stories will be featured here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function EmergencyTab() {
  return (
    <div className="llh-card llh-alert-card" data-section="emergency">
      <h2>
        <span role="img" aria-label="Emergency">🚨</span> Emergency Panel
      </h2>
      <p>Emergency response and notifications will be shown here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function AidHubTab() {
  return (
    <div className="llh-card" data-section="aidhub">
      <h2>Aid Hub</h2>
      <p>Find or offer aid within your community here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function ResourcesTrackerTab() {
  return (
    <div className="llh-card" data-section="resources-tracker">
      <h2>Resources Tracker</h2>
      <p>Track and manage resources available in your area.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function EchoRecsTab() {
  return (
    <div className="llh-card" data-section="echo-recs">
      <h2>Echo Recs</h2>
      <p>View echo recommendations and trending efforts.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function ImpactScoreTab() {
  return (
    <div className="llh-card" data-section="impact-score">
      <h2>Impact Score</h2>
      <p>Your community impact score and stats will display here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function GroupsTab() {
  return (
    <div className="llh-card" data-section="groups">
      <h2>Groups</h2>
      <p>Join, manage, and discover local groups here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function EventTab() {
  return (
    <div className="llh-card" data-section="event">
      <h2>Event</h2>
      <p>Upcoming and past community events go here.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function MentalHealthTab() {
  return (
    <div className="llh-card" data-section="mental-health">
      <h2>Mental Health</h2>
      <p>Resources and support for mental wellness.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function WellnessTab() {
  return (
    <div className="llh-card" data-section="wellness">
      <h2>Wellness</h2>
      <p>Explore activities and tips for staying well.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function KnowledgeTab() {
  return (
    <div className="llh-card" data-section="knowledge">
      <h2>Knowledge</h2>
      <p>Articles, guides, and how-tos shared by your neighbors.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function SkillRecommendationTab() {
  return (
    <div className="llh-card" data-section="skill-recommendation">
      <h2>Skill Recommendation</h2>
      <p>Suggestions for in-demand skills and endorsements.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function ImpactTrackerTab() {
  return (
    <div className="llh-card" data-section="impact-tracker">
      <h2>Impact Tracker</h2>
      <p>Track your ongoing contributions and impact.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function DisasterToolsTab() {
  return (
    <div className="llh-card" data-section="disaster-tools">
      <h2>Disaster Tools</h2>
      <p>Emergency-preparedness and disaster recovery resources.</p>
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
