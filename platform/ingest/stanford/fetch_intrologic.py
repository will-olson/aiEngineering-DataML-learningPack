#!/usr/bin/env python3
"""Fetch Stanford Introduction to Logic (Intrologic) into local markdown mirror.

Writes under docs/stanfordLectureTranscripts/157_introToLogic/:
  README.md, INDEX.md, SOURCE.md, chapters/, lessons/, exercises/, extras/, puzzles/

Run from repo root:
  python3 platform/ingest/stanford/fetch_intrologic.py

Educational mirror of http://intrologic.stanford.edu — attribution only; not a license claim.
"""

from __future__ import annotations

import re
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

REPO = Path(__file__).resolve().parents[3]
OUT = REPO / "docs" / "stanfordLectureTranscripts" / "157_introToLogic"
BASE = "http://intrologic.stanford.edu"
UA = "aiEngineering-DataML-learningPack/intrologic-fetch (+educational mirror)"

CHAPTER_SLUGS = {
    1: "01-introduction",
    2: "02-propositional-logic",
    3: "03-propositional-analysis",
    4: "04-direct-proofs",
    5: "05-natural-deduction",
    6: "06-resolution-proofs",
    7: "07-relational-logic",
    8: "08-relational-analysis",
    9: "09-model-checking",
    10: "10-fitch-proofs-relational",
    11: "11-term-logic",
    12: "12-fitch-proofs-term",
    13: "13-induction",
    14: "14-resolution",
    15: "15-equality",
    16: "16-first-order-logic",
    17: "17-conclusion",
}

CHAPTER_TITLES = {
    1: "Introduction",
    2: "Propositional Logic",
    3: "Propositional Analysis",
    4: "Direct Proofs",
    5: "Natural Deduction",
    6: "Resolution Proofs",
    7: "Relational Logic",
    8: "Relational Analysis",
    9: "Model Checking",
    10: "Fitch Proofs (Relational)",
    11: "Term Logic",
    12: "Fitch Proofs (Term)",
    13: "Induction",
    14: "Resolution",
    15: "Equality",
    16: "First-Order Logic",
    17: "Conclusion",
}

