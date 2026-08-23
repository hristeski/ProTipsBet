"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Trophy, Calendar, ChevronUp, ChevronDown, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "@/lib/api";

export interface LightboxLeg {
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
}

export interface LightboxTicket {
  id: number;
  imageUrl: string;
  description: string;
  totalOdds: number;
  matchDate: string;
  isVip?: boolean;
  legs?: LightboxLeg[];
}

interface TicketLightboxProps {
  tickets: LightboxTicket[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const STEP = 0.5;
const SWIPE_THRESHOLD = 90;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function TicketLightbox({ tickets, index, onIndexChange, onClose }: TicketLightboxProps) {
  const ticket = tickets[index];

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const mode = useRef<"none" | "pan" | "swipe">("none");

  const applyTransform = useCallback((withTransition: boolean) => {
    if (!imgRef.current) return;
    imgRef.current.style.transition = withTransition ? "transform 220ms cubic-bezier(0.2,0.8,0.2,1)" : "none";
    imgRef.current.style.transform = `translate(${offsetRef.current.x}px, ${offsetRef.current.y}px) scale(${imgRef.current.dataset.scale || 1})`;
  }, []);

  const setScaleAndTransform = useCallback((next: number, withTransition: boolean, keepOffset = false) => {
    const clamped = clamp(Math.round(next * 100) / 100, MIN_SCALE, MAX_SCALE);
    if (imgRef.current) imgRef.current.dataset.scale = String(clamped);
    if (!keepOffset || clamped <= 1) offsetRef.current = { x: 0, y: 0 };
    applyTransform(withTransition);
    setScale(clamped);
  }, [applyTransform]);

  // Lock body scroll while the viewer is open
  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, []);

  // Hard-block native pinch-zoom on mobile browsers so it can't fight our own zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    el.addEventListener("touchmove", preventMultiTouch, { passive: false });
    el.addEventListener("touchstart", preventMultiTouch, { passive: false });
    return () => {
      el.removeEventListener("touchmove", preventMultiTouch);
      el.removeEventListener("touchstart", preventMultiTouch);
    };
  }, []);

  // Reset zoom/pan/details whenever the ticket changes
  useEffect(() => {
    setScaleAndTransform(1, false);
    setDetailsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const showPrev = useCallback(() => {
    onIndexChange((index - 1 + tickets.length) % tickets.length);
  }, [index, tickets.length, onIndexChange]);

  const showNext = useCallback(() => {
    onIndexChange((index + 1) % tickets.length);
  }, [index, tickets.length, onIndexChange]);

  const zoomIn = () => setScaleAndTransform(scale + STEP, true, true);
  const zoomOut = () => setScaleAndTransform(scale - STEP, true, true);
  const resetZoom = () => setScaleAndTransform(1, true);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && scale <= 1) showPrev();
      if (e.key === "ArrowRight" && scale <= 1) showNext();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-" || e.key === "_") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, showPrev, showNext, scale]);

  // Gentle wheel zoom — small, capped step per tick so it can't run away
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rawDelta = -e.deltaY * 0.0008;
    const delta = clamp(rawDelta, -0.12, 0.12);
    setScaleAndTransform(scale + delta, false, true);
  };

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

  const clampPan = (x: number, y: number, s: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || s <= 1) return { x: 0, y: 0 };
    const maxX = (rect.width * (s - 1)) / (2 * s);
    const maxY = (rect.height * (s - 1)) / (2 * s);
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    containerRef.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    applyTransform(false);

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinchStart.current = { dist: dist(a, b), scale };
      dragStart.current = null;
      mode.current = "none";
    } else if (pointers.current.size === 1) {
      if (scale > 1.01) {
        mode.current = "pan";
        dragStart.current = { x: e.clientX, y: e.clientY, offsetX: offsetRef.current.x, offsetY: offsetRef.current.y };
      } else {
        mode.current = "swipe";
        dragStart.current = { x: e.clientX, y: e.clientY, offsetX: 0, offsetY: 0 };
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = Array.from(pointers.current.values());
      const newDist = dist(a, b);
      // Damped ratio — raw pinch ratio feels too twitchy on phones
      const rawRatio = newDist / pinchStart.current.dist;
      const dampedRatio = 1 + (rawRatio - 1) * 0.7;
      const next = clamp(pinchStart.current.scale * dampedRatio, MIN_SCALE, MAX_SCALE);
      if (imgRef.current) imgRef.current.dataset.scale = String(next);
      applyTransform(false);
      setScale(next);
      return;
    }

    if (pointers.current.size === 1 && dragStart.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      if (mode.current === "pan") {
        const raw = { x: dragStart.current.offsetX + dx / scale, y: dragStart.current.offsetY + dy / scale };
        offsetRef.current = clampPan(raw.x, raw.y, scale);
        applyTransform(false);
      } else if (mode.current === "swipe") {
        offsetRef.current = { x: dx, y: 0 };
        applyTransform(false);
      }
    }
  };

  const endInteraction = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size === 0) {
      if (mode.current === "swipe" && dragStart.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.4) {
          const rect = containerRef.current?.getBoundingClientRect();
          const flyOut = (rect?.width ?? 400) * 1.1 * (dx < 0 ? -1 : 1);
          offsetRef.current = { x: flyOut, y: 0 };
          applyTransform(true);
          if (dx < 0) showNext();
          else showPrev();
        } else {
          offsetRef.current = { x: 0, y: 0 };
          applyTransform(true);
        }
      } else if (mode.current === "pan") {
        applyTransform(true);
      }

      mode.current = "none";
      dragStart.current = null;
    }

    if (pointers.current.size < 2) pinchStart.current = null;
  };

  if (!ticket) return null;

  const isZoomed = scale > 1.01;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col select-none"
    >
      {/* Header — never moves */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <span className="text-white/70 text-xs font-bold tracking-wide pointer-events-auto">
          {tickets.length > 1 ? `${index + 1} / ${tickets.length}` : ""}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-white bg-neutral-800/80 hover:bg-neutral-700 p-2.5 rounded-full transition-colors pointer-events-auto"
        >
          <X size={20} />
        </button>
      </div>

      {/* Explicit zoom controls — always visible, never depend on gesture detection */}
      <div className="absolute top-16 right-4 z-30 flex items-center gap-0.5 bg-neutral-800/85 rounded-full px-1 py-1 pointer-events-auto">
        <button
          onClick={zoomOut}
          disabled={scale <= 1}
          aria-label="Zoom out"
          className="text-white disabled:text-white/30 p-2 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={resetZoom}
          aria-label="Reset zoom"
          className="text-white/90 text-xs font-bold w-12 text-center hover:text-white"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="text-white disabled:text-white/30 p-2 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Image viewer */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        style={{ touchAction: "none" }}
      >
        {/* eslint-disable-next-line */}
        <img
          ref={imgRef}
          key={ticket.id}
          src={`${API_BASE}${ticket.imageUrl}`}
          alt={ticket.description}
          draggable={false}
          data-scale="1"
          className="max-w-full max-h-full object-contain will-change-transform"
          style={{ cursor: isZoomed ? "grab" : "default" }}
        />

        {tickets.length > 1 && !isZoomed && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous ticket"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 text-white bg-neutral-800/60 hover:bg-neutral-700/80 p-2.5 rounded-full transition-colors z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next ticket"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 text-white bg-neutral-800/60 hover:bg-neutral-700/80 p-2.5 rounded-full transition-colors z-20"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Match legs drawer */}
      <AnimatePresence>
        {detailsOpen && ticket.legs && ticket.legs.length > 0 && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="absolute bottom-[64px] inset-x-0 z-30 max-h-[45vh] overflow-y-auto bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800 rounded-t-2xl p-4 space-y-2"
          >
            {ticket.legs.map((leg, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/50"
              >
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{leg.homeTeam}</p>
                  <p className="text-neutral-400 text-sm truncate">{leg.awayTeam}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-emerald-500/20 text-emerald-400 font-black text-xs px-2.5 py-1 rounded">
                    {leg.prediction}
                  </span>
                  <span className="text-white font-bold text-sm">@{leg.odds}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer — never moves */}
      <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 to-transparent px-4 pt-10 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white font-bold text-sm flex items-center gap-2 truncate">
              <Trophy size={14} className="text-emerald-500 shrink-0" />
              <span className="truncate">{ticket.description}</span>
            </p>
            <p className="text-neutral-400 text-xs mt-0.5 flex items-center gap-1">
              <Calendar size={11} /> {new Date(ticket.matchDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-emerald-400 font-black text-base">
              @{Number(ticket.totalOdds).toFixed(2)}
            </span>
            {ticket.legs && ticket.legs.length > 0 && (
              <button
                onClick={() => setDetailsOpen((o) => !o)}
                className="flex items-center gap-1 text-white/80 hover:text-white bg-neutral-800/70 hover:bg-neutral-700 text-xs font-bold px-2.5 py-2 rounded-lg transition-colors"
              >
                Details {detailsOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}