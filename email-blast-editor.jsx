import { useState, useRef, useCallback, useEffect } from "react";

const isMobileDevice = () => typeof window !== "undefined" && window.innerWidth < 700;

// ── COLORS / THEME ────────────────────────────────────────────
const C = {
  bg: "#0a0a12", bg2: "#0d0d18", bg3: "#12121e", card: "#16161f",
  border: "#1e1e2a", border2: "#252530",
  text: "#eeeef8", muted: "#7070a0", faint: "#303045",
  amber: "#f59e0b", amberDim: "#7a4f00",
  green: "#22c55e", blue: "#3b82f6", red: "#ef4444", purple: "#a855f7",
};
const BTN = (active, danger) => ({
  background: danger ? C.red : active ? C.amber : C.bg3,
  color: danger ? "#fff" : active ? "#111" : C.muted,
  border: `1px solid ${danger ? C.red : active ? C.amber : C.border2}`,
  borderRadius: 8, cursor: "pointer", fontFamily: "system-ui,sans-serif",
  fontWeight: 700, transition: "all .15s",
});

// ── BLOCK DEFINITIONS ─────────────────────────────────────────
const DEFS = {
  hero: { label: "Hero", icon: "🌟", cat: "Layout", def: { title: "Big Headline Here", sub: "Your compelling supporting message goes here.", bg: "#1e1b4b", tc: "#fff", sc: "rgba(255,255,255,.7)", btn: "Get Started", btnUrl: "#", btnBg: "#f59e0b", btnTc: "#111", showBtn: true } },
  text: { label: "Text", icon: "📝", cat: "Content", def: { body: "Add your message here. Write something that connects with your audience and drives them to act.", fs: 16, color: "#333355", align: "left" } },
  heading: { label: "Heading", icon: "🔤", cat: "Content", def: { text: "Section Title", fs: 26, color: "#1a1a2e", align: "left", bold: true } },
  button: { label: "Button", icon: "🔘", cat: "Content", def: { text: "Click Here", url: "#", bg: "#f59e0b", tc: "#111", align: "center", radius: 8 } },
  image: { label: "Image", icon: "🖼️", cat: "Media", def: { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=280&fit=crop&auto=format", alt: "Image", radius: 0 } },
  divider: { label: "Divider", icon: "➖", cat: "Layout", def: { color: "#dde", thick: 1, style: "solid" } },
  spacer: { label: "Spacer", icon: "↕️", cat: "Layout", def: { h: 32 } },
  footer: { label: "Footer", icon: "📋", cat: "Footer", def: { co: "Your Company", addr: "123 Main St, City 12345", unsub: "Unsubscribe", color: "#9090b0", bg: "#f5f5fa" } },
};
const CATS = ["Layout", "Content", "Media", "Footer"];
const mkId = () => "b" + Math.random().toString(36).slice(2, 8);
const mkBlock = t => ({ id: mkId(), type: t, p: { ...DEFS[t].def } });
const INIT = [mkBlock("hero"), mkBlock("text"), mkBlock("button"), mkBlock("spacer"), mkBlock("footer")];

// ── EMAIL EXPORT ──────────────────────────────────────────────
function toHTML(blocks, cam) {
  const rows = blocks.map(b => {
    const p = b.p;
    switch (b.type) {
      case "hero": return `<div style="background:${p.bg};padding:52px 32px;text-align:center"><h1 style="font-family:Arial;font-size:34px;color:${p.tc};font-weight:900;margin:0 0 12px;line-height:1.2">${p.title}</h1><p style="font-family:Arial;font-size:17px;color:${p.sc};margin:0 0 24px;line-height:1.5">${p.sub}</p>${p.showBtn ? `<a href="${p.btnUrl}" style="display:inline-block;background:${p.btnBg};color:${p.btnTc};font-family:Arial;font-size:16px;font-weight:700;padding:13px 32px;border-radius:8px;text-decoration:none">${p.btn}</a>` : ""}</div>`;
      case "text": return `<p style="font-family:Arial;font-size:${p.fs}px;color:${p.color};text-align:${p.align};line-height:1.7;padding:10px 36px;margin:0">${p.body}</p>`;
      case "heading": return `<h2 style="font-family:Arial;font-size:${p.fs}px;color:${p.color};text-align:${p.align};font-weight:${p.bold ? 800 : 400};padding:20px 36px 10px;margin:0;line-height:1.2">${p.text}</h2>`;
      case "button": return `<div style="text-align:${p.align};padding:16px 36px"><a href="${p.url}" style="display:inline-block;background:${p.bg};color:${p.tc};font-family:Arial;font-size:15px;font-weight:700;padding:13px 30px;border-radius:${p.radius}px;text-decoration:none">${p.text}</a></div>`;
      case "image": return `<div style="padding:0"><img src="${p.src}" alt="${p.alt}" style="width:100%;display:block;border-radius:${p.radius}px" /></div>`;
      case "divider": return `<div style="padding:16px 36px"><hr style="border:none;border-top:${p.thick}px ${p.style} ${p.color};margin:0" /></div>`;
      case "spacer": return `<div style="height:${p.h}px">&nbsp;</div>`;
      case "footer": return `<div style="background:${p.bg};text-align:center;padding:24px 32px"><p style="font-family:Arial;font-size:12px;color:${p.color};margin:0 0 4px;font-weight:700">${p.co}</p><p style="font-family:Arial;font-size:12px;color:${p.color};margin:0 0 10px">${p.addr}</p><a href="#" style="font-family:Arial;font-size:12px;color:${p.color}">${p.unsub}</a></div>`;
      default: return "";
    }
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${cam.subject || "Email"}</title></head><body style="margin:0;background:#eeeef8"><table width="100%" style="background:#eeeef8" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 12px"><table width="600" style="max-width:600px;width:100%;background:#fff;border-radius:10px;overflow:hidden"><tr><td>${rows}</td></tr></table></td></tr></table></body></html>`;
}

// ── CANVAS PREVIEW ────────────────────────────────────────────
function BlockPreview({ b, sel, onSel, onDel, onUp, onDn, mobile }) {
  const p = b.p;
  const body = () => {
    switch (b.type) {
      case "hero": return <div style={{ background: p.bg, padding: "40px 24px", textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: p.tc, marginBottom: 8, lineHeight: 1.2 }}>{p.title}</div><div style={{ fontSize: 14, color: p.sc, marginBottom: 18, lineHeight: 1.5 }}>{p.sub}</div>{p.showBtn && <span style={{ display: "inline-block", background: p.btnBg, color: p.btnTc, padding: "10px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>{p.btn}</span>}</div>;
      case "text": return <div style={{ padding: "8px 24px" }}><p style={{ fontSize: p.fs, color: p.color, textAlign: p.align, lineHeight: 1.65, margin: 0 }}>{p.body}</p></div>;
      case "heading": return <div style={{ padding: "16px 24px 8px" }}><div style={{ fontSize: p.fs, color: p.color, textAlign: p.align, fontWeight: p.bold ? 800 : 400, lineHeight: 1.2 }}>{p.text}</div></div>;
      case "button": return <div style={{ padding: "14px 24px", textAlign: p.align }}><span style={{ display: "inline-block", background: p.bg, color: p.tc, padding: "11px 26px", borderRadius: p.radius, fontWeight: 700, fontSize: 14 }}>{p.text}</span></div>;
      case "image": return <div><img src={p.src} alt={p.alt} style={{ width: "100%", display: "block", borderRadius: p.radius }} onError={e => { e.target.src = "https://placehold.co/600x200/1a1a2e/ffffff?text=Image"; }} /></div>;
      case "divider": return <div style={{ padding: "12px 24px" }}><hr style={{ border: "none", borderTop: `${p.thick}px ${p.style} ${p.color}`, margin: 0 }} /></div>;
      case "spacer": return <div style={{ height: p.h, background: "repeating-linear-gradient(45deg,#f0f0ff 0,#f0f0ff 2px,transparent 2px,transparent 8px)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, color: "#aab", background: "rgba(255,255,255,.9)", padding: "1px 7px", borderRadius: 8 }}>{p.h}px</span></div>;
      case "footer": return <div style={{ background: p.bg, textAlign: "center", padding: "20px 24px" }}><div style={{ fontSize: 12, color: p.color, fontWeight: 700, marginBottom: 3 }}>{p.co}</div><div style={{ fontSize: 12, color: p.color, marginBottom: 8 }}>{p.addr}</div><span style={{ fontSize: 12, color: p.color, textDecoration: "underline" }}>{p.unsub}</span></div>;
      default: return null;
    }
  };
  const sz = mobile ? 36 : 26;
  return (
    <div onClick={e => { e.stopPropagation(); onSel(); }}
      style={{ position: "relative", outline: sel ? `2px solid ${C.amber}` : "2px solid transparent", outlineOffset: -1, cursor: "pointer", background: "#fff" }}>
      {body()}
      {sel && <div style={{ position: "absolute", top: 0, left: 0, background: C.amber, color: "#111", fontSize: 9, fontWeight: 800, padding: "2px 7px", textTransform: "uppercase", letterSpacing: .5, zIndex: 4 }}>{DEFS[b.type].label}</div>}
      {sel && <div style={{ position: "absolute", top: 0, right: 0, display: "flex", zIndex: 5 }}>
        {[{ i: "↑", f: onUp }, { i: "↓", f: onDn }, { i: "×", f: onDel, d: true }].map(x => (
          <button key={x.i} onClick={e => { e.stopPropagation(); x.f(); }}
            style={{ width: sz, height: sz, border: "none", background: x.d ? C.red : "#111", color: "#fff", fontSize: mobile ? 16 : 13, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {x.i}
          </button>
        ))}
      </div>}
    </div>
  );
}

// ── BOTTOM SHEET ──────────────────────────────────────────────
function Sheet({ open, onClose, title, children }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 300 }} />}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 301, background: C.bg2, borderRadius: "18px 18px 0 0", borderTop: `1px solid ${C.border2}`, transform: open ? "translateY(0)" : "translateY(105%)", transition: "transform .3s cubic-bezier(.2,1,.3,1)", maxHeight: "85vh", display: "flex", flexDirection: "column", willChange: "transform" }}>
        <div style={{ padding: "14px 18px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ width: 32, height: 4, background: C.faint, borderRadius: 2, position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)" }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: C.amber, paddingTop: 4 }}>{title}</span>
          <button onClick={onClose} style={{ width: 32, height: 32, background: C.bg3, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.muted, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>{children}</div>
      </div>
    </>
  );
}

// ── FIELD / INPUT HELPERS ─────────────────────────────────────
const inputStyle = { background: C.bg3, border: `1px solid ${C.border2}`, color: C.text, borderRadius: 8, padding: "11px 12px", fontSize: 15, width: "100%", outline: "none", fontFamily: "system-ui,sans-serif", WebkitAppearance: "none", boxSizing: "border-box" };
const taStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.5 };
function Fld({ label, children }) { return <div style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>{label}</div>{children}</div>; }
function Clr({ val, set }) {
  return <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <input type="color" value={val} onChange={e => set(e.target.value)} style={{ width: 44, height: 44, padding: 3, borderRadius: 8, border: `1px solid ${C.border2}`, background: C.bg3, cursor: "pointer", flexShrink: 0 }} />
    <input value={val} onChange={e => set(e.target.value)} style={inputStyle} />
  </div>;
}
function Sld({ label, val, set, min = 0, max = 100 }) {
  return <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.amber, fontFamily: "monospace", fontWeight: 700 }}>{val}</span>
    </div>
    <input type="range" min={min} max={max} value={val} onChange={e => set(+e.target.value)} style={{ width: "100%", accentColor: C.amber, height: 22 }} />
  </div>;
}
function Tabs({ opts, val, set }) {
  return <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 3, gap: 2 }}>
    {opts.map(o => <button key={String(o.v)} onClick={() => set(o.v)} style={{ flex: 1, padding: "9px 4px", border: "none", borderRadius: 6, background: val === o.v ? C.amber : "transparent", color: val === o.v ? "#111" : C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{o.l}</button>)}
  </div>;
}
const ALN = [{ l: "L", v: "left" }, { l: "C", v: "center" }, { l: "R", v: "right" }];

// ── BLOCK EDITOR ──────────────────────────────────────────────
function BlockEditor({ block, upd }) {
  const p = block.p;
  const s = (k, v) => upd({ ...p, [k]: v });
  switch (block.type) {
    case "hero": return <><Fld label="Headline"><textarea value={p.title} onChange={e => s("title", e.target.value)} rows={2} style={taStyle} /></Fld><Fld label="Subheadline"><textarea value={p.sub} onChange={e => s("sub", e.target.value)} rows={3} style={taStyle} /></Fld><Fld label="Background Color"><Clr val={p.bg} set={v => s("bg", v)} /></Fld><Fld label="Headline Color"><Clr val={p.tc} set={v => s("tc", v)} /></Fld><Fld label="Show Button"><Tabs opts={[{ l: "Yes", v: true }, { l: "No", v: false }]} val={p.showBtn} set={v => s("showBtn", v)} /></Fld>{p.showBtn && <><Fld label="Button Text"><input value={p.btn} onChange={e => s("btn", e.target.value)} style={inputStyle} /></Fld><Fld label="Button URL"><input value={p.btnUrl} onChange={e => s("btnUrl", e.target.value)} style={inputStyle} /></Fld><Fld label="Button Color"><Clr val={p.btnBg} set={v => s("btnBg", v)} /></Fld></>}</>;
    case "text": return <><Fld label="Text"><textarea value={p.body} onChange={e => s("body", e.target.value)} rows={6} style={taStyle} /></Fld><Sld label="Font Size" val={p.fs} set={v => s("fs", v)} min={12} max={32} /><Fld label="Alignment"><Tabs opts={ALN} val={p.align} set={v => s("align", v)} /></Fld><Fld label="Color"><Clr val={p.color} set={v => s("color", v)} /></Fld></>;
    case "heading": return <><Fld label="Text"><input value={p.text} onChange={e => s("text", e.target.value)} style={inputStyle} /></Fld><Sld label="Font Size" val={p.fs} set={v => s("fs", v)} min={14} max={60} /><Fld label="Alignment"><Tabs opts={ALN} val={p.align} set={v => s("align", v)} /></Fld><Fld label="Bold"><Tabs opts={[{ l: "Bold", v: true }, { l: "Normal", v: false }]} val={p.bold} set={v => s("bold", v)} /></Fld><Fld label="Color"><Clr val={p.color} set={v => s("color", v)} /></Fld></>;
    case "button": return <><Fld label="Button Text"><input value={p.text} onChange={e => s("text", e.target.value)} style={inputStyle} /></Fld><Fld label="URL"><input value={p.url} onChange={e => s("url", e.target.value)} style={inputStyle} placeholder="https://" /></Fld><Fld label="Alignment"><Tabs opts={ALN} val={p.align} set={v => s("align", v)} /></Fld><Fld label="Background"><Clr val={p.bg} set={v => s("bg", v)} /></Fld><Fld label="Text Color"><Clr val={p.tc} set={v => s("tc", v)} /></Fld><Sld label="Border Radius" val={p.radius} set={v => s("radius", v)} min={0} max={50} /></>;
    case "image": return <><Fld label="Image URL"><input value={p.src} onChange={e => s("src", e.target.value)} style={inputStyle} /></Fld><Fld label="Alt Text"><input value={p.alt} onChange={e => s("alt", e.target.value)} style={inputStyle} /></Fld><Sld label="Border Radius" val={p.radius} set={v => s("radius", v)} min={0} max={32} /></>;
    case "divider": return <><Fld label="Color"><Clr val={p.color} set={v => s("color", v)} /></Fld><Sld label="Thickness" val={p.thick} set={v => s("thick", v)} min={1} max={10} /><Fld label="Style"><Tabs opts={[{ l: "Solid", v: "solid" }, { l: "Dashed", v: "dashed" }, { l: "Dotted", v: "dotted" }]} val={p.style} set={v => s("style", v)} /></Fld></>;
    case "spacer": return <Sld label="Height (px)" val={p.h} set={v => s("h", v)} min={8} max={160} />;
    case "footer": return <><Fld label="Company"><input value={p.co} onChange={e => s("co", e.target.value)} style={inputStyle} /></Fld><Fld label="Address"><input value={p.addr} onChange={e => s("addr", e.target.value)} style={inputStyle} /></Fld><Fld label="Unsubscribe Text"><input value={p.unsub} onChange={e => s("unsub", e.target.value)} style={inputStyle} /></Fld><Fld label="Background"><Clr val={p.bg} set={v => s("bg", v)} /></Fld><Fld label="Text Color"><Clr val={p.color} set={v => s("color", v)} /></Fld></>;
    default: return null;
  }
}

// ── CAMPAIGN SETTINGS FORM ────────────────────────────────────
function CampaignForm({ cam, setCam }) {
  const u = (k, v) => setCam(c => ({ ...c, [k]: v }));
  return <>
    <Fld label="Campaign Name"><input value={cam.name} onChange={e => u("name", e.target.value)} style={inputStyle} /></Fld>
    <Fld label="Subject Line"><input value={cam.subject} onChange={e => u("subject", e.target.value)} style={inputStyle} placeholder="Your subject line..." /></Fld>
    <Fld label="From Name"><input value={cam.from} onChange={e => u("from", e.target.value)} style={inputStyle} placeholder="Your Company" /></Fld>
    <Fld label="Reply-To Email"><input value={cam.email} onChange={e => u("email", e.target.value)} style={inputStyle} placeholder="hello@company.com" type="email" /></Fld>
    <Fld label="Preview Text"><input value={cam.preview} onChange={e => u("preview", e.target.value)} style={inputStyle} placeholder="Short preview shown in inbox..." /></Fld>
  </>;
}

// ── SEND PANEL ────────────────────────────────────────────────
function SendPanel({ blocks, cam, mobile, onClose }) {
  const [to, setTo] = useState("");
  const [st, setSt] = useState("idle");
  const [msg, setMsg] = useState("");
  const send = async () => {
    if (!to.trim()) return;
    setSt("busy"); setMsg("Connecting to Gmail...");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 800,
          system: "Use Gmail MCP to send emails. Send immediately.",
          messages: [{ role: "user", content: `Send email:\nTo: ${to}\nSubject: ${cam.subject || "Campaign"}\nFrom: ${cam.from}\nHTML snippet: ${toHTML(blocks, cam).slice(0, 2500)}` }],
          mcp_servers: [{ type: "url", url: "https://gmail.mcp.claude.com/mcp", name: "gmail" }]
        })
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      setMsg(d.content?.filter(x => x.type === "text").map(x => x.text).join(" ").slice(0, 200) || "Sent!");
      setSt("ok");
    } catch (e) { setSt("err"); setMsg(e.message); }
  };
  const pad = { padding: mobile ? "4px 18px 18px" : "4px 24px 24px" };
  if (st === "ok") return <div style={{ ...pad, textAlign: "center", paddingTop: 24 }}><div style={{ fontSize: 48, marginBottom: 10 }}>✅</div><div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Sent!</div><div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>{msg}</div><button onClick={onClose} style={{ ...BTN(true), padding: "13px 32px", fontSize: 15, border: "none" }}>Done</button></div>;
  if (st === "err") return <div style={{ ...pad, textAlign: "center", paddingTop: 24 }}><div style={{ fontSize: 48, marginBottom: 10 }}>❌</div><div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Failed</div><div style={{ fontSize: 12, color: C.muted, marginBottom: 20, wordBreak: "break-word" }}>{msg}</div><div style={{ display: "flex", gap: 10, justifyContent: "center" }}><button onClick={() => setSt("idle")} style={{ ...BTN(false), padding: "11px 20px", fontSize: 13, border: `1px solid ${C.border2}` }}>Retry</button><button onClick={onClose} style={{ ...BTN(false), padding: "11px 20px", fontSize: 13, border: `1px solid ${C.border2}` }}>Close</button></div></div>;
  return <div style={pad}>
    <Fld label="Send To"><input value={to} onChange={e => setTo(e.target.value)} style={inputStyle} placeholder="email@example.com" type="email" disabled={st === "busy"} /></Fld>
    <div style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>Summary</div>
      <div>Subject: <span style={{ color: C.text }}>{cam.subject || "—"}</span></div>
      <div>From: <span style={{ color: C.text }}>{cam.from || "—"}</span></div>
      <div>Blocks: <span style={{ color: C.amber, fontWeight: 700 }}>{blocks.length}</span></div>
    </div>
    {st === "busy" && <div style={{ padding: "10px 14px", background: C.bg3, borderRadius: 8, marginBottom: 14, fontSize: 13, color: C.amber }}>⏳ {msg}</div>}
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={onClose} style={{ ...BTN(false), flex: 1, padding: "13px 0", fontSize: 14, border: `1px solid ${C.border2}` }}>Cancel</button>
      <button onClick={send} disabled={st === "busy" || !to.trim()} style={{ ...BTN(!st === "busy"), flex: 2, padding: "13px 0", fontSize: 14, border: "none", background: st === "busy" ? C.amberDim : `linear-gradient(135deg,${C.amber},#ef8c00)`, color: "#111" }}>
        {st === "busy" ? "Sending..." : "🚀 Send Email"}
      </button>
    </div>
  </div>;
}

