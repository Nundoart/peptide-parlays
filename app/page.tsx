"use client";

import { useEffect, useState } from "react";
import { ArrowBigUp, BadgeCheck, CheckCircle2, ChevronRight, FlaskConical, Mail, MessageCircle, Search, ShieldCheck, ShoppingBag, Star, Store } from "lucide-react";

const reviews = [
  { peptide: "BPC-157", topic: "Recovery & soft-tissue discussion", tag: "Community discussion", tone: "mint" },
  { peptide: "CJC-1295 + Ipamorelin", topic: "Sleep, recovery & study talk", tag: "Research discussion", tone: "sky" },
  { peptide: "TB-500", topic: "Community experience reports", tag: "Evidence limited", tone: "amber" },
];
const categories = ["All", "Recovery", "Metabolic", "Sleep & wellness", "Wellness", "Research"];
const categoryFor: Record<string,string> = {"BPC-157":"Recovery","TB-500":"Recovery","CJC-1295 + Ipamorelin":"Sleep & wellness","GLP-1 research":"Metabolic","GHK-Cu":"Wellness","KPV":"Research"};
const sources = [
  { name: "PubMed", note: "Peer-reviewed literature search", type: "Research", url: "https://pubmed.ncbi.nlm.nih.gov/" },
  { name: "ClinicalTrials.gov", note: "Registered human-study records", type: "Research", url: "https://clinicaltrials.gov/" },
  { name: "FDA drug database", note: "Approval and labeling status", type: "Regulatory", url: "https://www.accessdata.fda.gov/scripts/cder/daf/" },
];
reviews.push(
 {peptide:"GLP-1 research",topic:"Metabolic research & emerging studies",tag:"Research discussion",tone:"sky"},
 {peptide:"GHK-Cu",topic:"Skin, hair & tissue research discussion",tag:"Source watch",tone:"mint"},
 {peptide:"KPV",topic:"Early-stage community research discussion",tag:"Research discussion",tone:"amber"}
);
const marketplaceCategories = ["All vendors", "Research peptides", "Testing services", "Lab supplies"];
const vendorChecks = ["Verified business identity", "Recent lot-specific COAs", "Independent testing details", "Transparent shipping and refund terms", "No unsupported medical claims"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [category,setCategory] = useState("All");
  const [saved,setSaved] = useState(false);

  const [selected, setSelected] = useState("BPC-157");
  useEffect(()=>{try{setSaved(localStorage.getItem("saved:"+selected)==="1");}catch{}},[selected]);
  const [counts, setCounts] = useState<{ day: number; month: number; year: number } | null>(null);
  const [comments, setComments] = useState<{id:number;body:string;createdAt:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);
  const [draft, setDraft] = useState("");
  const [marketCategory, setMarketCategory] = useState("All vendors");
  const visible = reviews.filter((x) => `${x.peptide} ${x.topic}`.toLowerCase().includes(query.toLowerCase()) && (category==="All"||categoryFor[x.peptide]===category));

  useEffect(() => { fetch("/api/views", { method: "POST" }).then((r) => r.ok ? r.json() as Promise<{day:number;month:number;year:number}> : null).then((data) => data && setCounts(data)).catch(() => undefined); }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);setComments([]);setError("");
    fetch("/api/comments?peptide="+encodeURIComponent(selected),{signal:controller.signal})
      .then(r=>{if(!r.ok)throw new Error("Comments could not load. Please refresh and try again.");return r.json() as Promise<{comments:{id:number;body:string;createdAt:string}[]}>;})
      .then(data=>{if(!controller.signal.aborted)setComments(data.comments ?? []);})
      .catch(e=>{if(!controller.signal.aborted)setError(e.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[selected]);
  async function addComment(e: React.FormEvent) {
    e.preventDefault();const text=draft.trim();if(!text||posting||loading)return;setPosting(true);setError("");
    try{
      const response=await fetch("/api/comments",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({peptide:selected,body:text})});
      if(!response.ok)throw new Error("Could not post your comment. Your draft is still here—please try again.");
      const data=await response.json() as {comment:{id:number;body:string;createdAt:string}};setComments(items=>[data.comment,...items]);setDraft("");
    }catch(e){setError(e instanceof Error?e.message:"Connection error. Please try again.");}finally{setPosting(false);}
  }
  async function shareDiscussion(){
    try{await navigator.clipboard.writeText(window.location.origin+"/#discussion");setShared(true);}catch{setError("Copy this page’s address to share the discussion.");}
  }

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">P</span><span>Peptide <i>Parlays</i></span></a><nav className="topnav" aria-label="Primary navigation"><a href="#reviews">Reviews</a><a href="#marketplace">Marketplace</a></nav><label className="search"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search peptide discussions" placeholder="Search discussions, topics, research…"/></label><button className="join" onClick={() => document.getElementById("comment-box")?.focus()}>Join the conversation</button></header>
    <div id="top" className="page-shell">
      <aside className="rail"><p className="rail-label">Explore</p><a className="active" href="#reviews">Popular reviews</a><a href="#discussion">Newest discussion</a><a href="#marketplace">Vendor marketplace</a><a href="#sources">Trusted sources</a><p className="rail-label space">Topics</p><a href="#reviews">Recovery</a><a href="#reviews">Metabolic</a><a href="#reviews">Sleep & wellness</a><div className="rail-note"><ShieldCheck size={18}/><strong>Safety first</strong><span>Experiences aren’t medical advice. Verify claims with a licensed clinician.</span></div></aside>
      <section className="feed">
        <div className="intro"><p className="eyebrow">THE PEPTIDE CONVERSATION, WITH CONTEXT</p><h1>Better questions.<br/><em>More informed conversations.</em></h1><p>Compare community experiences, read the underlying research, and see a source’s regulatory context in one place.</p></div>
        <div className="notice"><BadgeCheck size={18}/><span><b>Community rule:</b> no medical claims, dosing directions, or person-to-person sales. Marketplace listings follow a separate vendor review.</span></div>
        <div id="reviews" className="section-head"><h2>Explore the discussions</h2><span>Research • reports • questions</span></div>
        <div className="market-filters">{categories.map(c=><button key={c} className={c===category?"selected":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="review-grid">{visible.map((item) => <button key={item.peptide} disabled={posting} aria-pressed={selected === item.peptide} onClick={() => {setSelected(item.peptide);setShared(false);setDraft("");}} className={`review-card ${selected === item.peptide ? "chosen" : ""}`}><div className="card-top"><span className={`tag ${item.tone}`}>{item.tag}</span><ChevronRight size={18}/></div><h3>{item.peptide}</h3><p>{item.topic}</p><div className="rating"><span><MessageCircle size={15}/> Open thread</span><small>{selected === item.peptide ? "Selected" : "Explore"}</small></div></button>)}{visible.length === 0 && <div className="empty-results">No discussions match “{query}”. Try BPC-157, TB-500, or sleep.</div>}</div>
        <article id="discussion" className="thread"><div className="thread-body"><div className="thread-meta">r/{selected.toLowerCase().replaceAll(" ", "-")} <span>•</span> <span className="thread-tag">Community discussion</span></div><h2>What should a useful {selected} experience report include?</h2><p>A strong community report separates what was personally noticed from what research actually supports. Include relevant context, timeline, other changes, and a credible source where possible.</p><div className="thread-actions"><span><MessageCircle size={16}/> {comments.length} comments</span><button type="button" onClick={shareDiscussion}>{shared ? "Link copied" : "Copy page link"}</button><button type="button" aria-pressed={saved} onClick={()=>{const next=!saved;setSaved(next);try{localStorage.setItem("saved:"+selected,next?"1":"0");}catch{}}}>{saved?"Saved":"Save"}</button></div><div className="comment-list" aria-live="polite">{loading?<p className="feedback">Loading the conversation…</p>:comments.length===0&&!error?<p className="feedback">No comments yet. Bring a question, a source, or a thoughtful perspective.</p>:comments.map(c=><div key={c.id} className="comment"><div className="avatar">P</div><p><b>Community member</b><small>{c.createdAt?.slice(0,10)}</small><br/>{c.body}</p></div>)}</div>{error&&<p role="alert" className="feedback error">{error}</p>}<form onSubmit={addComment} className="composer"><label htmlFor="comment-box">Add to the discussion</label><textarea id="comment-box" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share context or a credible source—no dosing or purchase instructions." maxLength={600}/><button type="submit" disabled={posting || loading || !draft.trim()}>{posting ? "Posting…" : "Post comment"}</button></form></div></article>
        <section id="marketplace" className="marketplace">
          <div className="market-hero"><div><p className="eyebrow">VENDOR MARKETPLACE</p><h2>Shop with more proof, not more promises.</h2><p>Explore vendor standards for research products, testing services, and lab supplies. No approved vendors are currently listed.</p></div><ShoppingBag size={34}/></div>
          <div className="market-filters" aria-label="Marketplace categories">{marketplaceCategories.map((category) => <button key={category} className={marketCategory === category ? "selected" : ""} onClick={() => setMarketCategory(category)}>{category}</button>)}</div>
          <div className="market-empty">
            <div className="empty-icon"><Store size={28}/></div>
            <div><span className="opening">{marketCategory === "All vendors" ? "Founding vendor applications open" : marketCategory + " · applications open"}</span><h3>No vendors listed yet.</h3><p>This directory is open for applications. Listings will need supporting documentation before appearing here.</p></div>
            <a className="apply-button" href="mailto:linebergerm01@gmail.com?subject=Peptide%20Parlays%20Marketplace%20Vendor%20Application&body=Business%20name%3A%0AWebsite%3A%0ACountry%2Fstate%3A%0AProduct%20categories%3A%0ACOAs%20or%20testing%20page%3A%0AContact%20name%3A">Apply to sell <Mail size={16}/></a>
          </div>
          <div className="market-standard"><div><FlaskConical size={21}/><span><b>The Parlay vendor check</b><small>Required before a store can be listed</small></span></div><ul>{vendorChecks.map((check) => <li key={check}><CheckCircle2 size={15}/>{check}</li>)}</ul></div>
          <p className="market-disclaimer">Marketplace listings are third-party links, not medical recommendations. Peptide Parlays does not diagnose, prescribe, or guarantee product legality, safety, purity, or fitness for human use. Buyers are responsible for local-law compliance.</p>
        </section>

      </section>
      <aside className="rightbar"><section className="source-card" id="sources"><div className="source-heading"><div><p className="eyebrow">Source shelf</p><h2>Start with evidence</h2></div><ShieldCheck size={23}/></div>{sources.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noreferrer"><span><b>{s.name}</b><small>{s.note}</small></span><em>{s.type}</em></a>)}<p className="tiny">Links are primary research and regulatory databases—not vendor endorsements.</p></section><section className="moderation"><p className="eyebrow">The Parlay Standard</p><h3>Clear sources. Clearer conversations.</h3><ul><li>Label personal experience</li><li>Link primary sources</li><li>Flag unsupported claims</li></ul></section><section className="vendor-callout"><Store size={21}/><p className="eyebrow">For reputable sellers</p><h3>Build trust in public.</h3><p>Apply to list your store, testing record, policies, and verified products.</p><a href="mailto:linebergerm01@gmail.com?subject=Peptide%20Parlays%20Marketplace%20Vendor%20Application">Vendor application <ChevronRight size={15}/></a></section></aside>
    </div>
    <footer className="site-footer" aria-label="Site view counts"><span className="flex items-center gap-[5px]">Today <b className="text-xs text-[#365f57]">{counts?.day ?? "—"}</b></span><span className="flex items-center gap-[5px]">This month <b className="text-xs text-[#365f57]">{counts?.month ?? "—"}</b></span><span className="flex items-center gap-[5px]">This year <b className="text-xs text-[#365f57]">{counts?.year ?? "—"}</b></span></footer>
  </main>;
}
