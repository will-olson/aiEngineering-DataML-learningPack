# Chapter 8 — Relational Analysis

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_08.html](http://intrologic.stanford.edu/chapters/chapter_08.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  8 |

| Relational Analysis |
| --- |

  =======================================================================

### 8.1 Introduction

This chapter focusses on the analysis of Relational Logic.  We begin with definitions for the logical properties of individual sentences - validity, contingency, and unsatisfiability.  We then turn relationships between sentences - logical equivalence, logical entailment, and logical consistency.  The definitions of these notions are the same as those in Propositional Logic, but there are differences in details as a result of differences in the syntax and semantic of the two logics.  We conclude the chapter with a discussion of the theoretical equivalence of Relational Logic and Propositional Logic.

 =======================================================================

### 8.2 Logical Properties

As we have seen, some sentences are true in some truth assignments and false in others.  However, this is not always the case.  There are sentences that are always true and sentences that are always false as well as sentences that are sometimes true and sometimes false.

As with Propositional Logic, this leads to a partition of sentences into three disjoint categories.  A sentence is *valid* if and only if it is satisfied by *every* truth assignment.  A sentence is *unsatisfiable* if and only if it is not satisfied by any truth assignment.  A sentence is *contingent* if and only if there is some truth assignment that satisfies it and some truth assignment that falsifies it.

Alternatively, we can classify sentences into two overlapping categories.  A sentence is *satisfiable* if and only if it is satisfied by at least one truth assignment, i.e. it is either valid or contingent.  A sentence is *falsifiable* if and only if there is at least one truth assignment that makes it false, i.e. it is either contingent or unsatisfiable.

Note that these definitions are the same as in Propositional Logic.  Moreover, some of our results are the same as well.  If we think of ground relational sentences as propositions, we get similar results for the two logics - a ground sentence in Relational Logic is valid / contingent / unsatisfiable if and only if the corresponding sentence in Propositional Logic is valid / contingent / unsatisfiable.

Here, for example, are Relational Logic versions of common Propositional Logic validities - the Law of the Excluded Middle, Double Negation, and deMorgan's laws for distributing negation over conjunction and disjunction.

| p ( a ) ∨ ¬ p ( a ) |
| --- |
| p ( a ) ⇔ ¬¬ p ( a ) |
| ¬( p ( a ) ∧ q ( a , b )) ⇔ (¬ p ( a ) ∨ ¬ q ( a , b )) |
| ¬( p ( a ) ∨ q ( a , b )) ⇔ (¬ p ( a ) ∧ ¬ q ( a , b )) |

Of course, not all sentences in Relational Logic are ground.  There are valid sentences of Relational Logic for which there are no corresponding sentences in Propositional Logic.

The *Common Quantifier Reversal* tells us that reversing quantifiers of the same type has no effect on truth assignment.

| ∀ x .∀ y . q ( x , y ) ⇔  ∀ y .∀ x . q ( x , y ) |
| --- |
| ∃ x .∃ y . q ( x , y ) ⇔  ∃ y .∃ x . q ( x , y ) ) |

*Existential Distribution* tells us that it is okay to move an existential quantifier inside of a universal quantifier.  (Note that the reverse is not valid, as we shall see later.)

   ∃*y*.∀*x*.*q*(*x*,*y*) ⇒  ∀*x*.∃*y*.*q*(*x*,*y*)

Finally, *Negation Distribution* tells us that it is okay to distribute negation over quantifiers of either type by flipping the quantifier and negating the scope of the quantified sentence.

| ¬∀ x . p ( x ) ⇔  ∃ x .¬ p ( x ) |
| --- |
| ¬∃ x . p ( x ) ⇔  ∀ x .¬ p ( x ) |

  =======================================================================

### 8.3 Logical Relationships

A sentence φ is *logically equivalent* to a sentence ψ if and only if every truth assignment that satisfies φ satisfies ψ *and* every truth assignment that satisfies ψ satisfies φ.  A sentence φ *logically entails* a sentence ψ (written φ ⊨ ψ) if and only if every truth assignment that satisfies φ also satisfies ψ.  A sentence φ is *consistent with* a sentence ψ if and only if there is a truth assignment that satisfies both φ and ψ.

As with validity and contingency and satisfiability, these definitions are the same for Relational Logic as for Propositional Logic.  Moreover, if we treat ground relational sentences as propositions, we get identical results.  For example, a ground premise in Relational Logic logically entails a ground conclusion in Relational Logic if and only if the corresponding Propositional Logic premise logically entails the corresponding Propositional Logic conclusion.