// ── PREVIEW SCREEN ────────────────────────────────────────────
function PreviewScreen({ blocks, cam, onClose, mobile }) {
  const [mode, setMode] = useState(mobile ? "mobile" : "desktop");
  const html = toHTML(blocks, cam);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#060610", zIndex: 500, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: `1px solid ${C.border}`, background: C.bg2, gap: 8, flexShrink: 0 }}>
        {!mobile && <>
          <button onClick={() => setMode("desktop")} style={{ ...BTN(mode === "desktop"), padding: "7px 14px", fontSize: 12, border: "none" }}>🖥 Desktop</button>
          <button onClick={() => setMode("mobile")} style={{ ...BTN(mode === "mobile"), padding: "7px 14px", fontSize: 12, border: "none" }}>📱 Mobile</button>
        </>}
        <div style={{ flex: 1, fontSize: 12, color: C.muted, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cam.subject || "Preview"}</div>
        <button onClick={onClose} style={{ ...BTN(false), padding: "7px 14px", fontSize: 13, border: `1px solid ${C.border2}` }}>✕ Close</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: mobile ? 0 : 20, background: "#060610" }}>
        <div style={{ width: mobile ? "100%" : mode === "mobile" ? 390 : 650, background: "#eeeef8", borderRadius: mobile ? 0 : 10, overflow: "hidden", boxShadow: mobile ? "none" : "0 8px 40px rgba(0,0,0,.5)", transition: "width .3s" }}>
          <iframe srcDoc={html} style={{ width: "100%", border: "none", height: "calc(100vh - 50px)", display: "block" }} title="preview" />
        </div>
      </div>
    </div>
  );
}

