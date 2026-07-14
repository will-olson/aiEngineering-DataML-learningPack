"""Shared propositional helpers + API-snapshot worlds for stanford-logic labs."""
from __future__ import annotations

import itertools
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)

API_KITS = REPO / "docs" / "apiIntegrations"

# Mirror docs/apiIntegrations/logica/logicaWorlds.md
DEFAULT_WORLDS: dict[str, dict[str, bool]] = {
    "earth_watch": {
        "Cat_wildfires": True,
        "Cat_severeStorms": True,
        "Cat_volcanoes": True,
        "Src_AVO": True,
        "Src_ABFIRE": True,
        "OpenEvent_wildfires": True,
        "OpenEvent_volcanoes": False,
    },
    "orbit_board": {
        "Sat_ISS": True,
        "Sat_HST": True,
        "Sat_TERRA": True,
        "Track_ISS": True,
        "Prop_available": True,
    },
    "launch_desk": {
        "Status_Go": True,
        "Status_TBD": True,
        "Status_Hold": True,
        "Status_Success": True,
        "Prefer_Go": True,
        "Hard_not_Hold": False,
    },
}

EONET = "https://eonet.gsfc.nasa.gov/api/v3"
TLE = "https://tle.ivanstanojevic.me/api/tle"
LL2 = "https://ll.thespacedevs.com/2.2.0"