For example, we have the following results for logical entailment.  The sentence *p*(*a*) logically entails (*p*(*a*) ∨ *p*(*b*)).  The sentence *p*(*a*) does *not* logically entail (*p*(*a*) ∧ *p*(*b*)).  However, any set of sentences containing both *p*(*a*) and *p*(*b*) does logically entail (*p*(*a*) ∧ *p*(*b*)).

The presence of variables allows for additional relationships.  For example, the premise ∃*y*.∀*x*.*q*(*x*,*y*) logically entails the conclusion ∀*x*.∃*y*.*q*(*x*,*y*).  If there is *some* object *y* that is paired with every *x*, then every *x* has some object that it pairs with, viz. *y*.

∃*y*.∀*x*.*q*(*x*,*y*) ⊨ ∀*x*.∃*y*.*q*(*x*,*y*)

Here is another example.  The premise ∀*x*.∀*y*.*q*(*x*,*y*) logically entails the conclusion ∀*x*.∀*y*.*q*(*y*,*x*).  The first sentence says that *q* is true for all pairs of objects, and the second sentence says the exact same thing.  In cases like this, we can interchange variables.

∀*x*.∀*y*.*q*(*x*,*y*) ⊨ ∀*x*.∀*y*.*q*(*y*,*x*)

Understanding logical relationships between Relational Logic sentences is complicated by the fact that it is possible to have free variables in those sentences.  Consider, for example, the premise *q*(*x*,*y*) and the conclusion *q*(*y*,*x*).  Does *q*(*x*,*y*) logically entail *q*(*y*,*x*) or not?

Our definitions and the semantics of Relational Logic give a clear answer to questions like these.  Logical entailment holds if and only if every truth assignment that satisfies the premise satisfies the conclusion.  A truth assignment satisfies a sentence with free variables if and only if it satisfies every instance.  In other words, a sentence with free variables is equivalent to the sentence in which all of the free variables are universally quantified.  In other words, *q*(*x*,*y*) is satisfied if and only if ∀*x*.∀y.*q*(*x*,*y*) is satisfied, and similarly for *q*(*y*,*x*).  So, the first sentence here logically entails the second if and only if ∀*x*.∀y.*q*(*x*,*y*) logically entails ∀*x*.∀y.*q*(*y*,*x*); and, as we just saw, this is, in fact, the case.

 =======================================================================

### 8.4 Relational Logic and Propositional Logic

One interesting feature of *Relational Logic* (RL) is that it is expressively equivalent to Propositional Logic (PL).  For any RL language, we can produce a pairing between the ground relational sentences in that language and the proposition constants in a PL language.  Given this correspondence, for any set of *arbitrary* sentences in our RL language, there is a corresponding set of sentences in the language of PL such that any RL truth assignment that satisfies our RL sentences agrees with the corresponding PL truth assignment applied to the PL sentences.

The procedure for transforming our RL sentences to PL has multiple steps, but each step is easy.  We first convert our sentences to prenex form, then we ground the result, and we rewrite in PL.  Let's look at these steps in turn.

A sentence is in *prenex form* if and only if it is closed and all of the quantifiers are on the outside of all logical operators.

 Converting  a set of RL sentences to a logically equivalent set in prenex form is simple.  First, we rename variables in different quantified sentences to eliminate any duplicates.  We then apply quantifier distribution rules in reverse to move quantifiers outside of logical operators.  Finally, we universally quantify any free variables in our sentences.

For example, to convert the sentence ∀*y*.*p*(*x*,*y*) ∨ ∃*y*.*q*(*y*) to prenex form, we first rename one of the variables.  In this case, let's rename the *y* in the second disjunct to *z*.  This results in the sentence ∀*y*.*p*(*x*,*y*) ∨ ∃*z*.*q*(*z*).  We then apply the distribution rules in reverse to produce ∀*y*.∃*z*.(*p*(*x*,*y*) ∨ *q*(*z*)).  Finally, we universally quantify the free variable *x* to produce the prenex form of our original sentence, viz. ∀*x*.∀*y*.∃*z*.(*p*(*x*,*y*) ∨ *q*(*z*))

Once we have a set of sentences in prenex form, we compute the grounding.  We start with our initial set Δ of sentences and we incrementally build up our grounding Γ.  On each step we process a sentence in Δ, using the procedure described below.  The procedure terminates when Δ becomes empty.  The set Γ at that point is the grounding of the input.

