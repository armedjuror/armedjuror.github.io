---
title: "API Performance Tip: Reduce the distance."
date: 2024-06-27
draft: false
---
Every millisecond counts. Fast apps delight users, boost retention, and win in competitive markets.

Speed is simple: `Speed = Distance / Time`. To go faster, cover the same distance in less time — or reduce the distance itself. Software performance follows the same logic. Every unnecessary operation is distance you don't need to travel.

This is the story of how we took a slow API endpoint and eliminated most of its work entirely.

## The Problem

An API to list all objects in a bucket, paginated. S3's List API returns `n` objects per call with a continuation token. Our app page size is `m`, and `m ≠ n`. 

The original dev's workaround: fetch *everything* from S3 on every request, hand it all to paginator function, slice the right page. Every. Single. Request.

```
  USER              SERVER                  S3
   │                   │                    │
   │── page request ──►│                    │
   │                   │─ list_objects() ──►│
   │                   │◄── 1,000 objs ─────│
   │                   │─ list_objects() ──►│
   │                   │◄── 1,000 objs ─────│
   │                   │─ list_objects() ──►│
   │                   │◄── 1,000 objs ─────│
   │                   │      × N calls     │
   │◄─── page slice ───│                    │
```

If bucket size is `N` and S3 returns `n` per call, every page request fires `q = N/n` S3 calls. Service time = `q × t`. **O(q) per request** — and q grows with the bucket size.

## Strategy

Before solving, here's what we need:
1. **Low service time** — at least not a bad experience.
2. **Reliable data** — listing should be trustworthy.
3. **Discoverable decisions** — if a user asks "was an object added mid-session listed?", we should have a clean yes/no without deep digging.

**Strategy 1 — Pass S3 Continuation Token** — Carry the continuation token in request context; fetch one S3 page per app request. Cleaner, but useless for arbitrary page jumps — you still have to walk the chain from the beginning. 

**Strategy 2 — Cache the S3 Listing** — Fetch once, store it, serve from storage for subsequent requests.

**Two questions:**
 
*Can we store it forever?* No — that shifts source of truth from S3 to local data. We cache for a bounded time and re-fetch when stale.
 
*Where?* Somewhere with **O(1) reads**. 

Three options: 

**Global variable** — works with one worker. Falls apart with multiple workers (isolated memory, no sharing). Manual expiry needed. Non-scalable.

**Database** — persistent, shareable. But reads aren't O(1), entries pile up, cleanup routines needed. Better, but not ideal.
 
**Redis** — purpose-built for this. Fast O(1) reads/writes, separate layer so no scaling issues, and native TTL. 
 
Redis expiry is especially clever: lazy deletion on key access + a background random sweep for untouched expired keys. No memory bloat, no manual cleanup. It also supports clustering and disk persistence (RDB snapshots or append-only logs) for fault tolerance.

## The Solution

Redis with session-aligned expiry.

1. On the first request in a session, fetch all objects from S3, serialize them, and store in Redis with a TTL equal to the session duration.
2. On every subsequent request, read directly from Redis — a sub-millisecond operation.

```
  first request

  USER              SERVER          REDIS              S3
   │                   │              │                 │
   │── page request ──►│              │                 │
   │                   │─ list_objects() ──────────────►│
   │                   │◄──────────── all objs ─────────│
   │                   │─ SET (TTL) ─►│                 │
   │◄─── page slice ───│              │                 │


  subsequent requests

  USER              SERVER          REDIS              S3
   │                   │              │                 │
   │── page request ──►│              │                 │
   │                   │─── GET ─────►│                 │
   │                   │◄── cached ───│                 │
   │◄─── page slice ───│              │                 │
```

S3 is hit exactly once per session. A user browsing 20 pages goes from `20×q` S3 calls to `q + 19` Redis reads. At scale, that's orders of magnitude.

**Before:** O(q) per request, q growing with bucket size.  
**After:** O(1) per request for every request after the first.

The first request still pays the O(q) cost — but it's deferred and amortized across the session, not repeated on every page.

## The Broader Principle

Caching is often framed as a performance optimization. It's more useful to think of it as **work elimination**. Every cache hit is work that never happened. The goal isn't to do the same work faster — it's to stop doing it repeatedly.

When you're looking at a slow endpoint, ask: *is this work necessary on every request?* The answer is often no.

Reduce the distance.