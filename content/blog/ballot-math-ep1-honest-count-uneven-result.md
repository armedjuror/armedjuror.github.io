---
title: "Ballot Math Ep 1: Honest count, uneven result"
date: 2026-11-12T01:00:00+05:30
draft: false
pdf: true
description: "How first-past-the-post turns votes into seats, why the same votes can give 0, 1 or 2 seats, and how the efficiency gap measures gerrymandering. Case study for Ballot Math Ep 1."
---

*Case study for the Ballot Math Ep 1 reel (keyword MAP). Figures for the 2026 US House elections are unofficial, as of 10 November 2026.*

---

## 1. The headline

In the 3 November 2026 US House elections, Democrats won about 56% of all House votes and about 60% of the seats called so far: an honest count that still does not turn votes into seats one-for-one [1][2]. Inside states the gap is wider, in both directions. In California, Democrats took about 70% of the two-party vote and 48 of 52 seats. In Texas, Democrats won the two-party vote with about 53% but took only 14 of 38 seats [1]. All 2026 figures are unofficial and uncertified; mail ballots are still being counted and a few seats are uncalled.

This case study is about why that happens under **first-past-the-post (FPTP)**: the election system that picks the candidate with the most votes in each constituency. The US House, India's Lok Sabha, Canada and the UK all use it. A winner doesn't need more than half the votes, only more than every opponent.

## 2. The math

The same 300 votes can give a party 0, 1 or 2 of 3 seats, depending only on where the constituency borders run. Every tally below comes from the series simulator (`ballot_math_sim.py`).

**The setup.** 300 people in 3 constituencies of 100. The Poetry Peeps have 112 voters (37.3%); the Physics Nerds have 188 (62.7%). Nobody changes their vote between maps.

| Map | Votes per constituency (Peeps–Nerds) | Peeps seats | Wasted: Peeps / Nerds | Efficiency gap |
| --- | --- | --- | --- | --- |
| A: pack and crack | 51–49, 51–49, 10–90 | 2 of 3 | 12 / 138 | 42.0% toward Peeps |
| B: spread evenly | 37–63, 37–63, 38–62 | 0 of 3 | 112 / 38 | 24.7% toward Nerds |
| C: one Peeps seat | 51–49, 31–69, 30–70 | 1 of 3 | 62 / 88 | 8.7% toward Peeps |

A brute-force search over every split of the Peeps' 112 voters confirms that 0, 1 and 2 seats are all reachable; 3 is not.

**How map A works.** 90 Nerds are squeezed into one constituency they win 90–10, and the remaining 98 are split across the other two, where they lose 49–51 twice. Squeezing a rival's voters into one place is called *packing*; splitting the rest so they lose narrowly everywhere is called *cracking*. Drawing borders like this to give one side an advantage is called **gerrymandering**.

**Wasted votes.** A vote is wasted if it doesn't change who wins: every vote for a loser, plus every vote a winner got beyond the 50% it needed. In map A, the Nerds waste 40 votes in their landslide (90 − 50) and 98 in their two narrow losses, 138 in all. The Peeps waste 1 + 1 in their two wins and 10 in their loss, 12 in all.

**The efficiency gap** (Stephanopoulos & McGhee 2015) turns that into one number: the difference between the two sides' wasted votes, divided by all votes cast [3].

```
efficiency gap = (wasted by Nerds − wasted by Peeps) ÷ all votes
               = (138 − 12) ÷ 300
               = 42.0%
```

**The seat–vote curve.** FPTP usually gives the vote leader a seat bonus. The old "cube law" says the seat ratio is the cube of the vote ratio: a 55% vote share would give 64.6% of seats, and 60% would give 77.1%. Tufte (1973) tested it on 132 elections in six two-party systems and rejected it as a general rule: the real curve's steepness varies by country and by map [4]. In 2026, a cube law would have predicted Democrats about 69.5% of House seats from their 56.8% two-party vote; the called seats give about 60.1%, an implied exponent of 1.49, not 3 [1].

## 3. The real case

Across the 2026 House map, seat shares sit far from vote shares in both directions, under maps drawn by both parties and by a court.

| Place | Map drawn by | Democratic share of two-party vote | Democratic share of seats | Seats (D–R) |
| --- | --- | --- | --- | --- |
| US House, national | mixed | 56.8% | 60.1% | 259–172 called |
| California | voter-approved map backed by Democrats | 70.3% | 92.3% | 48–4 |
| Texas | Republican legislature | 52.9% | 36.8% | 14–24 |
| Missouri | Republican legislature | 49.6% | 37.5% | 3–5 |
| Utah | court-ordered map | 49.8% | 25.0% | 1–3 |

*Source: Popular Vote Analytics tracker, unofficial, 10 Nov 2026 [1]; shares computed in the simulator.*

Nationally, Democrats led the House vote 64.9 million to 49.3 million (56.0% to 42.5%) with 434 of 435 districts counted, and had 259 seats called to 172 [1]. The tracker counts 10 of those calls from prediction-market odds rather than media calls; the AP count on 7 November was 254 to 162 with 19 uncalled [2]. The Gallagher disproportionality index for the national result is 3.6 (simulator).

**Mid-decade redistricting.** States normally redraw once a decade, after the census. Before 2026, the Texas, Missouri and North Carolina legislatures (Republican-led) and California voters (through Proposition 50, backed by Democratic leaders) all adopted new maps; Ohio and Utah also used new maps, Utah's ordered by a court [5][6]. Texas's map was designed to flip five seats toward Republicans; Republicans won one of those five and lost two seats they already held, ending at 24 of 38 [7]. California's map was designed to make up to five seats more favourable to Democrats, who won 48 of 52 [1][5].

