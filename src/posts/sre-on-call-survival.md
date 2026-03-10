---
title: "SRE On-Call Survival Guide: What Nobody Tells You"
excerpt: "Pagerduty at 3am, cascading failures, and why your runbooks are probably lying to you."
publishedAt: "2025-01-20"
readTime: 8
category: career
tags: [SRE, On-call, Incident Response, DevOps]
language: en
slug: sre-on-call-survival
---

I've been on-call at AWS and at Cathay Financial Holdings. The war stories are different, the core lessons are the same.

## The First Page is Always the Worst

Your adrenaline spikes. You open Slack and there are 47 messages. The dashboard is red. You have no idea where to start.

Here's the move: **breathe, then triage by blast radius**.

Which customers are affected? Is this spreading or stable? Can we mitigate without a full fix?

The biggest on-call mistake I see is engineers jumping to root cause before they've contained the blast.

## Your Runbooks Are Lying

Most runbooks are written by the person who built the system, right after they built it, when everything made sense to them. Six months later, the system has drifted, the runbook hasn't.

**Runbook hygiene rules I follow:**
- Update the runbook during the post-incident review, not after
- If a step took more than 10 minutes to figure out, document why
- Add a "last verified" date — stale runbooks are worse than no runbooks

## Observability > Monitoring

Monitoring tells you *something is wrong*. Observability tells you *why*.

If you're only looking at CPU/memory dashboards, you're flying blind. You need:
- Structured logs with correlation IDs
- Distributed traces across service boundaries
- Business-level metrics (error rate per customer, not just system-wide)

## The Post-Incident Review

This is where the real learning happens — and where most teams waste it.

A good PIR is blameless, specific, and actionable. A bad PIR is a blame session dressed up with bullet points.

The question is never "who did this?" It's "what conditions made this possible?"

## You Will Page Someone at 3am

You'll be the one calling a database admin on a Saturday. Be kind. Have your context ready. Know what you need before you dial.

The on-call rotation is a team sport.
