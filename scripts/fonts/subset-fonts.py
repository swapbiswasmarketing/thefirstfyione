"""Rebuild the self-hosted web fonts in src/assets/fonts/ from pristine originals.

Run by hand (needs Python with fontTools 4.6x and brotli); the outputs are
committed, so the Vercel build needs no Python:

    python scripts/fonts/subset-fonts.py

Inputs: scripts/fonts/originals/ holds the latin woff2 files exactly as
fonts.gstatic.com served them to desktop Chrome on Windows (Google varies files
by user agent; the Windows build of Space Mono is the hinted one). Re-running
always starts from these, never from a previous output.

What it does, per face:
  1. Subsets the cmap to KEEP (printable ASCII, Latin-1, the typographic
     punctuation the site renders) intersected with what the font has.
  2. Clips the variable axes to what the CSS can ask for. font-optical-sizing
     ties opsz to the px size, and Newsreader is set between 14.7px (the
     homepage's italic hooks) and 24px (entry deks), measured across every
     template, so opsz 14-24 covers every use; text set outside that range
     would take the nearest end's design. The roman keeps wght 400-600 and
     the italic is pinned at 400. This, not the cmap, is the big saving:
     Google's css2 API pins single values but never clips a range, so it
     serves the full wght 200-800 x opsz 6-72 file (132,000 and 146,872 B).
     Re-check the sizes in use before narrowing the range: a clip that misses
     a size changes that text's widths, and so its line breaks.
  3. Keeps hinting (Space Mono's ttfautohint instructions change how 10-12px
     labels rasterise on Windows) and every name record (copyright and licence
     URL stay in the font, as the OFL asks).
Order matters: subset first, then instantiate; the reverse raises KeyError
'.notdef' in fontTools.

Licensing: all three families are SIL OFL 1.1. Newsreader and Space Mono
declare no Reserved Font Name, so a subset may keep its name. Playfair Display
declares the Reserved Font Name "Playfair Display", so any subset or instance
would be a Modified Version that may not use that name. It is therefore NOT
processed here: src/assets/fonts/playfair-display-*.woff2 are Google's files,
byte for byte (v40).

The output is deterministic (hash seed pinned, Google's timestamps kept), so
an unchanged re-run writes identical bytes. After a real change, rebuild the
site: Vite fingerprints the files under /_astro/, so new bytes get a new URL
and cached clients pick them up. Then re-measure the fallback faces at the
top of src/styles/global.css, whose size-adjust values were measured against
these exact files: render the site's own text per role in a browser, once in
the web face and once in the local face at size-adjust 100%, at the size and
column width each role is set at, and take the ratio at which the fewest
blocks change line count.
"""
import os
import subprocess
import sys

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "originals")
OUT = os.path.normpath(os.path.join(HERE, "..", "..", "src", "assets", "fonts"))

KEEP = set(
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + [0x131, 0x152, 0x153, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D,
       0x2022, 0x2026, 0x2032, 0x2033, 0x2039, 0x203A, 0x20AC, 0x2122, 0x2212]
)

# Newsreader's GSUB is liga, pnum, rvrn (the feature-variation switch), tnum;
# its GPOS is kern, mark, mkmk. Keep the defaults plus the numeral variants.
TEXT = ["kern", "mark", "mkmk", "ccmp", "locl", "liga", "calt", "rlig", "rvrn", "lnum", "pnum", "tnum"]
# Space Mono: no kerning to keep; frac/numr/dnom are never requested.
MONO = ["mark", "mkmk", "ccmp", "locl"]

JOBS = [
    # (source, output, axis limits, features)
    ("newsreader-latin-v26.woff2", "newsreader-roman-latin.woff2", {"wght": (400, 600), "opsz": (14, 24)}, TEXT),
    ("newsreader-italic-latin-v26.woff2", "newsreader-italic-latin.woff2", {"wght": 400, "opsz": (14, 24)}, TEXT),
    ("space-mono-400-latin-v17.woff2", "space-mono-400-latin.woff2", None, MONO),
]


def build(src, out, limits, features):
    font = TTFont(os.path.join(SRC, src), recalcTimestamp=False)
    unicodes = sorted(KEEP & set(font.getBestCmap()))
    opts = Options()
    opts.layout_features = features
    opts.hinting = True
    opts.name_IDs = ["*"]
    opts.name_legacy = True
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    sub = Subsetter(options=opts)
    sub.populate(unicodes=unicodes)
    sub.subset(font)
    if limits:
        font = instantiateVariableFont(font, limits, inplace=False, updateFontNames=False)
    # Keep Google's head.modified, so an unchanged re-run writes identical bytes
    # (and so the same fingerprinted URL).
    font.recalcTimestamp = False
    font.flavor = "woff2"
    path = os.path.join(OUT, out)
    font.save(path)
    before, after = os.path.getsize(os.path.join(SRC, src)), os.path.getsize(path)
    print(f"{out:<34} {before:>7,} -> {after:>7,} B  ({len(unicodes)} codepoints)")


def main():
    # fontTools walks sets in places, and set order follows the string hash
    # seed, so pin it: same inputs, same bytes, same /_astro/ URL.
    if os.environ.get("PYTHONHASHSEED") != "0":
        env = dict(os.environ, PYTHONHASHSEED="0")
        return subprocess.call([sys.executable, os.path.abspath(__file__)], env=env)
    os.makedirs(OUT, exist_ok=True)
    for job in JOBS:
        build(*job)
    return 0


if __name__ == "__main__":
    sys.exit(main())