The lesson is mathematical, not partisan: a map tuned for one vote level can misfire when votes swing. Cracking a rival into narrow losses only works while those losses stay narrow.

**India, same rule.** In the 2024 Lok Sabha election, the largest party won 36.56% of votes and 240 of 543 seats (44.2%) [8]. With many parties, FPTP's bonus goes to whoever leads locally, constituency by constituency.

## 4. The other side

A gap between votes and seats is not proof that anyone drew a map unfairly, and FPTP buys real things with it.

- **Geography alone creates bias.** Chen & Rodden (2013) drew many neutral, computer-generated maps and still found sizeable bias when one party's voters are concentrated in cities [9]. Some "wasted" votes come from where people live, not from where lines were drawn.
- **The efficiency gap has known blind spots.** Bernstein & Duchin (2017) show it reduces to a fixed comparison of votes to seats [10]. Map C shows the effect: the Peeps get 1 of 3 seats (33%) from 37% of votes, slightly fewer seats than votes, yet the map scores an 8.7% gap in their favour. In a two-party race with equal turnout, a zero gap needs the seat margin to be twice the vote margin.
- **US courts left it to politics.** In *Rucho v. Common Cause* (2019), the Supreme Court held 5–4 that federal courts cannot decide partisan-gerrymandering claims [11]. Limits now come from state constitutions, commissions and voters.
- **What FPTP delivers.** Every constituency has its own named representative. The winner's bonus usually produces a clear majority without coalition bargaining, as in 2026, when one party's 56% of votes became a working House majority. Counting is simple: one mark, one pile per constituency.

## 5. Scorecard (FPTP, criteria this episode touches)

No totals and no weights: which row matters most is your call.

| # | What you want | Verdict | Condition |
| --- | --- | --- | --- |
| 1 | "My vote counts" (proportionality) | Fails | Seat share tracks vote share only by luck of geography. Map A gives 67% of seats for 37% of votes; 2026 national Gallagher index 3.6; California 92% of seats from 70% of votes. |
| 11 | "Hard to rig by drawing maps" | Fails | The same votes give the Peeps 0, 1 or 2 of 3 seats by moving borders alone. Partly mitigated where independent commissions or courts draw lines, and maps can misfire under large swings (Texas 2026). |
| 8 | "I have my own representative" | Meets | One member per constituency. Scored fully in Ep 6. |
| 10 | "Decisive result" | Meets, usually | The winner's bonus turns a vote lead into a seat majority. Scored fully in Ep 6. |

## 6. Sources

Retrieved 11 November 2026 unless noted. 2026 results are unofficial.

1. Popular Vote Analytics, [2026 Midterm Popular Vote Tracker](https://popularvoteanalytics.org/), data as of 10 Nov 2026, 12:13 p.m. ET. National and state House votes and called seats.
2. Yahoo News / Associated Press, [Midterms 2026 live updates](https://www.yahoo.com/news/politics/live/midterms-2026-live-updates-election-day-voters-head-to-the-polls-as-democrats-look-to-flip-gop-control-of-the-house-and-senate-110000715.html), AP House count at 7 Nov 2026.
3. Stephanopoulos, N. O. & McGhee, E. M. (2015). [Partisan Gerrymandering and the Efficiency Gap](https://chicagounbound.uchicago.edu/journal_articles/8641). *University of Chicago Law Review* 82: 831.
4. Tufte, E. R. (1973). [The Relationship between Seats and Votes in Two-Party Systems](https://doi.org/10.2307/1958782). *American Political Science Review* 67(2): 540–554.
5. NPR, [After California's vote to counter Trump, here's where redistricting stands](https://www.npr.org/2025/11/06/nx-s1-5599558/states-redistricting-house-2026-midterm-elections), 6 Nov 2025.
6. Voting Rights Lab, [An Emerging Trend: Mid-Decade Redistricting](https://votingrightslab.org/2026/05/26/an-emerging-trend-mid-decade-redistricting/), updated 26 May 2026.
7. Texas Public Radio / Texas Tribune, [Texas Republicans' gerrymander backfires](https://www.tpr.org/government-politics/2026-11-04/texas-republicans-gerrymander-backfires-as-democrats-gain-ground-in-u-s-house-delegation), 4 Nov 2026.
8. Election Commission of India, General Election 2024 results, as reported by [The Quint fact-check](https://www.thequint.com/news/webqoof/bjp-party-wise-percentage-is-less-in-2024-than-2019-election-results-fact-check) citing ECI data.
9. Chen, J. & Rodden, J. (2013). [Unintentional Gerrymandering: Political Geography and Electoral Bias in Legislatures](https://econpapers.repec.org/RePEc:now:jlqjps:100.00012033). *Quarterly Journal of Political Science* 8(3): 239–269. DOI 10.1561/100.00012033.
10. Bernstein, M. & Duchin, M. (2017). [A formula goes to court: Partisan gerrymandering and the efficiency gap](https://arxiv.org/abs/1705.10812). *Notices of the AMS* 64(9): 1020–1024.
11. *Rucho v. Common Cause*, 588 U.S. 684 (2019); summary via [Faegre Drinker](https://www.faegredrinker.com/en/insights/publications/2019/6/supreme-court-decides-rucho-v-common-cause).
12. Simulator: `ballot_math_sim.py` (tallies, cube law, Gallagher index, shares).
