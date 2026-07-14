# Chapter 12 — Fitch Proofs (Term)

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_12.html](http://intrologic.stanford.edu/chapters/chapter_12.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  12 |

| Fitch Proofs |
| --- |

  =======================================================================

### 12.1 Introduction

Logical entailment for Term Logic is defined the same as for Propositional Logic and Relational Logic.  A set of premises logically entails a conclusion if and only if every truth assignment that satisfies the premises also satisfies the conclusions.  In the case of Propositional Logic and Relational Logic, we can check logical entailment by examining a truth table for the language.   With finitely many proposition constants, the truth table is large but finite.  For Term Logic, things are not so easy.  It is possible to have Herbrand bases of infinite size; and, in such cases, truth assignments are infinitely large and there are infinitely many of them, making it impossible to check logical entailment using truth tables.

All is not lost.  As with Propositional Logic and Relational Logic, we can establish logical entailment in Term Logic by writing proofs.  In fact, it is possible to show that, with a few simple restrictions, a set of premises logically entails a conclusion if and only if there is a finite proof of the conclusion from the premises, even when the Herbrand base is infinite.  Moreover, it is possible to find such proofs in a finite time.  That said, things are not perfect.  If a set of sentences does *not* logically entail a conclusion, then the process of searching for a proof might go on forever.  Moreover, if we remove the restrictions mentioned above, we lose the guarantee of finite proofs.  Still, the relationship between logical entailment and finite provability, given those restrictions, is a very powerful result and has enormous practical benefits.

In this chapter, we look at an example of a proof in Term Logic using the Fitch proof system we saw previously.  In the next chapter, we look at an extension to Fitch, called Induction, that allows us to prove more results in Term Logic.  And, in the chapter after that, we talk about the non-compactness of Term Logic and the loss of completeness in our proof procedure.

 =======================================================================

### 12.2 Example - Interactive Logic grids

In solving Relational Logic problems involving binary relations, we saw that it is valuable to use logic grids like the one shown below.  Here the relation holds of an object x and an object y if there is a check mark in the cell with row labeled x and column labeled y.

| a b c d a b c d |  | a | b | c | d | a |  |  |  |  | b |  |  |  |  | c |  |  |  |  | d |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | a | b | c | d |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| a |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| b |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| c |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| d |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

An interactive logic grid allows us to edit the contents of cells by clicking on those cells.  When clicked, a blank cell goes to a check, a checked cell goes to an ex, and an exed cell goes to a blank.

We can formalize this behavior by writing axioms like the ones shown below.  The first says that, if a cell is blank in state *x*, then it will contains a check in state *c*(*x*)), i.e. the state that results from clicking *x*.  The other axioms are analogous.

∀*x*.(*blank*(*x*) ⇒ *check*(*c*(*x*)))

∀*x*.(*check*(*x*) ⇒ *ex*(*c*(*x*)))

∀*x*.(*ex*(*x*) ⇒ *blank*(*c*(*x*)))

Our job in this example is to use these axioms to prove that clicking a blank cell three times returns the cell to it initial, blank state.  The proof is shown below.  Our premises appear on lines 1, 2, and 3.  On line 4, we assume that our cell is blank in state *d*.  We then use Universal Elimination to produce line 5; and we then use Implication Elimination to conclude that our cell contains a check in state *c*(*d*).  We repeat for *c*(*c*(*d*)) and *c*(*c*(*c*(*d*))).  We use Implication Introduction to exit our subproof.  Finally, we apply Universal Introduction to produce our conclusion on line 12.

| 1. | ∀ x .( blank ( x ) ⇒ check ( c ( x ))) | Premise |
| --- | --- | --- |
| 2. | ∀ x .( check ( x ) ⇒ ex ( c ( x ))) | Premise |
| 3. | ∀ x .( ex ( x ) ⇒ blank ( c ( x ))) | Premise |
| 4. | blank ( d ) | Assumption |
| 5. | blank ( d ) ⇒ check ( c ( d )) | Universal Elimination: 1 |
| 6. | check ( c ( d )) | Implication Elimination: 5, 4 |
| 7. | check ( c ( d )) ⇒ ex ( c ( c ( d ))) | Universal Elimination: 2 |
| 8. | ex ( c ( c ( d ))) | Implication Elimination: 7,6 |
| 9. | ex ( c ( c ( d ))) ⇒ blank ( c ( c ( c ( d )))) | Universal Elimination: 3 |
| 10. | blank ( c ( c ( c ( d )))) | Implication Elimination: 9,8 |
| 11. | blank ( d ) ⇒ blank ( c ( c ( c ( d )))) | Implication Introduction: 4, 10 |
| 12. | ∀ x .( blank ( x ) ⇒ blank ( c ( c ( c ( x ))))) | Universal Introduction: 11 |

