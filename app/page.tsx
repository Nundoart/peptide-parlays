"use client";

import { useEffect, useState } from "react";
import { ArrowBigUp, BadgeCheck, ChevronRight, MessageCircle, Search, ShieldCheck, Star } from "lucide-react";

const reviews = [
  { peptide: "BPC-157", topic: "Recovery & soft-tissue discussion", score: "4.2", posts: 186, tag: "Most discussed", tone: "mint" },
  { peptide: "CJC-1295 + Ipamorelin", topic: "Sleep, recovery & study talk", score: "3.8", posts: 124, tag: "Research thread", tone: "sky" },
  { peptide: "TB-500", topic: "Community experience reports", score: "3.6", posts: 97, tag: "Evidence limited", tone: "amber" },
];
const sources = [
  { name: "PubMed", note: "Peer-reviewed literature search", type: "Research", url: "https://pubmed.ncbi.nlm.nih.gov/" },
  { name: "ClinicalTrials.gov", note: "Registered human-study records", type: "Research", url: "https://clinicaltrials.gov/" },
  { name: "FDA drug database", note: "Approval and labeling status", type: "Regulatory", url: "https://www.accessdata.fda.gov/scripts/cder/daf/" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("BPC-157");
  const [counts, setCounts] = useState<{ day: number; month: number; year: number } | null>(null);
  const [comments, setComments] = useState([{ name: "trailrunner", text: "Please keep reports specific: what changed, how long, and what else was going on?", ago: "2h" }, { name: "labnotes", text: "The research link and regulatory status should always come before anecdotal experiences.", ago: "5h" }]);
  const [draft, setDraft] = useState("");
  const visible = reviews.filter((x) => x.peptide.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { fetch("/api/views", { method: "POST" }).then((r) => r.ok ? r.json() : null).then((data) => data && setCounts(data)).catch(() => undefined); }, []);
  async function addComment(e: React.FormEvent) { e.preventDefault(); const text = draft.trim(); if (!text) return; const response = await fetch("/api/comments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ peptide: selected, body: text }) }); if (response.ok) { setComments([{ name: "you", text, ago: "now" }, ...comments]); setDraft(""); } }

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">P</span><span>Peptide <i>Parlays</i></span></a><label className="search"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search peptide discussions"/></label><button className="join" onClick={() => document.getElementById("comment-box")?.focus()}>Join the conversation</button></header>
    <div id="top" className="page-shell">
      <aside className="rail"><p className="rail-label">Explore</p><a className="active" href="#reviews">Popular reviews</a><a href="#discussion">Newest discussion</a><a href="#sources">Trusted sources</a><p className="rail-label space">Topics</p><a href="#reviews">Recovery</a><a href="#reviews">Metabolic</a><a href="#reviews">Sleep & wellness</a><div className="rail-note"><ShieldCheck size={18}/><strong>Safety first</strong><span>Experiences aren’t medical advice. Verify claims with a licensed clinician.</span></div></aside>
      <section className="feed">
        <div className="intro"><p className="eyebrow">Community-reviewed, source-aware</p><h1>Talk peptides with <em>more signal.</em></h1><p>Compare community experiences, read the underlying research, and see a source’s regulatory context in one place.</p></div>
        <div className="notice"><BadgeCheck size={18}/><span><b>Community rule:</b> no medical claims, dosing directions, or buying/selling. Share sources, context, and respectful experiences.</span></div>
        <div id="reviews" className="section-head"><h2>Peptide review board</h2><span>Community scores are anecdotal</span></div>
        <div className="review-grid">{visible.map((item) => <button key={item.peptide} onClick={() => setSelected(item.peptide)} className={`review-card ${selected === item.peptide ? "chosen" : ""}`}><div className="card-top"><span className={`tag ${item.tone}`}>{item.tag}</span><ChevronRight size={18}/></div><h3>{item.peptide}</h3><p>{item.topic}</p><div className="rating"><span><Star size={15} fill="currentColor"/> {item.score}</span><small>{item.posts} reports</small></div></button>)}</div>
        <article id="discussion" className="thread"><div className="vote"><ArrowBigUp size={23}/><b>248</b></div><div className="thread-body"><div className="thread-meta">r/{selected.toLowerCase().replaceAll(" ", "-")} <span>•</span> posted 3h ago</div><h2>What should a useful {selected} experience report include?</h2><p>A strong community report separates what was personally noticed from what research actually supports. Include relevant context, timeline, other changes, and a credible source where possible.</p><div className="thread-actions"><span><MessageCircle size={16}/> {comments.length} comments</span><span>Share</span><span>Save</span></div><div className="comment-list">{comments.map((c, i) => <div key={i} className="comment"><div className="avatar">{c.name[0].toUpperCase()}</div><p><b>u/{c.name}</b> <small>{c.ago}</small><br/>{c.text}</p></div>)}</div><form onSubmit={addComment} className="composer"><label htmlFor="comment-box">Add to the discussion</label><textarea id="comment-box" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share context or a credible source—no dosing or purchase instructions." maxLength={600}/><button type="submit">Post comment</button></form></div></article>
      </section>
      <aside className="rightbar"><section className="source-card" id="sources"><div className="source-heading"><div><p className="eyebrow">Source shelf</p><h2>Start with evidence</h2></div><ShieldCheck size={23}/></div>{sources.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noreferrer"><span><b>{s.name}</b><small>{s.note}</small></span><em>{s.type}</em></a>)}<p className="tiny">Links are primary research and regulatory databases—not vendor endorsements.</p></section><section className="moderation"><p className="eyebrow">The Parlay Standard</p><h3>Clear sources. Clearer conversations.</h3><ul><li>Label personal experience</li><li>Link primary sources</li><li>Flag unsupported claims</li></ul></section></aside>
    </div>
    <footer className="mx-auto flex justify-center gap-5 border-t border-[#d9ded4] px-4 pb-[18px] pt-3 text-[11px] text-[#71807c]" aria-label="Site view counts"><span className="flex items-center gap-[5px]">Today <b className="text-xs text-[#365f57]">{counts?.day ?? "—"}</b></span><span className="flex items-center gap-[5px]">This month <b className="text-xs text-[#365f57]">{counts?.month ?? "—"}</b></span><span className="flex items-center gap-[5px]">This year <b className="text-xs text-[#365f57]">{counts?.year ?? "—"}</b></span></footer>
  </main>;
}
