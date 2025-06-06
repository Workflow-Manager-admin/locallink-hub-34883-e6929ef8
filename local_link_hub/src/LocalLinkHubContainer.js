import React, { useState } from "react";
import "./LocalLinkHubContainer.css";
import SkillRecommender from "./SkillRecommender";

// FEATURE ENTRY DATA (16 features, 4-5 exemplar entries per feature)
const FEATURES = {
  "dashboard": {
    label: "Dashboard",
    emoji: "🏠",
    component: "DashboardTab",
  },
  "geofence": {
    label: "Geofenced Micro-Communities",
    emoji: "📍",
    entries: [
      { name: "Hillcrest Ave Block A", action: "View Community", msg: "You are viewing Hillcrest Ave Block A Micro-Community." },
      { name: "Mason Park Neighbors", action: "Join", msg: "You have joined Mason Park Neighbors!" },
      { name: "Market St Commons", action: "Request Invite", msg: "Request to join Market St Commons sent." },
      { name: "Westside Gardeners", action: "Browse", msg: "Browsing Westside Gardeners community info." },
    ]
  },
  "profiles": {
    label: "Verified User Profiles",
    emoji: "🪪",
    entries: [
      { name: "Jessie A. (You)", action: "See Profile", msg: "Viewing your verified profile." },
      { name: "Marta Q., Trusted Neighbor", action: "View", msg: "Viewing Marta's verified profile." },
      { name: "Liam N.", action: "Send Message", msg: "Message sent to Liam N." },
      { name: "Nora K. (Community Lead)", action: "Request Vouch", msg: "Vouch request sent to Nora K." }
    ]
  },
  "exchange": {
    label: "Skill & Resource Exchange",
    emoji: "🤝",
    entries: [
      { name: "Offer: Guitar Lessons", action: "Connect", msg: "Connecting with skill barter partner about Guitar Lessons." },
      { name: "Request: Bike Repair", action: "Help Out", msg: "You've offered help for Bike Repair request." },
      { name: "Offer: Sewing Services", action: "See Details", msg: "Viewing more about this sewing offer." },
      { name: "Ask: Math Tutoring", action: "Make Offer", msg: "You've made an offer for Math Tutoring." }
    ]
  },
  "crisis": {
    label: "Crisis Support",
    emoji: "🚨",
    entries: [
      { name: "Urgent Meal Delivery Needed", action: "Respond", msg: "You volunteered for urgent meal delivery support!" },
      { name: "Flood Relief Crew Forming", action: "Join Team", msg: "You've joined the Flood Relief team." },
      { name: "Lost Power – Elder Needs Help", action: "Contact", msg: "You've contacted to help an elder in crisis." },
      { name: "Medical Supplies Shortage", action: "View", msg: "Viewing crisis details for medical supplies shortage." }
    ]
  },
  "grants": {
    label: "Community Micro-Grants",
    emoji: "💸",
    entries: [
      { name: "Urban Garden Mini-Fundraiser", action: "Contribute", msg: "Thank you for contributing to Urban Garden!" },
      { name: "Literacy Night Supplies Grant", action: "Support", msg: "You are supporting Literacy Night Supplies." },
      { name: "Solar Pool Battery Fund", action: "View More", msg: "Viewing info on Solar Pool Battery Fund." },
      { name: "Neighborhood Art Wall", action: "Donate", msg: "Thanks for donating to Neighborhood Art Wall!" }
    ]
  },
  "aidhub": {
    label: "Aid Hub",
    emoji: "🤲",
    entries: [
      { name: "Free Produce Pickup", action: "Sign Up", msg: "You've signed up for Free Produce Pickup." },
      { name: "Lawn Mowing Volunteers", action: "Volunteer", msg: "You volunteered for Lawn Mowing." },
      { name: "Book Exchange Bin", action: "Visit", msg: "Directions to Book Exchange Bin provided." },
      { name: "Coat Drive", action: "Donate", msg: "Thank you for donating to Coat Drive." }
    ]
  },
  "resources": {
    label: "Resources Tracker",
    emoji: "📦",
    entries: [
      { name: "Open/Shared Tools: 14", action: "View List", msg: "Viewing list of 14 available tools." },
      { name: "Pantry Inventory Report", action: "Download", msg: "Pantry Inventory report downloaded." },
      { name: "Request: Blender", action: "Fulfill", msg: "You're offering Blender to fulfill request." },
      { name: "Borrowed: Power Drill", action: "Return", msg: "Prompt: Ready to return Power Drill?" }
    ]
  },
  "echorecs": {
    label: "Echo Recommendations",
    emoji: "🔊",
    entries: [
      { name: "Great Babysitter: Priya S.", action: "Endorse", msg: "You endorsed Priya as a babysitter." },
      { name: "Top Communicator: Alan B.", action: "View", msg: "Viewing Echo for Alan B." },
      { name: "Skill: Plumbing – Needed!", action: "Recommend", msg: "You recommended a plumbing expert." },
      { name: "Neighbor of the Week: Zoe M.", action: "Congratulate", msg: "You sent congrats to Zoe M." }
    ]
  },
  "impactscore": {
    label: "Impact Score",
    emoji: "💯",
    entries: [
      { name: "Score: 92", action: "View Details", msg: "You are viewing detailed impact metrics." },
      { name: "Rank: 3rd in Hillcrest", action: "Compare", msg: "Comparing impact ranks in your area." },
      { name: "Recent: Helped Flood Relief", action: "See Record", msg: "Viewing your Flood Relief service record." },
      { name: "Next Milestone: 100", action: "Set Goal", msg: "Goal set towards next Impact Score milestone!" }
    ]
  },
  "groups": {
    label: "Groups",
    emoji: "👥",
    entries: [
      { name: "Hillcrest Dog Walkers", action: "Join", msg: "You've joined Hillcrest Dog Walkers." },
      { name: "Civic Engagement Committee", action: "Inquire", msg: "Inquiry sent to Civic Engagement Committee." },
      { name: "Book Club", action: "RSVP", msg: "RSVP for Book Club discussion submitted." },
      { name: "Neighborhood Watch", action: "View Details", msg: "Viewing Neighborhood Watch info." }
    ]
  },
  "event": {
    label: "Event",
    emoji: "📅",
    entries: [
      { name: "Park Clean-up Saturday", action: "Sign Up", msg: "You are now a volunteer for Park Clean-up." },
      { name: "Micro-Grant Workshop", action: "Attend", msg: "You've RSVP'd to attend the Micro-Grant Workshop!" },
      { name: "Block Party - June 14", action: "See Details", msg: "Viewing details for Block Party." },
      { name: "Emergency Prep Night", action: "Register", msg: "Registered for Emergency Prep Night." }
    ]
  },
  "mentalhealth": {
    label: "Mental Health",
    emoji: "🧠",
    entries: [
      { name: "Community Counselor Chat", action: "Start", msg: "Opening chat with a community counselor." },
      { name: "Peer Support Group", action: "Join", msg: "You've joined the Peer Support Group." },
      { name: "Mindfulness Audio Session", action: "Listen", msg: "Listening to Mindfulness Audio Session now." },
      { name: "Request Check-in", action: "Send", msg: "Check-in request sent." }
    ]
  },
  "wellness": {
    label: "Wellness",
    emoji: "🌱",
    entries: [
      { name: "Free Yoga in Park", action: "Sign Up", msg: "You signed up for Free Yoga in Park." },
      { name: "Healthy Recipe Share", action: "See Recipes", msg: "Viewing shared Healthy Recipes." },
      { name: "Group Walk", action: "Join", msg: "You joined today's Group Walk!" },
      { name: "Sleep Tips Workshop", action: "Register", msg: "Registered for Sleep Tips Workshop." }
    ]
  },
  "knowledge": {
    label: "Knowledge",
    emoji: "📖",
    entries: [
      { name: "How-to: Build Raised Beds", action: "Read", msg: "Reading guide: Build Raised Beds." },
      { name: "Emergency Kit List", action: "Download", msg: "Downloaded Emergency Kit Checklist." },
      { name: "Guide: Recycle More", action: "Open", msg: "Opening the 'Recycle More' guide." },
      { name: "Neighbor Q&A: Composting", action: "Contribute", msg: "You've contributed to Composting Q&A." }
    ]
  },
  "skillrec": {
    label: "Skill Recommendation",
    emoji: "💡",
    entries: [
      { name: "Learn: First Aid Skills", action: "Enroll", msg: "Enrolled in First Aid Skills course." },
      { name: "Popular: Carpentry", action: "Teachers", msg: "Viewing Carpentry teachers in area." },
      { name: "Endorse: Spanish Speakers", action: "Endorse", msg: "Endorsed local Spanish language skills." },
      { name: "Request: Cooking Mentor", action: "Request", msg: "Requested a Cooking Mentor." }
    ]
  },
  "impacttracker": {
    label: "Impact Tracker",
    emoji: "📈",
    entries: [
      { name: "Flood Relief (July)", action: "See Impact", msg: "Viewing detailed impact for Flood Relief (July)." },
      { name: "Volunteer: 32 Hrs", action: "Log More", msg: "Log more volunteer hours - Impact updated!" },
      { name: "Donations: $140", action: "Breakdown", msg: "Viewing donation breakdown for your impact." },
      { name: "Active: Neighborhood Patrol", action: "Sign Out", msg: "You signed out of Neighborhood Patrol." }
    ]
  },
  "disastertools": {
    label: "Disaster Tools",
    emoji: "🛠️",
    entries: [
      { name: "Flashlight Locator", action: "Open Tool", msg: "Opening Flashlight Locator tool." },
      { name: "Map: Emergency Exits", action: "See Map", msg: "Viewing Emergency Exits Map." },
      { name: "Assist: Emergency Contacts", action: "Add", msg: "Emergency Contact added to your list." },
      { name: "Checklist: Supplies", action: "Check-off", msg: "Supply Checklist: Updated!" }
    ]
  },
};