# Lesson metadata from lessons.php (sections, exercises, extras, tools, puzzles)
LESSONS: dict[int, dict] = {
    1: {
        "title": "Introduction",
        "sections": [
            (1, "Introduction"),
            (2, "Logical Sentences"),
            (3, "Logical Entailment"),
            (4, "Logical Proofs"),
            (5, "Symbolic Logic"),
            (6, "Automation"),
            (7, "Conclusion"),
        ],
        "exercises": list(range(1, 8)),
        "extras": [
            ("Alice", "extras/alice.html"),
            ("Formal Logic", "images/formal_logic.png"),
            ("Contrarian Point of View", "images/antilogic.png"),
        ],
        "tools": [],
        "puzzles": [("Locks", "puzzles/locks.html", "very easy")],
    },
    2: {
        "title": "Propositional Logic",
        "sections": [
            (1, "Introduction"),
            (2, "Syntax"),
            (3, "Semantics"),
            (4, "Evaluation"),
            (5, "Satisfaction"),
            (6, "Example - Natural Language"),
            (7, "Example - Digital Circuits"),
        ],
        "exercises": list(range(1, 8)),
        "extras": [
            ("The Big Game", "videos/big_game.mp4"),
            ("Labyrinth Puzzle", "https://www.explainxkcd.com/wiki/images/2/26/labyrinth_puzzle.png"),
        ],
        "tools": [],
        "puzzles": [("Coins", "puzzles/coins.html", "")],
    },
    3: {
        "title": "Propositional Analysis",
        "sections": [
            (1, "Introduction"),
            (2, "Logical Properties"),
            (3, "Logical Equivalence"),
            (4, "Logical Entailment"),
            (5, "Logical Consistency"),
            (6, "Properties and Relationships"),
            (7, "Equivalence Rewritings"),
        ],
        "exercises": list(range(1, 7)),
        "extras": [
            ("Satisfiability", "extras/satisfiability.html"),
            ("Whodunnit", "extras/whodunnit.html"),
            ("Digital Circuits", "extras/circuits.html"),
        ],
        "tools": [
            ("Digital Circuit Builder", "https://logic.ly/demo/"),
            ("Babbage", "http://intrologic.stanford.edu/logica/homepage/babbage.php"),
            ("Boole", "http://intrologic.stanford.edu/logica/homepage/boole.php"),
            ("Quine", "http://intrologic.stanford.edu/logica/homepage/quine.php"),
        ],
        "puzzles": [("Rotors", "puzzles/rotors.html", "")],
    },
    4: {
        "title": "Direct Proofs",
        "sections": [
            (1, "Introduction"),
            (2, "Axiom Schemas"),
            (3, "Rules of Inference"),
            (4, "Direct Proofs"),
            (5, "Proof Systems"),
            (6, "Soundness and Completeness"),
        ],
        "exercises": list(range(1, 6)),
        "extras": [],
        "tools": [
            ("Hilbert", "http://intrologic.stanford.edu/logica/documentation/hilbert.html"),
        ],
        "puzzles": [("Wine", "puzzles/wine.html", "")],
    },
    5: {
        "title": "Natural Deduction",
        "sections": [
            (1, "Introduction"),
            (2, "Conditional Proofs"),
            (3, "Fitch"),
            (4, "Soundness and Completeness"),
            (5, "Reasoning Tips"),
            (6, "More Rules"),
        ],
        "exercises": list(range(1, 15)),
        "extras": [],
        "tools": [
            ("Fitch", "http://intrologic.stanford.edu/logica/documentation/herbert.html"),
        ],
        "puzzles": [("Counterfeit", "puzzles/counterfeit.html", "easy")],
    },
    6: {
        "title": "Resolution Proofs",
        "sections": [
            (1, "Introduction"),
            (2, "Clausal Form"),
            (3, "Resolution Principle"),
            (4, "Resolution Reasoning"),
        ],
        "exercises": list(range(1, 5)),
        "extras": [("Box Logic", "videos/box_logic.mp4")],
        "tools": [
            ("Stickel", "http://intrologic.stanford.edu/logica/homepage/stickel.php"),
            ("Robinson", "http://intrologic.stanford.edu/logica/homepage/robinson.php"),
        ],
        "puzzles": [("Pills", "puzzles/pills.html", "")],
    },
    7: {
        "title": "Relational Logic",
        "sections": [
            (1, "Introduction"),
            (2, "Syntax"),
            (3, "Semantics"),
            (4, "Evaluation"),
            (5, "Satisfaction"),
            (6, "Sorority World"),
            (7, "Blocks World"),
            (8, "Modular Arithmetic"),
        ],
        "exercises": list(range(1, 5)),
        "extras": [
            ("Sorority Life", "extras/sororitylife.html"),
            ("Minefinder", "extras/minefinder.html"),
            ("Minefield", "extras/minefield.html"),
            ("Logicians", "images/logicians.png"),
        ],
        "tools": [],
        "puzzles": [("Cards", "puzzles/cards.html", "")],
    },
    8: {
        "title": "Relational Analysis",
        "sections": [
            (1, "Introduction"),
            (2, "Logical Properties"),
            (3, "Logical Relationships"),
            (4, "Relational Logic and Propositional Logic"),
        ],
        "exercises": list(range(1, 4)),
        "extras": [("Relational Satisfiability", "extras/relsat.html")],
        "tools": [
            ("Quine", "http://intrologic.stanford.edu/logica/homepage/quine.php"),
        ],
        "puzzles": [("Safecracking", "puzzles/safecracking.html", "")],
    },
    9: {
        "title": "Model Checking",
        "sections": [
            (1, "Introduction"),
            (2, "Truth Tables"),
            (3, "Boolean Models"),
            (4, "Non-Boolean Models"),
        ],
        "exercises": list(range(1, 4)),
        "extras": [
            ("Train Tracks", "extras/tracks.html"),
            ("Mineplanner", "extras/mineplanner.html"),
            ("Neighborhood", "extras/neighborhood.html"),
        ],
        "tools": [
            ("Clarke", "http://intrologic.stanford.edu/logica/homepage/clarke.php"),
        ],
        "puzzles": [("Prisoners", "puzzles/prisoners.html", "")],
    },
    10: {
        "title": "Fitch Proofs (Relational)",
        "sections": [
            (1, "Introduction"),
            (2, "Universal Elimination"),
            (3, "Universal Introduction"),
            (4, "Existential Introduction"),
            (5, "Existential Elimination"),
            (6, "Domain Closure"),
        ],
        "exercises": list(range(1, 17)),
        "extras": [("Jeopardy", "extras/jeopardy.html")],
        "tools": [
            ("Fitch", "http://intrologic.stanford.edu/logica/homepage/fitch.php"),
        ],
        "puzzles": [("Chessboard", "puzzles/chessboard.html", "difficult")],
    },
    11: {
        "title": "Term Logic",
        "sections": [
            (1, "Introduction"),
            (2, "Syntax and Semantics"),
            (3, "Evaluation and Satisfaction"),
            (4, "Peano Arithmetic"),
            (5, "Linked Lists"),
            (6, "Pseudo English"),
            (7, "Metalevel Logic"),
        ],
        "exercises": list(range(1, 6)),
        "extras": [],
        "tools": [],
        "puzzles": [("Logicians", "puzzles/logicians.html", "")],
    },
    12: {
        "title": "Fitch Proofs (Term)",
        "sections": [
            (1, "Introduction"),
            (2, "Example - Interactive Logic Grids"),
            (3, "Non-Compactness and Incompleteness"),
            (4, "Undecidability"),
        ],
        "exercises": list(range(1, 3)),
        "extras": [("Blocks World Dynamics", "extras/blocks.html")],
        "tools": [
            ("Fitch", "http://intrologic.stanford.edu/logica/homepage/fitch.php"),
        ],
        "puzzles": [("Nim", "puzzles/nim.html", "")],
    },
    13: {
        "title": "Induction",
        "sections": [
            (1, "Introduction"),
            (2, "Domain Closure"),
            (3, "Linear Induction"),
            (4, "Tree Induction"),
            (5, "Structural Induction"),
            (6, "Multidimensional Induction"),
            (7, "Embedded Induction"),
        ],
        "exercises": list(range(1, 7)),
        "extras": [],
        "tools": [
            ("Fitch", "http://intrologic.stanford.edu/logica/homepage/fitch.php"),
        ],
        "puzzles": [("Zoom", "puzzles/zoom.html", "")],
    },
    14: {
        "title": "Resolution",
        "sections": [
            (1, "Introduction"),
            (2, "Clausal Form"),
            (3, "Unification"),
            (4, "Resolution Principle"),
            (5, "Resolution Reasoning"),
            (6, "Unsatisfiability"),
            (7, "Logical Entailment"),
            (8, "Answer Extraction"),
            (9, "Strategies"),
        ],
        "exercises": list(range(1, 11)),
        "extras": [],
        "tools": [],
        "puzzles": [("Nations", "puzzles/nations.html", "")],
    },
    15: {
        "title": "Equality",
        "sections": [
            (1, "Introduction"),
            (2, "Properties of Equality"),
            (3, "Substitution"),
            (4, "Fitch With Equality"),
            (5, "Example - Group Theory"),
        ],
        "exercises": list(range(1, 6)),
        "extras": [],
        "tools": [
            ("Fitch", "http://intrologic.stanford.edu/logica/homepage/fitch.php"),
        ],
        "puzzles": [("Suarez", "puzzles/suarez.html", "")],
    },
    16: {
        "title": "First-Order Logic",
        "sections": [
            (1, "Introduction"),
            (2, "Conceptualization"),
            (3, "Semantics"),
            (4, "Blocks World"),
            (5, "Arithmetic"),
            (6, "Properties"),
            (7, "Logical Entailment"),
        ],
        "exercises": [],
        "extras": [],
        "tools": [],
        "puzzles": [("Quiz", "puzzles/quiz.html", "")],
    },
    17: {
        "title": "Conclusion",
        "sections": [
            (1, "Introduction"),
            (2, "Review"),
            (3, "Extensions"),
        ],
        "exercises": [],
        "extras": [],
        "tools": [],
        "puzzles": [("Enlightenment", "puzzles/enlightenment.html", "")],
    },
}