TOKEN_RE = re.compile(
    r"\s*(<=>|<->|=>|->|&|\||~|\(|\)|[A-Za-z_][A-Za-z0-9_]*|and|or|not|true|false)\s*",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class Atom:
    name: str


@dataclass(frozen=True)
class Not:
    child: object


@dataclass(frozen=True)
class And:
    left: object
    right: object


@dataclass(frozen=True)
class Or:
    left: object
    right: object


@dataclass(frozen=True)
class Imp:
    left: object
    right: object


@dataclass(frozen=True)
class Iff:
    left: object
    right: object


class ParseError(ValueError):
    pass


class Parser:
    def __init__(self, text: str):
        # One capturing group → findall returns token strings
        self.tokens = [t for t in TOKEN_RE.findall(text) if t]
        leftover = TOKEN_RE.sub("", text).strip()
        if leftover:
            raise ParseError(f"Unrecognized input near {leftover!r}")
        self.i = 0

    def peek(self) -> str | None:
        return self.tokens[self.i] if self.i < len(self.tokens) else None

    def eat(self, expected: str | None = None) -> str:
        tok = self.peek()
        if tok is None:
            raise ParseError("Unexpected end of formula")
        if expected is not None and tok.lower() != expected.lower():
            raise ParseError(f"Expected {expected!r}, got {tok!r}")
        self.i += 1
        return tok

    def parse(self) -> object:
        node = self.parse_iff()
        if self.peek() is not None:
            raise ParseError(f"Trailing token {self.peek()!r}")
        return node

    def parse_iff(self) -> object:
        left = self.parse_imp()
        while self.peek() in {"<=>", "<->"}:
            self.eat()
            right = self.parse_imp()
            left = Iff(left, right)
        return left

    def parse_imp(self) -> object:
        left = self.parse_or()
        while self.peek() in {"=>", "->"}:
            self.eat()
            right = self.parse_imp()  # right-assoc
            left = Imp(left, right)
        return left

    def parse_or(self) -> object:
        left = self.parse_and()
        while self.peek() is not None and self.peek().lower() in {"|", "or"}:
            self.eat()
            right = self.parse_and()
            left = Or(left, right)
        return left

    def parse_and(self) -> object:
        left = self.parse_unary()
        while self.peek() is not None and self.peek().lower() in {"&", "and"}:
            self.eat()
            right = self.parse_unary()
            left = And(left, right)
        return left

    def parse_unary(self) -> object:
        tok = self.peek()
        if tok is None:
            raise ParseError("Unexpected end")
        if tok.lower() in {"~", "not"}:
            self.eat()
            return Not(self.parse_unary())
        if tok == "(":
            self.eat("(")
            node = self.parse_iff()
            self.eat(")")
            return node
        if tok.lower() in {"true", "false"}:
            self.eat()
            # Represent constants as atoms with reserved names
            return Atom("__TRUE__" if tok.lower() == "true" else "__FALSE__")
        if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", tok):
            self.eat()
            return Atom(tok)
        raise ParseError(f"Unexpected token {tok!r}")


def parse(formula: str) -> object:
    return Parser(formula).parse()


def atoms(node: object) -> set[str]:
    if isinstance(node, Atom):
        if node.name in {"__TRUE__", "__FALSE__"}:
            return set()
        return {node.name}
    if isinstance(node, Not):
        return atoms(node.child)
    if isinstance(node, (And, Or, Imp, Iff)):
        return atoms(node.left) | atoms(node.right)
    raise TypeError(type(node))


def eval_formula(node: object, world: dict[str, bool]) -> bool:
    if isinstance(node, Atom):
        if node.name == "__TRUE__":
            return True
        if node.name == "__FALSE__":
            return False
        if node.name not in world:
            raise KeyError(f"Atom {node.name!r} missing from world")
        return bool(world[node.name])
    if isinstance(node, Not):
        return not eval_formula(node.child, world)
    if isinstance(node, And):
        return eval_formula(node.left, world) and eval_formula(node.right, world)
    if isinstance(node, Or):
        return eval_formula(node.left, world) or eval_formula(node.right, world)
    if isinstance(node, Imp):
        return (not eval_formula(node.left, world)) or eval_formula(node.right, world)
    if isinstance(node, Iff):
        return eval_formula(node.left, world) == eval_formula(node.right, world)
    raise TypeError(type(node))


def truth_table(formula: str) -> tuple[list[str], list[tuple[dict[str, bool], bool]]]:
    node = parse(formula)
    names = sorted(atoms(node))
    rows: list[tuple[dict[str, bool], bool]] = []
    for bits in itertools.product([False, True], repeat=len(names)):
        world = dict(zip(names, bits))
        rows.append((world, eval_formula(node, world)))
    return names, rows


def to_nnf(node: object) -> object:
    if isinstance(node, Atom):
        return node
    if isinstance(node, Not):
        c = node.child
        if isinstance(c, Atom):
            return node
        if isinstance(c, Not):
            return to_nnf(c.child)
        if isinstance(c, And):
            return to_nnf(Or(Not(c.left), Not(c.right)))
        if isinstance(c, Or):
            return to_nnf(And(Not(c.left), Not(c.right)))
        if isinstance(c, Imp):
            return to_nnf(Not(Or(Not(c.left), c.right)))
        if isinstance(c, Iff):
            return to_nnf(Not(And(Imp(c.left, c.right), Imp(c.right, c.left))))
        raise TypeError(type(c))
    if isinstance(node, Imp):
        return to_nnf(Or(Not(node.left), node.right))
    if isinstance(node, Iff):
        return to_nnf(And(Imp(node.left, node.right), Imp(node.right, node.left)))
    if isinstance(node, And):
        return And(to_nnf(node.left), to_nnf(node.right))
    if isinstance(node, Or):
        return Or(to_nnf(node.left), to_nnf(node.right))
    raise TypeError(type(node))


def distribute_or_over_and(a: object, b: object) -> object:
    if isinstance(a, And):
        return And(distribute_or_over_and(a.left, b), distribute_or_over_and(a.right, b))
    if isinstance(b, And):
        return And(distribute_or_over_and(a, b.left), distribute_or_over_and(a, b.right))
    return Or(a, b)


def to_cnf_ast(node: object) -> object:
    n = to_nnf(node)
    if isinstance(n, (Atom, Not)):
        return n
    if isinstance(n, And):
        return And(to_cnf_ast(n.left), to_cnf_ast(n.right))
    if isinstance(n, Or):
        return distribute_or_over_and(to_cnf_ast(n.left), to_cnf_ast(n.right))
    raise TypeError(type(n))


def clause_lits(node: object) -> frozenset[str]:
    """Return clause as frozenset of 'P' / '~P' literals."""
    if isinstance(node, Atom):
        return frozenset([node.name])
    if isinstance(node, Not) and isinstance(node.child, Atom):
        return frozenset(["~" + node.child.name])
    if isinstance(node, Or):
        return clause_lits(node.left) | clause_lits(node.right)
    raise ValueError(f"Not a clause: {fmt(node)}")


def cnf_clauses(formula: str) -> list[frozenset[str]]:
    ast = to_cnf_ast(parse(formula))

    def collect(n: object) -> list[frozenset[str]]:
        if isinstance(n, And):
            return collect(n.left) + collect(n.right)
        return [clause_lits(n)]

    return collect(ast)


def fmt(node: object) -> str:
    if isinstance(node, Atom):
        if node.name == "__TRUE__":
            return "true"
        if node.name == "__FALSE__":
            return "false"
        return node.name
    if isinstance(node, Not):
        inner = fmt(node.child)
        if isinstance(node.child, Atom):
            return f"~{inner}"
        return f"~({inner})"
    if isinstance(node, And):
        return f"({fmt(node.left)} & {fmt(node.right)})"
    if isinstance(node, Or):
        return f"({fmt(node.left)} | {fmt(node.right)})"
    if isinstance(node, Imp):
        return f"({fmt(node.left)} => {fmt(node.right)})"
    if isinstance(node, Iff):
        return f"({fmt(node.left)} <=> {fmt(node.right)})"
    raise TypeError(type(node))


def sat(clauses: Iterable[frozenset[str]], atoms_hint: Iterable[str] | None = None) -> dict[str, bool] | None:
    """Brute-force SAT for small clause sets."""
    names: set[str] = set(atoms_hint or [])
    for c in clauses:
        for lit in c:
            names.add(lit[1:] if lit.startswith("~") else lit)
    names_l = sorted(names)
    for bits in itertools.product([False, True], repeat=len(names_l)):
        world = dict(zip(names_l, bits))
        ok = True
        for clause in clauses:
            satisfied = False
            for lit in clause:
                if lit.startswith("~"):
                    if not world[lit[1:]]:
                        satisfied = True
                        break
                else:
                    if world[lit]:
                        satisfied = True
                        break
            if not satisfied:
                ok = False
                break
        if ok:
            return world
    return None


def parse_world_args(pairs: list[str]) -> dict[str, bool]:
    world: dict[str, bool] = {}
    for p in pairs:
        if "=" not in p:
            raise SystemExit(f"Expected Atom=0|1, got {p!r}")
        k, v = p.split("=", 1)
        world[k.strip()] = v.strip() in {"1", "true", "True", "yes", "YES"}
    return world


def merged_default_world() -> dict[str, bool]:
    w: dict[str, bool] = {}
    for part in DEFAULT_WORLDS.values():
        w.update(part)
    return w


# --- First-order unification (Wegman) ---

@dataclass(frozen=True)
class Var:
    name: str


@dataclass(frozen=True)
class Const:
    name: str


@dataclass(frozen=True)
class Fun:
    name: str
    args: tuple[object, ...]


TERM_TOKEN = re.compile(r"\s*([A-Za-z_][A-Za-z0-9_]*|\(|\)|,)\s*")


def parse_term(text: str) -> object:
    tokens = [t for t in TERM_TOKEN.findall(text) if t]
    i = 0

    def peek() -> str | None:
        return tokens[i] if i < len(tokens) else None

    def eat(exp: str | None = None) -> str:
        nonlocal i
        tok = peek()
        if tok is None:
            raise ParseError("Unexpected end of term")
        if exp is not None and tok != exp:
            raise ParseError(f"Expected {exp!r}, got {tok!r}")
        i += 1
        return tok

    def parse() -> object:
        name = eat()
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name):
            raise ParseError(f"Bad identifier {name!r}")
        if peek() == "(":
            eat("(")
            args: list[object] = []
            if peek() != ")":
                args.append(parse())
                while peek() == ",":
                    eat(",")
                    args.append(parse())
            eat(")")
            return Fun(name, tuple(args))
        # Convention: uppercase start → variable (X, Y, Foo); else constant
        if name[0].isupper():
            return Var(name)
        return Const(name)

    node = parse()
    if peek() is not None:
        raise ParseError(f"Trailing {peek()!r}")
    return node


