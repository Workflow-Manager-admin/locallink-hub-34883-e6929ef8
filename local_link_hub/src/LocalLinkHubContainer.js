import React from "react";
import "./LocalLinkHubContainer.css";

// --- Individual Feature Placeholders ---
/**
 *  Dashboard / Feed (main landing content)
 *  This can be expanded with props/handlers as business logic is developed.
 */
// PUBLIC_INTERFACE
function Dashboard() {
  return <section className="llh-card">Dashboard: Community Activity Feed & Map</section>;
}

// PUBLIC_INTERFACE
function SkillBartering() {
  return <section className="llh-card">Skill Bartering Board</section>;
}

// PUBLIC_INTERFACE
function PayItForward() {
  return <section className="llh-card">Pay-it-Forward Offers</section>;
}

// PUBLIC_INTERFACE
function Emergency() {
  return (
    <button className="llh-crisis-btn" title="Crisis Support">
      🚨 Crisis/Emergency
    </button>
  );
}

// PUBLIC_INTERFACE
function AidHub() {
  return <section className="llh-card">Aid Hub: Available Assistance</section>;
}

// PUBLIC_INTERFACE
function ResourcesTracker() {
  return <section className="llh-card">Resources Tracker</section>;
}

// PUBLIC_INTERFACE
function EchoRecs() {
  return <section className="llh-card">Echo Recommendations</section>;
}

// PUBLIC_INTERFACE
function ImpactScore() {
  return (
    <div className="llh-profile-stat">
      <span role="img" aria-label="Impact">
        🌱
      </span>{" "}
      Impact Score: <b>83</b>
    </div>
  );
}

// PUBLIC_INTERFACE
function Groups() {
  return <section className="llh-card">Groups & Teams</section>;
}

// PUBLIC_INTERFACE
function Events() {
  return <section className="llh-card">Community Events</section>;
}

// PUBLIC_INTERFACE
function MentalHealth() {
  return <section className="llh-card">Mental Health & Wellness</section>;
}

// PUBLIC_INTERFACE
function Wellness() {
  return <section className="llh-card">Wellness Initiatives</section>;
}

// PUBLIC_INTERFACE
function Knowledge() {
  return <section className="llh-card">Knowledge Base</section>;
}

// PUBLIC_INTERFACE
function SkillRecommendation() {
  return <section className="llh-card">Skill Recommendations</section>;
}

// PUBLIC_INTERFACE
function ImpactTracker() {
  return <section className="llh-card">Impact Tracker</section>;
}

// PUBLIC_INTERFACE
function DisasterTools() {
  return <section className="llh-card">Disaster Tools & Info</section>;
}

// PUBLIC_INTERFACE
function ProfileCard({ name, badge }) {
  return (
    <div className="llh-profile-card">
      <div className="llh-avatar" />
      <div>
        <div className="llh-profile-name">{name}</div>
        <div className="llh-profile-badge">{badge}</div>
      </div>
      <ImpactScore />
    </div>
  );
}

// PUBLIC_INTERFACE
function MicroGrantSection() {
  return (
    <section className="llh-card llh-microgrant">
      <h3>Community Micro-Grants</h3>
      <button className="llh-microgrant-btn">Apply Now</button>
      <ul className="llh-microgrant-list">
        <li>Urban Garden - $250 funded</li>
        <li>Tool Library - $100 pending</li>
        <li>Emergency HVAC Help - $300 funded</li>
      </ul>
    </section>
  );
}

// --- Main Container ---
// PUBLIC_INTERFACE
function LocalLinkHubContainer() {
  return (
    <div className="llh-root">
      {/* Header/Navbar */}
      <nav className="llh-navbar">
        <span className="llh-logo">
          <span className="llh-logo-asterisk">*</span> LocalLink Hub
        </span>
        <Emergency />
      </nav>
      {/* Sidebar - for smaller screens goes to bottom/flex */}
      <aside className="llh-sidebar">
        <SkillBartering />
        <PayItForward />
        <AidHub />
        <Groups />
        <ResourcesTracker />
        <DisasterTools />
      </aside>
      {/* Main Dashboard Area */}
      <main className="llh-main">
        <Dashboard />
        <Events />
        <MentalHealth />
        <Wellness />
        <EchoRecs />
        <Knowledge />
        <SkillRecommendation />
        <ImpactTracker />
      </main>
      {/* Right/Profile/Microgrant (Collapses on mobile) */}
      <aside className="llh-profile-area">
        <ProfileCard
          name="Jessie A."
          badge="Verified Member • Hillcrest Micro-Community"
        />
        <MicroGrantSection />
      </aside>
      {/* Mobile-only quick nav for core features */}
      <nav className="llh-mobile-nav">
        <button className="llh-mobile-btn" title="Dashboard">🏡</button>
        <button className="llh-mobile-btn" title="Barter">🤝</button>
        <button className="llh-mobile-btn" title="Aid">👐</button>
        <button className="llh-mobile-btn" title="Emergency">🚨</button>
        <button className="llh-mobile-btn" title="Profile">👤</button>
      </nav>
    </div>
  );
}

export default LocalLinkHubContainer;
