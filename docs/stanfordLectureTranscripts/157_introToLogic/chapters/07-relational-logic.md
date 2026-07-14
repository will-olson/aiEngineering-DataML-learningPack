# Chapter 7 — Relational Logic

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_07.html](http://intrologic.stanford.edu/chapters/chapter_07.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  7 |

| Relational Logic |
| --- |

  =======================================================================

### 7.1 Introduction

Propositional Logic allows us to talk about relationships among individual propositions, and it gives us the machinery to derive logical conclusions based on these relationships.  Suppose, for example, we believe that, if Jack knows Jill, then Jill knows Jack.  Suppose we also believe that Jack knows Jill.  From these two facts, we can conclude that Jill knows Jack using a simple application of Implication Elimination.

Unfortunately, when we want to say things more generally, we find that Propositional Logic is inadequate.  Suppose, for example, that we wanted to say that, in general, if one person knows a second person, then the second person knows the first.  Suppose, as before, that we believe that Jack knows Jill.  How do we express the general fact in a way that allows us to conclude that Jill knows Jack?  Here, Propositional Logic is inadequate; it gives us no way of succinctly encoding this more general belief in a form that captures its full meaning and allows us to derive such conclusions.

*Relational Logic* is an alternative to Propositional Logic that solves this problem.  The trick is to augment our language with two new linguistic features, viz. *variables* and *quantifiers*.  With these new features, we can express information about multiple objects without enumerating those objects; and we can express the existence of objects that satisfy specified conditions without saying which objects they are.

In this chapter, we proceed through the same stages as in the introduction to Propositional Logic.  We start with syntax and semantics.  We then discuss evaluation and satisfaction.  We look at some examples.  Then, we talk about properties of Relational Logic sentences and logical entailment for Relational Logic.  Finally, we say a few words about the equivalence of Relational Logic and Propositional Logic and its decidability.

 =======================================================================

### 7.2 Syntax

In Propositional Logic, sentences are constructed from a basic vocabulary of propositional constants.  In Relational Logic, there are no propositional constants; instead we have *object constants*, *relation constants*, and *variables*.

In our examples here, we write both variables and constants as strings of letters, digits, and a few non-alphanumeric characters (e.g. "_").  By convention, variables begin with letters from the end of the alphabet (viz. *u*, *v*, *w*, *x*, *y*, *z*).  Examples include *x*, *ya*, and *z*_2.  By convention, all constants begin with either alphabetic letters (other than *u*, *v*, *w*, *x*, *y*, *z*) or digits.  Examples include *a*, *b*, 123, *comp*225, and *barack_obama*.

Note that there is no distinction in spelling between object constants and relation constants.  The type of each such word is determined by its usage or, in some cases, in an explicit specification.

As we shall see, relation constants are used in forming complex expressions by combining them with an appropriate number of arguments.  Accordingly, each relation constant has an associated *arity*, i.e. the number of arguments with which that relation constant can be combined.  A relation constant that can combined with a single argument is said to be *unary*; one that can be combined with two arguments is said to be *binary*; one that can be combined with three arguments is said to be *ternary*; more generally, a relation constant that can be combined with *n* arguments is said to be *n*-ary.

A *vocabulary* consists of a finite, non-empty set of object constants, a finite, non-empty set of relation constants, and an assignment of arities for each of the relation constants in the vocabulary.  (Note that this definition here is slightly non-traditional.  In many textbooks, a vocabulary (sometimes called a *signature*) includes a specification of relation constants but not object constants, whereas our definition here includes both types of constants.)

A *term* is defined to be a variable or an object constant.  Terms typically denote objects presumed or hypothesized to exist in the world; and, as such, they are analogous to noun phrases in natural language, e.g. *Joe* or *someone*.

There are three types of *sentences* in Relational Logic, viz. relational sentences (the analog of propositions in Propositional Logic), logical sentences (analogous to the logical sentences in Propositional Logic), and quantified sentences (which have no analog in Propositional Logic).

A *relational sentence* is an expression formed from an *n*-ary relation constant and *n* terms.  For example, if *q* is a relation constant with arity 2 and if *a* and *y* are terms, then the expression shown below is a syntactically legal relational sentence.  Relational sentences are sometimes called *atoms* to distinguish them from logical and quantified sentences.

  *q*(*a*, *y*)

*Logical sentences* are defined as in Propositional Logic.  There are negations, conjunctions, disjunctions, implications, and equivalences.  See below for examples.

| Negation: |  | (¬ p ( a )) |
| --- | --- | --- |
| Conjunction: |  | ( p ( a ) ∧ q ( b , c )) |
| Disjunction: |  | ( p ( a ) ∨ q ( b , c )) |
| Implication: |  | ( p ( a ) ⇒ q ( b , c )) |
| Biconditional: |  | ( p ( a ) ⇔ q ( b , c )) |

Note that the syntax here is exactly the same as in Propositional Logic except that the elementary components are relational sentences rather than proposition constants.

*Quantified sentences *are formed from a *quantifier*, a variable, and an embedded sentence.  The embedded sentence is called the *scope* of the quantifier.  There are two types of quantified sentences in Relational Logic, viz. universally quantified sentences and existentially quantified sentences.

A *universally quantified sentence* is used to assert that all objects have a certain property.  For example, the following expression is a universally quantified sentence asserting that, if *p* holds of an object, then *q* holds of that object and itself.

 (∀*x*.(*p*(*x*) ⇒ *q*(*x*,*x*)))

An *existentially quantified sentence* is used to assert that some object has a certain property.  For example, the following expression is an existentially quantified sentence asserting that there is an object that satisfies *p* and, when paired with itself, satisfies *q* as well.

 (∃*x*.(*p*(*x*) ∧ *q*(*x*,*x*)))

Note that quantified sentences can be nested within other sentences.  For example, in the first sentence below, we have quantified sentences inside of a disjunction.  In the second sentence, we have a quantified sentence nested inside of another quantified sentence.

 ((∀*x*.*p*(*x*)) ∨ (∃*x*.*q*(*x*,*x*)))
(∀*x*.(∃*y*.*q*(*x*,*y*)))

As with Propositional Logic, we can drop unneeded parentheses in Relational Logic, relying on precedence to disambiguate the structure of unparenthesized sentences.  In Relational Logic, the precedence relations of the logical operators are the same as in Propositional Logic, and quantifiers have higher precedence than logical operators.

The following examples show how to parenthesize sentences with both quantifiers and logical operators.  The sentences on the right are partially parenthesized versions of the sentences on the left.  (To be fully parenthesized, we would need to add parentheses around each of the sentences as a whole.)

| ∀ x . p ( x ) ⇒ q ( x ) |  | (∀ x . p ( x )) ⇒ q ( x ) |
| --- | --- | --- |
| ∃ x . p ( x ) ∧ q ( x ) |  | (∃ x . p ( x )) ∧ q ( x ) |