(1) The first rule covers the case when the sentence φ being processed is ground.  In this case, we remove the sentence from Delta and add it to Gamma.

| Δ i +1 = Δ i - {φ} |
| --- |
| Γ i +1 = Γ i ∪ {φ} |

(2) If our sentence is of the form ∀ν.φ[ν], we eliminate the sentence from Δ*i* and replace it with copies of the scope, one copy for each object constant τ in our language.

| Δ i +1 = Δ i - {∀ν.φ[ν]} ∪ {φ[τ] \| τ an object constant} |
| --- |
| Γ i +1 = Γ i |

(3)  If our sentence of the form ∃ν.φ[ν], we eliminate the sentence from Δ*i* and replace it with a disjunction, where each disjunct is a copy of the scope in which the quantified variable is replaced by an object constant in our language.

| Δ i +1 = Δ i - {∃ν.φ[ν]} ∪ {φ[τ 1 ] ∨ ... ∨ φ[τ n ]} |
| --- |
| Γ i +1 = Γ i |

The procedure halts when Δ*i* becomes empty.   The set Γ*i* is the grounding of the input.  It is easy to see that Γ*i* is logically equivalent to the input set.

Here is an example.  Suppose we have a language with just two object constants *a* and *b*.  And suppose we have the set of sentences shown below.  We have one ground sentence, one universally quantified sentence, and one existentially quantified sentence.  All are in prenex form.

{*p*(*a*), ∀*x*.(*p*(*x*) ⇒ *q*(*x*)), ∃*x*.¬*q*(*x*)}

A trace of the procedure is shown below.  The first sentence is ground, so we remove it from Δ add it to Γ.  The second sentence is universally quantified, so we replace it with a copy for each of our two object constants.  The resulting sentences are ground, and so we move them one by one from Δ to Γ.  Finally, we ground the existential sentence and add the result to Δ and then move the ground sentence to Γ.  At this point, since Δ is empty, Γ is our grounding.

| Δ 0 = { p ( a ), ∀ x .( p ( x ) ⇒ q ( x )), ∃ x .¬ q ( x )} |
| --- |
| Γ 0 = {} |
|  |
| Δ 1 = {∀ x .( p ( x ) ⇒ q ( x )), ∃ x .¬ q ( x )} |
| Γ 1 = { p ( a )} |
|  |
| Δ 2 = { p ( a ) ⇒ q ( a ), p ( b ) ⇒ q ( b ), ∃ x .¬ q ( x )} |
| Γ 2 = { p ( a )} |
|  |
| Δ 3 = { p ( b ) ⇒ q ( b ), ∃ x .¬ q ( x )} |
| Γ 3 = { p ( a ), p ( a ) ⇒ q ( a )} |
|  |
| Δ 4 = {∃ x .¬ q ( x )} |
| Γ 4 = { p ( a ), p ( a ) ⇒ q ( a ), p ( b ) ⇒ q ( b )} |
|  |
| Δ 5 = {¬ q ( a ) ∨ ¬ q ( b )} |
| Γ 5 = { p ( a ), p ( a ) ⇒ q ( a ), p ( b ) ⇒ q ( b )} |
|  |
| Δ 6 = {} |
| Γ 6 = { p ( a ), p ( a ) ⇒ q ( a ), p ( b ) ⇒ q ( b ), ¬ q ( a ) ∨ ¬ q ( b )} |

Once we have a grounding Γ, we replace each ground relational sentence in Γ by a proposition constant.  The resulting sentences are all in Propositional Logic; and the set is equivalent to the sentences in Δ in that any RL truth assignment that satisfies our RL sentences agrees with the corresponding Propositional Logic truth assignment applied to the Propositional Logic sentences.

For example, let's represent the RL sentence *p*(*a*) with the proposition *pa*; let's represent *p*(*b*) with *pb*; let's represent *q*(*a*) with *qa*; and let's represent *q*(*b*) with *qb*.  With this correspondence, we can represent the sentences in our grounding with the Propositional Logic sentences shown below.

{*pa*, *pa* ⇒ *qa*, *pb* ⇒ *qb*, ¬*qa* ∨ ¬*qb*}

Since the question of unsatisfiability for PL is decidable, then the question of unsatisfiability for RL is also decidable.  Since logical entailment and unsatisfiability are correlated, we also know that the question of logical entailment for RL is decidable.

