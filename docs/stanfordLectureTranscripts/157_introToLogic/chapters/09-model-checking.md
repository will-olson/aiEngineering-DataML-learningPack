# Chapter 9 — Model Checking

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_09.html](http://intrologic.stanford.edu/chapters/chapter_09.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  9 |

| Model Checking |
| --- |

  =======================================================================

### 9.1 Introduction

In Relational Logic, it is possible to analyze the properties of sentences in much the same way as in Propositional Logic.  Given a sentence, we can determine its validity, satisfiability, and so forth by looking at possible truth assignments.  And we can confirm logical entailment or logical equivalence of sentences by comparing the truth assignments that satisfy them and those that don't.

The main problem in doing this sort of analysis for Relational Logic is that the number of possibilities is even larger than in Propositional Logic.  For a language with *n* object constants and *m* relation constants of arity *k*, the Herbrand base has *m***n**k* elements; and consequently, there are 2*m***n**k* possible truth assignments to consider.  If we have 10 objects and 5 relation constants of arity 2, this means 2500 possibilities.

Fortunately, as with Propositional Logic, there are some shortcuts that allow us to analyze sentences in Relational Logic without examining all of these possibilities.  In this chapter, we start with the truth table method and then look at some of these more efficient *relational model checking* methods.

 =======================================================================

### 9.2 Truth Tables

As in Propositional Logic, it is in principle possible to build a truth table for any set of sentences in Relational Logic.  This truth table can then be used to determine validity, satisfiability, and so forth or to determine logical entailment and logical equivalence.

As an example, let us assume we have a language with just two object constants *a* and *b* and two relation constants *p* and *q*.  Now consider the sentences shown below, and assume we want to know whether these sentences logically entail ∃*x*.*q*(*x*).

| p ( a ) ∨ p ( b ) |
| --- |
| ∀ x .( p ( x ) ⇒ q ( x )) |

A truth table for this problem is shown below.  Each of the first four columns represents one of the elements of the Herbrand base for this language.  The two middle columns represent our premises, and the final column represents the conclusion.

| p ( a ) | p ( b ) | q ( a ) | q ( b ) | p ( a ) ∨ p ( b ) | ∀ x .( p ( x ) ⇒ q ( x )) | ∃ x . q ( x ) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 0 | 1 | 0 | 0 | 1 | 1 |
| 0 | 0 | 0 | 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 | 1 | 0 |

Looking at the table, we see that there are 12 truth assignments that make the first premise true and nine that make the second premise true and five that make them both true (rows 1, 5, 6, 9, and 11).  Note that every truth assignment that makes both premises true also makes the conclusion true.  Hence, the premises logically entail the conclusion.

  iterative construction of table may save time in some cases.  =======================================================================

### 9.3 Boolean Models

A truth table is a good way of explicitly representing multiple models for a set of sentences.  In some cases, there is just one model; and in that case we can do better.

In this approach, we write out an empty table for each relation and then fill in values based on the constraints of the problem.  For example, for any unit constraint, we can immediately enter the corresponding truth value in the appropriate box.  Given these partial assignments, we then simplify the constraints, possibly leading to new unit constraints.  We continue until there are no more unit constraints.

As an example, consider the Sorority problem introduced in Chapter 1.  We are given the constraints shown below, and we want to know whether Dana likes everyone that Bess likes.  In other words, we want to confirm that, in every model that satisfies these sentences, Dana likes everyone that Bess likes.

| Dana likes Cody. |
| --- |
| Abby does not like Dana. |
| Dana does not like Abby. |
| Abby likes everyone that Bess likes. |
| Bess likes Cody or Dana. |
| Abby and Dana both dislike Bess. |
| Cody likes everyone who likes her. |
| Nobody likes herself. |

In this particular case, it turns out that there is just one model that satisfies all of these sentences.  The first step in creating this model is to create an empty table for the *likes* relation.

|  | Abby | Bess | Cody | Dana |
| --- | --- | --- | --- | --- |
| Abby |  |  |  |  |
| Bess |  |  |  |  |
| Cody |  |  |  |  |
| Dana |  |  |  |  |

The data we are given has three units - the fact that Dana likes Cody and the facts that Abby does not like Dana and Dana does not like Abby.  Using this information we can refine our model by putting a one into the third box in the fourth row and putting zeros in the fourth box of the first row and the first box of the fourth row.

|  | Abby | Bess | Cody | Dana |
| --- | --- | --- | --- | --- |
| Abby |  |  |  |  |
