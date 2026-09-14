"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowBigUp,
  BadgeCheck,
  Bookmark,
  Check,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  MessageCircle,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

const reviews = [
  { peptide: "BPC-157", topic: "Recovery & soft-tissue discussion", score: "4.2", posts: 186, tag: "Most discussed", tone: "mint", category: "Recovery" },
  { peptide: "CJC-1295 + Ipamorelin", topic: "Sleep, recovery & study talk", score: "3.8", posts: 124, tag: "Research thread", tone: "sky", category: "Sleep & wellness" },
  { peptide: "TB-500", topic: "Community experience reports", score: "3.6", posts: 97, tag: "Evidence limited", tone: "amber", category: "Recovery" },
  { peptide: "GLP-1 research", topic: "Metabolic research & emerging studies", score: "4.0", posts: 151, tag: "High interest", tone: "sky", category: "Metabolic" },
  { peptide: "GHK-Cu", topic: "Skin, hair & tissue research discussion", score: "3.9", posts: 88, tag: "Source watch", tone: "mint", category: "Wellness" },
  { peptide: "KPV", topic: "Early-stage community research discussion", score: "3.4", posts: 54, tag: "Early evidence", tone: "amber", category: "Research" },
];

const sources = [
  { name: "PubMed", note: "Peer-reviewed literature search", type: "Research", url: "https://pubmed.ncbi.nlm.nih.gov/" },
  { name: "ClinicalTrials.gov", note: "Registered human-study records", type: "Research", url: "https://clinicaltrials.gov/" },
  { name: "FDA drug database", note: "Approval and labeling status", type: "Regulatory", url: "https://www.accessdata.fda.gov/scripts/cder/daf/" },
];