// LIST OF FEATURE KEYS (ORDER MATTERS FOR NAV/SIDEBAR)
const FEATURE_KEYS = [
  "dashboard", "geofence", "profiles", "exchange", "crisis", "grants", "aidhub", "resources",
  "echorecs", "impactscore", "groups", "event", "mentalhealth", "wellness", "knowledge", "skillrec", "impacttracker", "disastertools"
];

/*
  PUBLIC_INTERFACE: Main container for LocalLink Hub, implementing new layout,
  navigation and feature modules. Clean, consistent, and responsive alignment.
*/
function LocalLinkHubContainer() {
  const [currentFeature, setCurrentFeature] = useState("dashboard");
  const [contextMsg, setContextMsg] = useState("");

  const Footer = () => (
    <footer className="llh-footer" role="contentinfo" aria-label="Community Copyright Notice">
      <span>
        © {new Date().getFullYear()} LocalLink Hub
        <span className="llh-footer-emoji" aria-label="link">🔗</span>
        | Crafted for local resilience
      </span>
    </footer>
  );

  return (
    <div className="llh-container">
      {/* Header */}
      <header className="llh-horiz-navbar" role="banner">
        <div className="llh-logo-row" tabIndex={0}>
          <span className="llh-logo-symbol">*</span>
          <span className="llh-logo-word">LocalLink Hub</span>
          <span className="llh-horiz-verified">Verified Community</span>
        </div>
      </header>

      <div className="llh-layout-main">
        {/* VERTICAL SIDEBAR Navigation */}
        <nav className="llh-vertical-nav" aria-label="Section Navigation">
          <ul>
            {FEATURE_KEYS.slice(0, 16).map(key => (
              <li key={key}>
                <button
                  className={`llh-nav-btn${currentFeature === key ? " selected" : ""}`}
                  aria-current={currentFeature === key ? "page" : undefined}
                  aria-label={FEATURES[key]?.label || key}
                  onClick={() => { setCurrentFeature(key); setContextMsg(""); }}
                >
                  <span className="llh-nav-emoji">{FEATURES[key]?.emoji}</span>
                  <span className="llh-nav-label">{FEATURES[key]?.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* MAIN FEATURE VIEW */}
        <main className="llh-main-area" aria-live="polite">
          <SectionPanel
            featureKey={currentFeature}
            entries={FEATURES[currentFeature]?.entries}
            label={FEATURES[currentFeature]?.label}
            emoji={FEATURES[currentFeature]?.emoji}
            onAction={msg => setContextMsg(msg)}
          />
          {contextMsg && (
            <div className="llh-context-msg" aria-atomic="true" tabIndex={0}>
              {contextMsg}
            </div>
          )}
        </main>

        {/* PROFILE/SUMMARY SIDEBAR (right) */}
        <aside className="llh-profile-sidebar" aria-label="Profile Sidebar">
          <ProfileCard name="Jessie A." badge="Hillcrest Micro-Community" />
          <ProfileStats />
        </aside>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

/*
  SectionPanel is the wrapper for each feature (abstracts single-feature panels, shows their entries and buttons)
  PUBLIC_INTERFACE
*/
function SectionPanel({ featureKey, entries, label, emoji, onAction }) {
  // Show SkillRecommender for Skill Recommendation or Skill & Resource Exchange tabs
  const isSkillRec =
    featureKey === "skillrec" || featureKey === "exchange";

  if (!entries && !isSkillRec) {
    return (
      <section className="llh-card" data-section={featureKey}>
        <h2>
          {emoji && <span style={{ marginRight: 8 }}>{emoji}</span>}
          {label}
        </h2>
        <p>No example data available for this feature.</p>
      </section>
    );
  }

  return (
    <div>
      <section className="llh-card" data-section={featureKey} tabIndex={-1}>
        <h2>
          {emoji && <span style={{ marginRight: 8 }}>{emoji}</span>}
          {label}
        </h2>
        {entries && (
          <>
            <ul className="llh-feature-entry-list">
              {entries.map((entry, idx) => (
                <li className="llh-feature-entry" key={idx}>
                  <span className="llh-feature-entry-label">{entry.name}</span>
                  <button
                    className="llh-btn-accent"
                    onClick={() => onAction(entry.msg)}
                    aria-label={`${entry.action} for ${entry.name}`}
                    tabIndex={0}
                  >
                    {entry.action}
                  </button>
                </li>
              ))}
            </ul>
            <p className="llh-card-note" aria-live="off">
              For demonstration, all entries represent sample exchanges or options.
            </p>
          </>
        )}
      </section>
      {isSkillRec && (
        <SkillRecommender
          context={featureKey}
          label={
            featureKey === "exchange"
              ? "Need help deciding what you can offer or request? Try AI suggestions!"
              : "Get AI-powered Local Skill Suggestions"
          }
        />
      )}
    </div>
  );
}

// --- Profile Card and Stats ---
function ProfileCard({ name, badge }) {
  return (
    <section className="llh-profile-card" aria-label={`${name} profile`}>
      <div className="llh-avatar" aria-label="profile avatar" />
      <div>
        <div className="llh-profile-name">{name}</div>
        <div className="llh-profile-badge">{badge}</div>
      </div>
    </section>
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

export default LocalLinkHubContainer;