// ── STATS / CAMPAIGNS / CONTACTS SCREENS ─────────────────────
const MOCK = [
  { id: 1, name: "March Newsletter", sub: "Spring Updates 🌸", st: "sent", or: 23.1, cr: 6.3, date: "Mar 15" },
  { id: 2, name: "Product Launch", sub: "Introducing Our Biggest Feature", st: "sent", or: 35.2, cr: 10.7, date: "Mar 8" },
  { id: 3, name: "Q1 Recap", sub: "What We Built Together", st: "draft", or: 0, cr: 0, date: "Mar 17" },
  { id: 4, name: "Welcome Series", sub: "Welcome to the family 👋", st: "sent", or: 41.3, cr: 12.8, date: "Mar 1" },
];
const CONTACTS = [
  { n: "Sarah Johnson", e: "sarah@example.com", ok: true, op: 42 },
  { n: "Mike Chen", e: "mike@techco.com", ok: true, op: 87 },
  { n: "Emma Williams", e: "emma@design.io", ok: false, op: 12 },
  { n: "James R.", e: "james@startup.co", ok: true, op: 63 },
  { n: "Lisa Park", e: "lisa@co.com", ok: true, op: 91 },
];
function Campaigns({ onNew }) {
  return <div style={{ flex: 1, overflow: "auto", padding: "20px 14px 90px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div><div style={{ fontSize: 20, fontWeight: 800 }}>Campaigns</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Your email history</div></div>
      <button onClick={onNew} style={{ ...BTN(true), padding: "10px 16px", fontSize: 13, border: "none" }}>+ New</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
      {[["25.5K", "Sent", C.amber], ["31.2%", "Avg Opens", C.green], ["10.4%", "Avg Clicks", C.blue], ["4", "Campaigns", C.purple]].map(([v, l, c]) => (
        <div key={l} style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border2}` }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: c, marginBottom: 2 }}>{v}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border2}`, overflow: "hidden" }}>
      {MOCK.map(c => (
        <div key={c.id} style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: c.st === "sent" ? 8 : 0 }}>
            <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.sub}</div>
            </div>
            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 800, background: c.st === "sent" ? "rgba(34,197,94,.15)" : "rgba(245,158,11,.15)", color: c.st === "sent" ? C.green : C.amber, flexShrink: 0, alignSelf: "flex-start" }}>{c.st.toUpperCase()}</span>
          </div>
          {c.st === "sent" && <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Opens <b style={{ color: C.green }}>{c.or}%</b></span>
            <span style={{ fontSize: 11, color: C.muted }}>Clicks <b style={{ color: C.blue }}>{c.cr}%</b></span>
            <span style={{ fontSize: 11, color: C.faint, marginLeft: "auto" }}>{c.date}</span>
          </div>}
        </div>
      ))}
    </div>
  </div>;
}
function Contacts() {
  const [q, setQ] = useState("");
  const list = CONTACTS.filter(c => c.n.toLowerCase().includes(q.toLowerCase()) || c.e.includes(q));
  return <div style={{ flex: 1, overflow: "auto", padding: "20px 14px 90px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <div><div style={{ fontSize: 20, fontWeight: 800 }}>Contacts</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{CONTACTS.length} subscribers</div></div>
      <button style={{ ...BTN(true), padding: "10px 16px", fontSize: 13, border: "none" }}>+ Import</button>
    </div>
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍  Search..." style={{ ...inputStyle, marginBottom: 14 }} />
    <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border2}`, overflow: "hidden" }}>
      {list.map((c, i) => (
        <div key={i} style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.amber}33,${C.blue}33)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: C.amber, flexShrink: 0 }}>{c.n[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.n}</div>
            <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.e}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 9, fontWeight: 800, background: c.ok ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)", color: c.ok ? C.green : C.red }}>{c.ok ? "SUB" : "UNSUB"}</span>
            <span style={{ fontSize: 11, color: C.muted }}>{c.op} opens</span>
          </div>
        </div>
      ))}
    </div>
  </div>;
}
function Analytics() {
  const Bar = ({ data, color }) => {
    const mx = Math.max(...data);
    return <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 70 }}>
      {data.map((v, i) => <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", height: `${(v / mx) * 100}%`, background: `linear-gradient(to top,${color},${color}55)`, borderRadius: "3px 3px 0 0", minHeight: 4 }} />
        </div>
        <div style={{ fontSize: 9, color: C.muted, fontFamily: "monospace" }}>{v}%</div>
      </div>)}
    </div>;
  };
  return <div style={{ flex: 1, overflow: "auto", padding: "20px 14px 90px" }}>
    <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Analytics</div>
    <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Performance overview</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border2}` }}><div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>📬 Open Rates</div><Bar data={[22, 35, 28, 42, 31]} color={C.amber} /></div>
      <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border2}` }}><div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>🖱 Click Rates</div><Bar data={[6, 10, 8, 15, 11]} color={C.blue} /></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[["25.5K", "Delivered", C.amber, "+12%"], ["7.9K", "Opens", C.green, "+18%"], ["2.6K", "Clicks", C.blue, "+26%"], ["89", "Unsubs", C.red, "-5%"]].map(([v, l, c, ch]) => (
        <div key={l} style={{ background: C.card, borderRadius: 12, padding: "14px", border: `1px solid ${C.border2}` }}>
          <div style={{ fontSize: 23, fontWeight: 800, color: c, marginBottom: 2 }}>{v}</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{l}</div>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>{ch} this month</div>
        </div>
      ))}
    </div>
  </div>;
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [mobile, setMobile] = useState(isMobileDevice);
  useEffect(() => { const fn = () => setMobile(window.innerWidth < 700); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);

  const [blocks, setBlocks] = useState(INIT);
  const [selId, setSelId] = useState(null);
  const [view, setView] = useState("editor");
  const [cam, setCam] = useState({ name: "New Campaign", subject: "Your Subject Here", from: "Your Company", email: "hello@co.com", preview: "" });

  // history
  const hist = useRef([INIT]);
  const hi = useRef(0);
  const push = nb => { hist.current = hist.current.slice(0, hi.current + 1).concat([nb]); hi.current = hist.current.length - 1; setBlocks(nb); };
  const undo = () => { if (hi.current > 0) { hi.current--; setBlocks(hist.current[hi.current]); } };

  // mobile sheets
  const [sheetBlocks, setSheetBlocks] = useState(false);
  const [sheetProp, setSheetProp] = useState(false);
  const [sheetCam, setSheetCam] = useState(false);
  const [sheetSend, setSheetSend] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // desktop drag
  const dSrc = useRef(null);
  const dType = useRef(null);
  const dId = useRef(null);
  const [dOver, setDOver] = useState(null);
  const [dActive, setDActive] = useState(null);

  const sel = blocks.find(b => b.id === selId) || null;
  const updSel = np => selId && setBlocks(prev => prev.map(b => b.id === selId ? { ...b, p: np } : b));
  const addBlock = t => { const b = mkBlock(t); push([...blocks, b]); setSelId(b.id); setSheetBlocks(false); if (mobile) setTimeout(() => setSheetProp(true), 80); };
  const delBlock = id => { push(blocks.filter(b => b.id !== id)); if (selId === id) { setSelId(null); setSheetProp(false); } };
  const moveUp = idx => { if (idx < 1) return; const nb = [...blocks]; [nb[idx - 1], nb[idx]] = [nb[idx], nb[idx - 1]]; push(nb); };
  const moveDown = idx => { if (idx >= blocks.length - 1) return; const nb = [...blocks]; [nb[idx], nb[idx + 1]] = [nb[idx + 1], nb[idx]]; push(nb); };

  useEffect(() => {
    const fn = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if (e.key === "Escape") { setSelId(null); setSheetProp(false); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const dropBlock = (e, idx) => {
    e.preventDefault(); setDOver(null); setDActive(null);
    if (dSrc.current === "palette") {
      const b = mkBlock(dType.current); const nb = [...blocks]; nb.splice(idx, 0, b); push(nb); setSelId(b.id);
    } else if (dSrc.current === "canvas") {
      const from = blocks.findIndex(b => b.id === dId.current); if (from < 0 || from === idx) return;
      const nb = [...blocks]; const [m] = nb.splice(from, 1); nb.splice(idx > from ? idx - 1 : idx, 0, m); push(nb);
    }
    dSrc.current = null;
  };

  // shared canvas
  const Canvas = () => (
    <div style={{ background: "#fff", borderRadius: "0 0 10px 10px", border: `1px solid ${C.border}`, borderTop: "none", overflow: "hidden", minHeight: 120 }}
      onClick={() => setSelId(null)} onDragOver={e => e.preventDefault()} onDrop={e => dropBlock(e, blocks.length)}>
      {blocks.length === 0
        ? <div style={{ height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            onDragOver={e => e.preventDefault()} onDrop={e => dropBlock(e, 0)}>
            <div style={{ fontSize: 30, opacity: .12, marginBottom: 6 }}>✉</div>
            <div style={{ fontSize: 13, color: C.muted }}>{mobile ? "Tap + to add blocks" : "Drag blocks from the left panel"}</div>
          </div>
        : <>
          {blocks.map((block, idx) => (
            <div key={block.id}>
              <div onDragOver={e => { e.preventDefault(); setDOver(idx); }} onDrop={e => dropBlock(e, idx)} onDragLeave={() => setDOver(null)}
                style={{ height: dOver === idx ? 6 : 2, background: dOver === idx ? C.amber : "transparent", transition: "all .1s", borderRadius: 3 }} />
              <BlockPreview b={block} sel={selId === block.id} mobile={mobile}
                onSel={() => { setSelId(block.id); if (mobile) setSheetProp(true); }}
                onDel={() => delBlock(block.id)}
                onUp={() => moveUp(idx)} onDn={() => moveDown(idx)}
                onDragStart={() => { dSrc.current = "canvas"; dId.current = block.id; setDActive(block.id); }}
                onDragEnd={() => { setDActive(null); setDOver(null); }}
                isDragging={dActive === block.id} />
            </div>
          ))}
          <div onDragOver={e => { e.preventDefault(); setDOver(blocks.length); }} onDrop={e => dropBlock(e, blocks.length)} onDragLeave={() => setDOver(null)}
            style={{ height: dOver === blocks.length ? 6 : 14, background: dOver === blocks.length ? C.amber : "transparent", transition: "all .1s", borderRadius: 3 }} />
        </>}
    </div>
  );

  const topBar = (
    <div style={{ height: 50, display: "flex", alignItems: "center", padding: "0 12px", background: C.bg2, borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 8, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${C.amber},${C.red})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✉</div>
        <span style={{ fontWeight: 800, fontSize: 16 }}>BlastMail</span>
      </div>
      <div style={{ flex: 1 }} />
      {view === "editor" && <>
        <button onClick={undo} title="Undo" style={{ ...BTN(false), width: 36, height: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>↩</button>
        <button onClick={() => setShowPreview(true)} style={{ ...BTN(false), padding: "0 12px", height: 36, fontSize: 13, border: `1px solid ${C.border2}` }}>👁</button>
        {mobile
          ? <button onClick={() => setSheetSend(true)} style={{ ...BTN(true), padding: "0 14px", height: 36, fontSize: 13, border: "none" }}>🚀 Send</button>
          : <>
            <button onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([toHTML(blocks, cam)], { type: "text/html" })); a.download = `${cam.name || "email"}.html`; a.click(); }}
              style={{ ...BTN(false), padding: "0 12px", height: 36, fontSize: 13, border: `1px solid ${C.border2}` }}>⬇ Export</button>
            <button onClick={() => setSheetSend(true)} style={{ ...BTN(true), padding: "0 16px", height: 36, fontSize: 13, border: "none" }}>🚀 Send</button>
          </>}
      </>}
    </div>
  );

  // ── MOBILE ─────────────────────────────────────────────────
  if (mobile) {
    const NAV = [{ id: "editor", icon: "✏", l: "Editor" }, { id: "campaigns", icon: "📋", l: "Campaigns" }, { id: "contacts", icon: "👥", l: "Contacts" }, { id: "analytics", icon: "📊", l: "Stats" }];
    return (
      <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "system-ui,-apple-system,sans-serif", overflow: "hidden" }}>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}input,textarea{-webkit-appearance:none;appearance:none}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.faint};border-radius:2px}`}</style>
        {topBar}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {view === "editor"
            ? <div style={{ flex: 1, overflow: "auto", background: "#060610", padding: "10px 10px 90px", WebkitOverflowScrolling: "touch" }}>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "10px 10px 0 0", padding: "10px 14px", display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cam.subject || <span style={{ color: C.faint, fontStyle: "italic", fontWeight: 400 }}>No subject set</span>}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>From: {cam.from || "—"}</div>
                  </div>
                  <button onClick={() => setSheetCam(true)} style={{ ...BTN(false), padding: "7px 12px", fontSize: 11, border: `1px solid ${C.border2}` }}>⚙ Edit</button>
                </div>
                <Canvas />
                <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.faint }}>{blocks.length} block{blocks.length !== 1 ? "s" : ""} · tap a block to edit</div>
              </div>
            : view === "campaigns" ? <Campaigns onNew={() => setView("editor")} />
            : view === "contacts" ? <Contacts />
            : <Analytics />}
        </div>

        {/* Bottom Nav */}
        <div style={{ flexShrink: 0, background: C.bg2, borderTop: `1px solid ${C.border}`, paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
          <div style={{ display: "flex", height: 58 }}>
            {NAV.map(t => (
              <button key={t.id} onClick={() => setView(t.id)}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", color: view === t.id ? C.amber : C.faint, WebkitTapHighlightColor: "transparent" }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>{t.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAB */}
        {view === "editor" && (
          <button onClick={() => setSheetBlocks(true)}
            style={{ position: "fixed", right: 16, bottom: `calc(58px + env(safe-area-inset-bottom,0px) + 12px)`, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${C.amber},#ef8c00)`, border: "none", color: "#111", fontSize: 26, fontWeight: 800, boxShadow: `0 4px 20px ${C.amber}55`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99, WebkitTapHighlightColor: "transparent" }}>+</button>
        )}

        <Sheet open={sheetBlocks} onClose={() => setSheetBlocks(false)} title="Add Block">
          <div style={{ padding: "4px 16px 8px" }}>
            {CATS.map(cat => {
              const items = Object.entries(DEFS).filter(([, d]) => d.cat === cat);
              if (!items.length) return null;
              return <div key={cat}>
                <div style={{ fontSize: 10, color: C.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, padding: "14px 0 8px" }}>{cat}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {items.map(([type, d]) => (
                    <button key={type} onClick={() => addBlock(type)}
                      style={{ padding: "14px 12px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, color: C.text, textAlign: "left", width: "100%", WebkitTapHighlightColor: "transparent" }}>
                      <span style={{ fontSize: 20 }}>{d.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>;
            })}
          </div>
        </Sheet>

        <Sheet open={sheetProp && !!sel} onClose={() => setSheetProp(false)} title={sel ? `✏ ${DEFS[sel.type]?.label}` : ""}>
          {sel && <div style={{ padding: "10px 18px" }}><BlockEditor block={sel} upd={updSel} /></div>}
        </Sheet>

        <Sheet open={sheetCam} onClose={() => setSheetCam(false)} title="⚙ Campaign Settings">
          <div style={{ padding: "10px 18px" }}><CampaignForm cam={cam} setCam={setCam} /></div>
        </Sheet>

        <Sheet open={sheetSend} onClose={() => setSheetSend(false)} title="🚀 Send Campaign">
          <SendPanel blocks={blocks} cam={cam} mobile onClose={() => setSheetSend(false)} />
        </Sheet>

        {showPreview && <PreviewScreen blocks={blocks} cam={cam} mobile onClose={() => setShowPreview(false)} />}
      </div>
    );
  }

  // ── DESKTOP ────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "system-ui,-apple-system,sans-serif", overflow: "hidden" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:${C.faint};border-radius:3px}input,textarea{outline:none}input:focus,textarea:focus{border-color:${C.amber}!important}`}</style>

      {/* TOP BAR */}
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 14px", background: C.bg2, borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginRight: 14, paddingRight: 14, borderRight: `1px solid ${C.border}` }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${C.amber},${C.red})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✉</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>BlastMail</span>
        </div>
        {[{ id: "editor", l: "✏ Editor" }, { id: "campaigns", l: "📋 Campaigns" }, { id: "contacts", l: "👥 Contacts" }, { id: "analytics", l: "📊 Analytics" }].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{ ...BTN(view === t.id), padding: "7px 13px", fontSize: 13, border: "none" }}>{t.l}</button>
        ))}
        <div style={{ flex: 1 }} />
        {view === "editor" && <>
          <button onClick={undo} style={{ ...BTN(false), width: 32, height: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }} title="Undo ⌘Z">↩</button>
          <button onClick={() => setShowPreview(true)} style={{ ...BTN(false), padding: "7px 13px", fontSize: 13, border: `1px solid ${C.border2}` }}>👁 Preview</button>
          <button onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([toHTML(blocks, cam)], { type: "text/html" })); a.download = `${cam.name || "email"}.html`; a.click(); }}
            style={{ ...BTN(false), padding: "7px 13px", fontSize: 13, border: `1px solid ${C.border2}` }}>⬇ Export</button>
          <button onClick={() => setSheetSend(true)} style={{ ...BTN(true), padding: "7px 18px", fontSize: 13, border: "none" }}>🚀 Send</button>
        </>}
      </div>

      {view !== "editor"
        ? view === "campaigns" ? <Campaigns onNew={() => setView("editor")} />
          : view === "contacts" ? <Contacts />
          : <Analytics />
        : <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* LEFT */}
            <div style={{ width: 200, background: C.bg2, borderRight: `1px solid ${C.border}`, overflow: "auto", flexShrink: 0 }}>
              <div style={{ padding: "10px 12px 4px", fontSize: 9, fontWeight: 800, color: C.faint, textTransform: "uppercase", letterSpacing: 1.2 }}>Blocks</div>
              {CATS.map(cat => {
                const items = Object.entries(DEFS).filter(([, d]) => d.cat === cat);
                if (!items.length) return null;
                return <div key={cat}>
                  <div style={{ padding: "7px 12px 3px", fontSize: 9, color: C.faint, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{cat}</div>
                  {items.map(([type, d]) => (
                    <div key={type} draggable onDragStart={() => { dSrc.current = "palette"; dType.current = type; }}
                      onDoubleClick={() => addBlock(type)}
                      style={{ margin: "2px 8px", padding: "7px 10px", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "grab", display: "flex", alignItems: "center", gap: 8, color: "#b0b0d0", userSelect: "none", transition: "all .12s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = `${C.amber}44`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.bg3; e.currentTarget.style.borderColor = C.border; }}>
                      <span style={{ fontSize: 14 }}>{d.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{d.label}</span>
                    </div>
                  ))}
                </div>;
              })}
              <div style={{ margin: "8px 8px 14px", padding: 10, background: C.bg, borderRadius: 8, border: `1px dashed ${C.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.faint, lineHeight: 1.5 }}>Drag or double-click to add</div>
              </div>
            </div>

            {/* CANVAS */}
            <div style={{ flex: 1, overflow: "auto", background: "#050510", padding: "16px 12px" }} onClick={() => setSelId(null)}
              onDragOver={e => e.preventDefault()} onDrop={e => dropBlock(e, blocks.length)}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 12px", fontSize: 11, color: C.faint }}>600px · {blocks.length} blocks · ⌘Z undo</div>
              </div>
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: "10px 10px 0 0", padding: "10px 16px" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>From: {cam.from} &lt;{cam.email}&gt;</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{cam.subject || <span style={{ color: C.faint, fontStyle: "italic", fontWeight: 400 }}>No subject set</span>}</div>
                </div>
                <Canvas />
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ width: 260, background: C.bg2, borderLeft: `1px solid ${C.border}`, overflow: "auto", flexShrink: 0 }}>
              <div style={{ padding: "9px 14px", borderBottom: `1px solid ${C.border}`, fontSize: 9, fontWeight: 800, color: C.faint, textTransform: "uppercase", letterSpacing: 1.2 }}>
                {sel ? `${DEFS[sel.type]?.label} · Edit` : "Campaign Settings"}
              </div>
              <div style={{ padding: "16px 14px" }}>
                {sel
                  ? <><div style={{ fontSize: 11, fontWeight: 800, color: C.amber, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>✏ {DEFS[sel.type]?.label}</div><BlockEditor block={sel} upd={updSel} /></>
                  : <CampaignForm cam={cam} setCam={setCam} />}
              </div>
            </div>
          </div>}

      {sheetSend && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }} onClick={() => setSheetSend(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 14, width: 440, maxWidth: "92vw", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 12px", borderBottom: `1px solid ${C.border}` }}><div style={{ fontSize: 18, fontWeight: 800 }}>🚀 Send Campaign</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{cam.subject || "No subject"} · {blocks.length} blocks</div></div>
            <SendPanel blocks={blocks} cam={cam} mobile={false} onClose={() => setSheetSend(false)} />
          </div>
        </div>
      )}
      {showPreview && <PreviewScreen blocks={blocks} cam={cam} mobile={false} onClose={() => setShowPreview(false)} />}
    </div>
  );
}