def apply_subst(term: object, subst: dict[str, object]) -> object:
    if isinstance(term, Var):
        if term.name in subst:
            return apply_subst(subst[term.name], subst)
        return term
    if isinstance(term, Const):
        return term
    if isinstance(term, Fun):
        return Fun(term.name, tuple(apply_subst(a, subst) for a in term.args))
    raise TypeError(type(term))


def occurs(var: str, term: object, subst: dict[str, object]) -> bool:
    term = apply_subst(term, subst)
    if isinstance(term, Var):
        return term.name == var
    if isinstance(term, Const):
        return False
    if isinstance(term, Fun):
        return any(occurs(var, a, subst) for a in term.args)
    return False


def unify(a: object, b: object, subst: dict[str, object] | None = None) -> dict[str, object] | None:
    subst = dict(subst or {})
    a = apply_subst(a, subst)
    b = apply_subst(b, subst)
    if isinstance(a, Var) and isinstance(b, Var) and a.name == b.name:
        return subst
    if isinstance(a, Var):
        if occurs(a.name, b, subst):
            return None
        subst[a.name] = b
        return subst
    if isinstance(b, Var):
        if occurs(b.name, a, subst):
            return None
        subst[b.name] = a
        return subst
    if isinstance(a, Const) and isinstance(b, Const):
        return subst if a.name == b.name else None
    if isinstance(a, Fun) and isinstance(b, Fun):
        if a.name != b.name or len(a.args) != len(b.args):
            return None
        for x, y in zip(a.args, b.args):
            subst = unify(x, y, subst)
            if subst is None:
                return None
        return subst
    return None


def fmt_term(term: object) -> str:
    if isinstance(term, Var):
        return term.name
    if isinstance(term, Const):
        return term.name
    if isinstance(term, Fun):
        return f"{term.name}({','.join(fmt_term(a) for a in term.args)})"
    raise TypeError(type(term))


def die(msg: str, code: int = 1) -> None:
    print(msg, file=sys.stderr)
    raise SystemExit(code)