This proof uses no more than the usual rules of inference in the Fitch system but applied to sentences in Term Logic.  The next chapter describes a new rule of inference that allows us to prove significantly more than we can prove with just the standard rules in the Fitch system.

 =======================================================================

### 12.3 Non-Compactness and Incompleteness

Compactness says that if an infinite set of sentences is unsatisfiable, there is some finite subset that is unsatisfiable. It guarantees finite proofs.

Non-Compactness Theorem: Term Logic is not compact.

Proof. Consider the following infinite set of sentences.

  *p*(*a*), *p*(*f*(*a*)), *p*(*f*(*f*(*a*))), ...

Assume the vocabulary is {*p*, *a*, *f*}.  Hence, the ground terms are *a*, *f*(*a*), *f*(*f*(*a*)), ....   This set of sentences entails ∀*x*.*p*(*x*).  Add in the sentence ∃*x*.¬*p*(*x*).  Clearly, this infinite set is unsatisfiable. However, every finite subset is satisfiable. (Every finite subset is missing either ∃*x*.¬*p*(*x*) or one of the sentences above. If it is the former, the set is satisfiable; and, if it is the latter, the set can be satisfied by making the missing sentence false.) Thus, compactness does not hold.

Corollary (Infinite Proofs): In Term Logic, some entailed sentences have only infinite proofs.

Proof. The above proof demonstrates a set of sentences that entail ∀*x*.*p*(*x*). The set of premises in any finite proof will be missing one of the above sentences; thus, those premises do not entail ∀*x*.*p*(*x*). Thus no finite proof can exist for ∀*x*.*p*(*x*).

The statement in this Corollary was made earlier with the condition that checking whether a candidate proof actually proves a conjecture is decidable. There is no such condition on this theorem.

 =======================================================================

### 12.4 Undecidability

The good news about Term Logic is that it is highly expressive.  We can formalize things in Term Logic that cannot be formalized (at least in finite form) in Relational Logic.  For example, we showed how to define addition and multiplication in finite form.  This is not possible with Relational Logic and in other logics (e.g. First-Order Logic).

The bad news is that the questions of unsatisfiability and logical entailment for Term Logic are not effectively computable.  Explaining this in detail is beyond the scope of this course.  However, we can give a line of argument that suggests why it is true.  The argument reduces a problem that is generally accepted to be non-semidecidable to the question of unsatisfiability / logical entailment for Term Logic.  If our logic were semidecidable, then this other question would be semidecidable as well; and, since it is known not to be semidecidable, then Term Logic must not be semidecidable either.

As we know, Diophantine equations can be readily expressed as sentences in Term Logic.   For example, we can represent the solvability of Diophantine equation 3*x*2=1 with the sentence shown below.

∃*x*.∃*y*.(*times*(*x*, *x*, *y*) ∧ *times*(*s*(*s*(*s*(0))), *y*, *s*(0)))

We can represent every Diophantine equation in an analogous way.  We can express the unsolvability of a Diophantine equation by negating the corresponding sentence.   We can then ask the question of whether the axioms of arithmetic logically entail this negation or, equivalently, whether the axioms of Arithmetic together with the unnegated sentence are unsatisfiable.

The problem is that it is well known that determining whether Diophantine equations are unsolvable is not decidable.  If we could determine the unsatisfiability of our encoding of a Diophantine equation, we could decide whether it is unsolvable, contradicting the undecidability of that problem.

Note that this does not mean Term Logic is useless.  In fact, it is great for expressing such information; and we can prove many results, even though, in general, we cannot prove everything that follows from arbitrary sets of sentences in Term Logic.  We discuss this issue further in later chapters.

 =======================================================================

### Exercises

[Exercise 12.1:](http://intrologic.stanford.edu/exercises/exercise_12_01.html) Given ∀*z*.(*p*(*z*) ⇒ ¬*p*(*f*(*z*))) and ∀*z*.(¬*p*(*z*) ⇒ *p*(*f*(*z*))), prove ∀*z*.(*p*(*z*) ⇒ *p*(*f*(*f*(*z*)))).

[Exercise 12.2:](http://intrologic.stanford.edu/exercises/exercise_12_02.html) Given ∀*z*.(*p*(*z*) ⇔ *q*(*f*(*z*))) and ∀*z*.(*p*(*z*) ⇔ *r*(*g*(*z*))), prove ∀*z*.(*q*(*f*(*z*)) ⇒ *r*(*g*(*z*))).

 =======================================================================