SUPPLEMENTARY = [
    ("Herbrand Manifesto", "extras/manifesto.html"),
]

PREFACE = [
    ("Preview", "https://www.youtube.com/watch?v=vk4xLZv1V2w"),
    ("Sets, Functions, Relations", "http://people.umass.edu/partee/NZ_2006/Set Theory Basics.pdf"),
    ("Algebra - Khan Academy", "https://www.khanacademy.org/math/algebra"),
    ("Acknowledgements", "http://intrologic.stanford.edu/chapters/acknowledgements.html"),
]

ATTRIBUTION = (
    "Tools for Thought / Michael Genesereth — educational mirror of "
    "http://intrologic.stanford.edu. Not an official Stanford distribution."
)


def fetch(url: str, retries: int = 3, sleep_s: float = 0.35) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                return resp.read()
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt + 1 >= retries:
                print(f"  FAIL {url}: {e}")
                return None
            time.sleep(sleep_s * (attempt + 1))
    return None


def abs_url(path: str) -> str:
    if path.startswith("http://") or path.startswith("https://"):
        return path
    return f"{BASE}/{path.lstrip('/')}"


def header_block(title: str, source_url: str) -> str:
    return (
        f"# {title}\n\n"
        f"> **Source:** [{source_url}]({source_url})  \n"
        f"> **Attribution:** {ATTRIBUTION}\n\n"
    )