Another consequence of this correspondence between RL and PL is that, like PL, RL is *compact* - every unsatisfiable set of sentences contains a finite subset that is unsatisfiable.  This is important as it assures us that we can demonstrate the unsatisfiability by analyzing just a finite set of sentences; and, as we shall see in the next chapter, logical entailment can be demonstrated with finite proofs.

 =======================================================================

### Recap

A sentence is *valid* if and only if it is satisfied by *every* truth assignment.  A sentence is *satisfiable* if and only if it is satisfied by at least one truth assignment.  A sentence is *falsifiable* if and only if there is at least one truth assignment that makes it false.  A sentence is *unsatisfiable* if and only if it is not satisfied by any truth assignment.  A sentence is *contingent* if and only if it is both satisfiable and falsifiable, i.e. it is neither valid nor unsatisfiable.  A set of sentences Δ *logically entails* a sentence φ (written Δ ⊨ φ) if and only if every truth assignment that satisfies Δ also satisfies φ.

 =======================================================================

### Exercises

[Exercise 8.1:](http://intrologic.stanford.edu/exercises/exercise_08_01.html) Say whether each of the following sentences is valid, contingent, or unsatisfiable.

|  | ( a ) | ∀ x . p ( x ) ⇒ ∃ x . p ( x ) |
| --- | --- | --- |
|  | ( b ) | ∃ x . p ( x ) ⇒ ∀ x . p ( x ) |
|  | ( c ) | ∀ x . p ( x ) ⇒ p ( x ) |
|  | ( d ) | ∃ x . p ( x ) ⇒ p ( x ) |
|  | ( e ) | p ( x ) ⇒ ∀ x . p ( x ) |
|  | ( f ) | p ( x ) ⇒ ∃ x . p ( x ) |
|  | ( g ) | ∀ x .∃ y . p ( x , y ) ⇒ ∃ y .∀ x . p ( x , y ) |
|  | ( h ) | ∀ x .( p ( x ) ⇒ q ( x )) ⇒ ∃ x .( p ( x ) ∧ q ( x )) |
|  | ( i ) | ∀ x .( p ( x ) ⇒ q ( x )) ∧ ∃ x .( p ( x ) ∧ ¬ q ( x )) |
|  | ( j ) | (∃ x . p ( x ) ⇒ ∀ x . q ( x )) ∨ (∀ x . q ( x ) ⇒ ∃ x . r ( x )) |

[Exercise 8.2:](http://intrologic.stanford.edu/exercises/exercise_08_02.html) Let Γ be a set of Relational Logic sentences, and let φ and ψ be individual Relational Logic sentences.  For each of the following claims, state whether it is true or false.

|  | ( a ) | ∀ x .φ ⊨ φ |
| --- | --- | --- |
|  | ( b ) | φ ⊨ ∀ x .φ |
|  | ( c ) | If Γ ⊨ ¬φ[τ] for some ground term τ, then Γ ⊭ ∀ x .φ[ x ] |
|  | ( d ) | If Γ ⊨ φ[τ] for some ground term τ, then Γ ⊨ ∃ x .φ[ x ] |
|  | ( e ) | If Γ ⊨ φ[τ] for every ground term τ, then Γ ⊨ ∀ x .φ[ x ] |

[Exercise 8.3:](http://intrologic.stanford.edu/exercises/exercise_08_03.html) Consider a version of the Blocks World with just three blocks - *a*, *b*, and *c*.  The *on* relation is axiomatized below.

| ¬ | on ( a , a ) |  |  | on ( a , b ) |  | ¬ | on ( a , c ) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ¬ | on ( b , a ) |  | ¬ | on ( b , b ) |  |  | on ( b , c ) |
| ¬ | on ( c , a ) |  | ¬ | on ( c , b ) |  | ¬ | on ( c , c ) |

Let's suppose that the *above* relation is defined as follows.

∀*x*.∀*z*.(*above*(*x*,*z*) ⇔ *on*(*x*,*z*) ∨ ∃*y*.(*above*(*x*,*y*) ∧ *above*(*y*,*z*)))

A sentence φ is consistent with a set Δ of sentences if and only if there is a truth assignment that satisfies all of the sentences in Δ ∪ {φ}.  Say whether each of the following sentences is consistent with the sentences about *on* and *above* shown above.

|  | ( a ) | above ( a , c ) |
| --- | --- | --- |
|  | ( b ) | above ( a , a ) |
|  | ( c ) | above ( c , a ) |

 =======================================================================