const categories = ["All", "Recovery", "Metabolic", "Sleep & wellness", "Wellness", "Research"];
type Counts = { day: number; month: number; year: number };

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState("BPC-157");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [comments, setComments] = useState([
    { name: "trailrunner", text: "Please keep reports specific: what changed, how long, and what else was going on?", ago: "2h" },
    { name: "labnotes", text: "The research link and regulatory status should always come before anecdotal experiences.", ago: "5h" },
  ]);
  const [draft, setDraft] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((item) => {
      const matchesSearch = !q || `${item.peptide} ${item.topic} ${item.category}`.toLowerCase().includes(q);
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [query, category]);

  const selectedReview = reviews.find((item) => item.peptide === selected) ?? reviews[0];

  useEffect(() => {
    fetch("/api/views", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setCounts(data as Counts))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setSaved(localStorage.getItem(`saved:${selected}`) === "1");
  }, [selected]);

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ peptide: selected, body: text }),
    });
    if (response.ok) {
      setComments([{ name: "you", text, ago: "now" }, ...comments]);
      setDraft("");
    }
  }

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    localStorage.setItem(`saved:${selected}`, next ? "1" : "0");
  }

  async function shareThread() {
    const shareData = {
      title: `${selected} discussion | Peptide Parlays`,
      text: `Source-aware ${selected} discussion on Peptide Parlays`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // User canceled the native share sheet.
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Peptide Parlays home"><span className="brand-mark">P</span><span>Peptide <i>Parlays</i></span></a>
        <label className="search"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search peptides, topics, research" aria-label="Search discussions"/></label>
        <button className="join" onClick={() => document.getElementById("comment-box")?.focus()}>Join the conversation</button>
      </header>

      <div id="top" className="hero-wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><Sparkles size={14}/> Community-reviewed, source-aware</p>
          <h1>Peptide talk with <em>more signal</em> and less noise.</h1>
          <p>Compare community experiences, open primary research, and see regulatory context without turning anecdote into medical advice.</p>
          <div className="hero-actions"><a href="#reviews" className="primary-link">Explore discussions <ChevronRight size={17}/></a><a href="#sources" className="secondary-link">View trusted sources <ExternalLink size={15}/></a></div>
        </div>
        <div className="hero-panel">
          <div><TrendingUp size={18}/><span><b>{reviews.reduce((sum, item) => sum + item.posts, 0)}+</b> community reports</span></div>
          <div><FlaskConical size={18}/><span><b>Primary sources</b> linked first</span></div>
          <div><ShieldCheck size={18}/><span><b>No dosing or sales</b> allowed</span></div>
        </div>
      </div>

      <div className="page-shell">
        <aside className="rail">
          <p className="rail-label">Explore</p>
          <a className="active" href="#reviews">Popular reviews</a>
          <a href="#discussion">Newest discussion</a>
          <a href="#sources">Trusted sources</a>
          <p className="rail-label space">Topics</p>
          {categories.slice(1).map((item) => <button key={item} className={category === item ? "rail-filter selected" : "rail-filter"} onClick={() => { setCategory(item); document.getElementById("reviews")?.scrollIntoView(); }}>{item}</button>)}
          <div className="rail-note"><ShieldCheck size={18}/><strong>Safety first</strong><span>Experiences aren’t medical advice. Verify claims with a licensed clinician.</span></div>
        </aside>

        <section className="feed">
          <div className="notice"><BadgeCheck size={18}/><span><b>Community rule:</b> no medical claims, dosing directions, or buying/selling. Share sources, context, and respectful experiences.</span></div>

          <div id="reviews" className="section-head"><div><p className="eyebrow">Browse the board</p><h2>Peptide review board</h2></div><span>Community scores are anecdotal</span></div>
          <div className="filter-row" aria-label="Filter topics">
            {categories.map((item) => <button key={item} className={category === item ? "filter-chip active" : "filter-chip"} onClick={() => setCategory(item)}>{item}</button>)}
          </div>

          {visible.length > 0 ? <div className="review-grid">{visible.map((item) => (
            <button key={item.peptide} onClick={() => { setSelected(item.peptide); document.getElementById("discussion")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={`review-card ${selected === item.peptide ? "chosen" : ""}`}>
              <div className="card-top"><span className={`tag ${item.tone}`}>{item.tag}</span><ChevronRight size={18}/></div>
              <h3>{item.peptide}</h3><p>{item.topic}</p>
              <div className="rating"><span><Star size={15} fill="currentColor"/> {item.score}</span><small>{item.posts} reports</small></div>
            </button>
          ))}</div> : <div className="empty-state"><Search size={22}/><h3>No discussions match that search.</h3><p>Try a broader term or switch back to All topics.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}

          <article id="discussion" className="thread">
            <div className="vote"><ArrowBigUp size={23}/><b>{selectedReview.posts + 62}</b></div>
            <div className="thread-body">
              <div className="thread-meta">r/{selected.toLowerCase().replaceAll(" ", "-").replaceAll("+", "plus")} <span>•</span> active discussion</div>
              <h2>What should a useful {selected} experience report include?</h2>
              <p>A strong community report separates what was personally noticed from what research actually supports. Include relevant context, timeline, other changes, and a credible source where possible.</p>
              <div className="thread-actions">
                <span><MessageCircle size={16}/> {comments.length} comments</span>
                <button type="button" onClick={shareThread}>{shared ? <Check size={16}/> : <Share2 size={16}/>} {shared ? "Link copied" : "Share"}</button>
                <button type="button" className={saved ? "saved" : ""} onClick={toggleSaved}>{saved ? <Check size={16}/> : <Bookmark size={16}/>} {saved ? "Saved" : "Save"}</button>
              </div>
              <div className="comment-list">{comments.map((c, i) => <div key={`${c.name}-${i}`} className="comment"><div className="avatar">{c.name[0].toUpperCase()}</div><p><b>u/{c.name}</b> <small>{c.ago}</small><br/>{c.text}</p></div>)}</div>
              <form onSubmit={addComment} className="composer"><label htmlFor="comment-box">Add to the discussion</label><textarea id="comment-box" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share context or a credible source—no dosing or purchase instructions." maxLength={600}/><div className="composer-bottom"><small>{draft.length}/600</small><button type="submit" disabled={!draft.trim()}>Post comment</button></div></form>
            </div>
          </article>
        </section>

        <aside className="rightbar">
          <section className="source-card" id="sources"><div className="source-heading"><div><p className="eyebrow">Source shelf</p><h2>Start with evidence</h2></div><ShieldCheck size={23}/></div>{sources.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noreferrer"><span><b>{s.name}</b><small>{s.note}</small></span><em>{s.type}</em></a>)}<p className="tiny">Links are primary research and regulatory databases—not vendor endorsements.</p></section>
          <section className="moderation"><p className="eyebrow">The Parlay Standard</p><h3>Clear sources. Clearer conversations.</h3><ul><li>Label personal experience</li><li>Link primary sources</li><li>Flag unsupported claims</li></ul></section>
          <section className="right-cta"><FlaskConical size={22}/><h3>Research before reaction.</h3><p>Open the evidence first, then use the community to compare context—not to replace professional care.</p><a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer">Search PubMed <ExternalLink size={14}/></a></section>
        </aside>
      </div>

      <footer className="site-footer" aria-label="Site view counts">
        <div><span>Today <b>{counts?.day ?? "—"}</b></span><span>This month <b>{counts?.month ?? "—"}</b></span><span>This year <b>{counts?.year ?? "—"}</b></span></div>
        <p>Peptide Parlays is an educational community, not a medical provider or marketplace.</p>
      </footer>
    </main>
  );
}