def node_to_md(node, lines: list[str], list_depth: int = 0) -> None:
    if isinstance(node, NavigableString):
        text = str(node)
        if text.strip():
            lines.append(text)
        elif text:
            lines.append(" ")
        return
    if not isinstance(node, Tag):
        return

    name = node.name.lower()
    if name in {"script", "style", "head"}:
        return

    if name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
        level = int(name[1])
        text = node.get_text(" ", strip=True)
        lines.append(f"\n\n{'#' * level} {text}\n\n")
        return

    if name == "p":
        lines.append("\n\n")
        for child in node.children:
            node_to_md(child, lines, list_depth)
        lines.append("\n\n")
        return

    if name == "br":
        lines.append("\n")
        return

    if name in {"b", "strong"}:
        lines.append("**")
        for child in node.children:
            node_to_md(child, lines, list_depth)
        lines.append("**")
        return

    if name in {"i", "em"}:
        lines.append("*")
        for child in node.children:
            node_to_md(child, lines, list_depth)
        lines.append("*")
        return

    if name == "code":
        lines.append("`")
        lines.append(node.get_text())
        lines.append("`")
        return

    if name == "pre":
        lines.append("\n\n```\n")
        lines.append(node.get_text())
        lines.append("\n```\n\n")
        return

    if name == "a":
        href = node.get("href") or ""
        text = node.get_text(" ", strip=True) or href
        if href:
            if not href.startswith("http"):
                href = abs_url(href.lstrip("../").lstrip("./"))
            lines.append(f"[{text}]({href})")
        else:
            lines.append(text)
        return

    if name == "img":
        src = node.get("src") or ""
        alt = node.get("alt") or "image"
        if src and not src.startswith("http"):
            src = abs_url(src.lstrip("../").lstrip("./"))
        if src:
            lines.append(f"\n\n![{alt}]({src})\n\n")
        return

    if name in {"ul", "ol"}:
        lines.append("\n")
        for i, li in enumerate(node.find_all("li", recursive=False), start=1):
            prefix = f"{i}." if name == "ol" else "-"
            lines.append(f"{'  ' * list_depth}{prefix} ")
            for child in li.children:
                if isinstance(child, Tag) and child.name in {"ul", "ol"}:
                    node_to_md(child, lines, list_depth + 1)
                else:
                    node_to_md(child, lines, list_depth)
            lines.append("\n")
        lines.append("\n")
        return

    if name == "table":
        rows = node.find_all("tr")
        if not rows:
            return
        table_rows: list[list[str]] = []
        for tr in rows:
            cells = tr.find_all(["td", "th"])
            table_rows.append([c.get_text(" ", strip=True).replace("|", "\\|") for c in cells])
        if not table_rows:
            return
        width = max(len(r) for r in table_rows)
        for r in table_rows:
            while len(r) < width:
                r.append("")
        lines.append("\n\n")
        lines.append("| " + " | ".join(table_rows[0]) + " |\n")
        lines.append("| " + " | ".join(["---"] * width) + " |\n")
        for r in table_rows[1:]:
            lines.append("| " + " | ".join(r) + " |\n")
        lines.append("\n")
        return

    if name == "hr":
        lines.append("\n\n---\n\n")
        return

    for child in node.children:
        node_to_md(child, lines, list_depth)


def html_to_markdown(html: bytes | str, source_url: str, title: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    # Prefer the white content table cell; fall back to body
    body = soup.body
    content: Tag | None = None
    if body:
        for table in body.find_all("table"):
            bg = (table.get("bgcolor") or "").lower()
            style = (table.get("style") or "").lower()
            if bg in {"#ffffff", "white"} or "background" in style and "fff" in style:
                td = table.find("td")
                if td:
                    content = td
                    break
        if content is None:
            content = body
    else:
        content = soup

    lines: list[str] = []
    assert content is not None
    for child in content.children:
        node_to_md(child, lines)

    text = "".join(lines)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()
    return header_block(title, source_url) + text + "\n"


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def fetch_chapter(n: int) -> tuple[str, str]:
    url = f"{BASE}/chapters/chapter_{n:02d}.html"
    slug = CHAPTER_SLUGS[n]
    title = f"Chapter {n} — {CHAPTER_TITLES[n]}"
    print(f"chapter {n}: {url}")
    raw = fetch(url)
    if raw is None:
        stub = header_block(title, url) + (
            f"*Fetch failed. Read online: [{url}]({url})*\n"
        )
        return slug, stub
    return slug, html_to_markdown(raw, url, title)


def fetch_html_page(rel_or_url: str, title: str) -> str | None:
    url = abs_url(rel_or_url)
    if not url.endswith(".html") and not url.endswith(".php"):
        return None  # binary / external — stub only
    print(f"  page: {url}")
    raw = fetch(url)
    if raw is None:
        return None
    return html_to_markdown(raw, url, title)


def stub_link(title: str, url: str, note: str = "") -> str:
    note_line = f"\n\n{note}\n" if note else "\n"
    return header_block(title, url) + f"Open upstream: [{url}]({url}){note_line}"


def write_index() -> None:
    lines = [
        "# Introduction to Logic — Lesson Index",
        "",
        f"> Mirror of [lessons.php]({BASE}/public/lessons.php). {ATTRIBUTION}",
        "",
        "## Preface",
        "",
    ]
    for title, url in PREFACE:
        lines.append(f"- [{title}]({url})")
    lines.append("")
    for n, meta in LESSONS.items():
        slug = CHAPTER_SLUGS[n]
        lines.append(f"## Lesson {n} — {meta['title']}")
        lines.append("")
        lines.append(f"- Chapter: [chapters/{slug}.md](chapters/{slug}.md)")
        lines.append(f"- Hub: [lessons/lesson-{n:02d}.md](lessons/lesson-{n:02d}.md)")
        lines.append("- Sections:")
        for snum, stitle in meta["sections"]:
            sec_url = f"{BASE}/sections/section_{n:02d}.html?section={snum}"
            lines.append(f"  - [{n}.{snum} {stitle}]({sec_url})")
        if meta["exercises"]:
            lines.append("- Exercises:")
            for e in meta["exercises"]:
                lines.append(
                    f"  - [Exercise {n}.{e}](exercises/exercise-{n:02d}-{e:02d}.md)"
                )
        if meta["extras"]:
            lines.append("- Extras:")
            for title, path in meta["extras"]:
                local = extras_local_name(title, path)
                if local:
                    lines.append(f"  - [{title}](extras/{local})")
                else:
                    lines.append(f"  - [{title}]({abs_url(path)})")
        if meta["tools"]:
            lines.append("- Tools:")
            for title, url in meta["tools"]:
                lines.append(f"  - [{title}]({url})")
        if meta["puzzles"]:
            lines.append("- Puzzles:")
            for title, path, difficulty in meta["puzzles"]:
                diff = f" ({difficulty})" if difficulty else ""
                lines.append(f"  - [{title}](puzzles/{puzzle_local_name(title)}){diff}")
        lines.append("")
    lines.append("## Supplementary")
    lines.append("")
    for title, path in SUPPLEMENTARY:
        lines.append(f"- [{title}](extras/{extras_local_name(title, path)})")
    lines.append("")
    lines.append("## Logica tools (upstream)")
    lines.append("")
    lines.append(f"- [Logica homepage]({BASE}/logica/homepage/index.php)")
    lines.append("- Local kit: [docs/apiIntegrations/logica/](../../apiIntegrations/logica/)")
    lines.append("")
    write_text(OUT / "INDEX.md", "\n".join(lines))


def extras_local_name(title: str, path: str) -> str | None:
    if path.endswith(".html"):
        stem = Path(path).stem
        return f"{stem}.md"
    return None


def puzzle_local_name(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") + ".md"


def write_lesson_hubs() -> None:
    for n, meta in LESSONS.items():
        slug = CHAPTER_SLUGS[n]
        lines = [
            header_block(
                f"Lesson {n} — {meta['title']}",
                f"{BASE}/public/lessons.php",
            ).rstrip(),
            "",
            f"**Chapter text:** [../chapters/{slug}.md](../chapters/{slug}.md)",
            "",
            "### Sections",
            "",
        ]
        for snum, stitle in meta["sections"]:
            sec_url = f"{BASE}/sections/section_{n:02d}.html?section={snum}"
            lines.append(f"- [{n}.{snum} {stitle}]({sec_url})")
        if meta["exercises"]:
            lines.append("")
            lines.append("### Exercises")
            lines.append("")
            for e in meta["exercises"]:
                lines.append(
                    f"- [Exercise {n}.{e}](../exercises/exercise-{n:02d}-{e:02d}.md)"
                )
        if meta["extras"]:
            lines.append("")
            lines.append("### Extras")
            lines.append("")
            for title, path in meta["extras"]:
                local = extras_local_name(title, path)
                if local:
                    lines.append(f"- [{title}](../extras/{local})")
                else:
                    lines.append(f"- [{title}]({abs_url(path)})")
        if meta["tools"]:
            lines.append("")
            lines.append("### Tools")
            lines.append("")
            for title, url in meta["tools"]:
                lines.append(f"- [{title}]({url})")
        if meta["puzzles"]:
            lines.append("")
            lines.append("### Puzzles")
            lines.append("")
            for title, path, difficulty in meta["puzzles"]:
                diff = f" — {difficulty}" if difficulty else ""
                lines.append(
                    f"- [{title}](../puzzles/{puzzle_local_name(title)}){diff}"
                )
        lines.append("")
        write_text(OUT / "lessons" / f"lesson-{n:02d}.md", "\n".join(lines))


def write_readme(fetched_at: str) -> None:
    text = f"""# CS157 — Introduction to Logic (Intrologic)

Local educational mirror of Stanford's [Introduction to Logic]({BASE}/public/lessons.php)
(Tools for Thought / Michael Genesereth).

## Attribution

{ATTRIBUTION}

Materials remain free online at Stanford. This folder is a convenience mirror for offline
study and platform integration — not an official redistribution or license grant.

## Layout

| Path | Contents |
|------|----------|
| [INDEX.md](INDEX.md) | Full lessons map (sections, exercises, extras, tools, puzzles) |
| [SOURCE.md](SOURCE.md) | Fetch provenance |
| [chapters/](chapters/) | Full chapter text (identical to lesson section prose) |
| [lessons/](lessons/) | Per-lesson hubs with links |
| [exercises/](exercises/) | Exercise prompts (solutions stay on upstream site) |
| [extras/](extras/) | Extra readings / activities (HTML-extractable) |
| [puzzles/](puzzles/) | Logic puzzles |

## Related tooling

- Upstream interactive tools: [Logica]({BASE}/logica/homepage/index.php)
- In-repo kit + Python labs: [docs/apiIntegrations/logica/](../../apiIntegrations/logica/)
- Narrative: [docs/STANFORD_INTROLOGIC.md](../../STANFORD_INTROLOGIC.md)

## Refresh

```bash
python3 platform/ingest/stanford/fetch_intrologic.py
```

Last fetch: {fetched_at}
"""
    write_text(OUT / "README.md", text)


def write_source(fetched_at: str, stats: dict) -> None:
    text = f"""# Source provenance

| Field | Value |
|-------|-------|
| Upstream | {BASE} |
| Lessons index | {BASE}/public/lessons.php |
| Chapters | {BASE}/chapters/chapter_NN.html |
| Fetched at (UTC) | {fetched_at} |
| Fetcher | `platform/ingest/stanford/fetch_intrologic.py` |

## Counts

| Kind | Written | Failed / stubbed |
|------|---------|------------------|
| Chapters | {stats['chapters_ok']} | {stats['chapters_fail']} |
| Exercises | {stats['exercises_ok']} | {stats['exercises_fail']} |
| Extras | {stats['extras_ok']} | {stats['extras_fail']} |
| Puzzles | {stats['puzzles_ok']} | {stats['puzzles_fail']} |

## License / attribution note

Intrologic materials are published free online for learners. No Creative Commons
deed was found on the public site at fetch time. Treat this tree as an **educational
mirror with attribution**, keep canonical URLs, and do not claim a license Stanford
did not publish.
"""
    write_text(OUT / "SOURCE.md", text)


def main() -> None:
    fetched_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    OUT.mkdir(parents=True, exist_ok=True)
    stats = {
        "chapters_ok": 0,
        "chapters_fail": 0,
        "exercises_ok": 0,
        "exercises_fail": 0,
        "extras_ok": 0,
        "extras_fail": 0,
        "puzzles_ok": 0,
        "puzzles_fail": 0,
    }

    # Chapters
    for n in range(1, 18):
        slug, md = fetch_chapter(n)
        write_text(OUT / "chapters" / f"{slug}.md", md)
        if "Fetch failed" in md:
            stats["chapters_fail"] += 1
        else:
            stats["chapters_ok"] += 1
        time.sleep(0.25)

    # Exercises
    for n, meta in LESSONS.items():
        for e in meta["exercises"]:
            rel = f"exercises/exercise_{n:02d}_{e:02d}.html"
            url = abs_url(rel)
            title = f"Exercise {n}.{e}"
            out = OUT / "exercises" / f"exercise-{n:02d}-{e:02d}.md"
            md = fetch_html_page(rel, title)
            if md is None:
                write_text(out, stub_link(title, url, "Interactive exercise — open upstream."))
                stats["exercises_fail"] += 1
            else:
                write_text(out, md)
                stats["exercises_ok"] += 1
            time.sleep(0.2)

    # Extras (html only)
    seen_extras: set[str] = set()
    for n, meta in LESSONS.items():
        for title, path in meta["extras"]:
            local = extras_local_name(title, path)
            if not local or local in seen_extras:
                if not local:
                    stats["extras_fail"] += 1
                continue
            seen_extras.add(local)
            out = OUT / "extras" / local
            md = fetch_html_page(path, f"Extra — {title}")
            if md is None:
                write_text(out, stub_link(f"Extra — {title}", abs_url(path)))
                stats["extras_fail"] += 1
            else:
                write_text(out, md)
                stats["extras_ok"] += 1
            time.sleep(0.2)

    for title, path in SUPPLEMENTARY:
        local = extras_local_name(title, path)
        assert local
        if local in seen_extras:
            continue
        seen_extras.add(local)
        md = fetch_html_page(path, title)
        out = OUT / "extras" / local
        if md is None:
            write_text(out, stub_link(title, abs_url(path)))
            stats["extras_fail"] += 1
        else:
            write_text(out, md)
            stats["extras_ok"] += 1

    # Puzzles
    for n, meta in LESSONS.items():
        for title, path, difficulty in meta["puzzles"]:
            out = OUT / "puzzles" / puzzle_local_name(title)
            note = f"Difficulty: {difficulty}" if difficulty else ""
            md = fetch_html_page(path, f"Puzzle — {title}")
            if md is None:
                write_text(out, stub_link(f"Puzzle — {title}", abs_url(path), note))
                stats["puzzles_fail"] += 1
            else:
                if note:
                    md = md.rstrip() + f"\n\n*{note}*\n"
                write_text(out, md)
                stats["puzzles_ok"] += 1
            time.sleep(0.2)

    write_lesson_hubs()
    write_index()
    write_readme(fetched_at)
    write_source(fetched_at, stats)
    print("Done:", stats)
    print("Wrote:", OUT)


if __name__ == "__main__":
    main()
