# Chapter 4 — Direct Proofs

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_04.html](http://intrologic.stanford.edu/chapters/chapter_04.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  4 |

| Direct Proofs |
| --- |

  =======================================================================

### 4.1 Introduction

Checking logical entailment with truth tables has the merit of being conceptually simple.  However, it is not always the most practical method.  The number of truth assignments of a language grows exponentially with the number of logical constants.  When the number of logical constants in a propositional language is large, it may be impossible to process its truth table.

Proof methods provide an alternative way of checking logical entailment that addresses this problem.  In many cases, it is possible to create a proof of a conclusion from a set of premises that is much smaller than the truth table for the language; moreover, it is often possible to find such proofs with less work than is necessary to check the entire truth table.

We begin this lesson by defining some basic concepts - axiom schemas, rules of inference, and direct proofs.  We then look at a couple of proof systems, with emphasis on one particular proof system, viz. the *Hilbert system*.  After that, we look at the properties of soundness and completeness - the standards by which proof systems are judged.  Finally, we look at hierarchical proofs and some meta-theorems about proofs.

 =======================================================================

### 4.2 Axiom Schemas

An *axiom schema* (or *schema*) is an expression satisfying the grammatical rules of our language except for the occurrence of *metavariables* (written here as Greek letters) in place of various subparts of the expression. For example, the following expression is a schema with metavariables φ and ψ.

 φ ⇒ (ψ ⇒ φ)

An instance of an axiom schema is the sentence obtained by consistently substituting sentences for the metavariables in the rule.  For example, the following are all instances of the schema above.

| p ⇒ ( q ⇒ p ) |
| --- |
| p ⇒ ( p ⇒ p ) |
| ¬ p ⇒ ( q ⇒ ¬ p ) |
| ( p ⇒ q ) ⇒ (( q ⇒ r ) ⇒ ( p ⇒ q )) |

An axiom schema is *valid* if and only if every instance of the schema is valid.  The schema above is valid, as are the schemas shown below.

| Reflexivity | φ ⇒ φ |
| --- | --- |
| Negation Elimination | ¬¬φ ⇒ φ |
| Negation Introduction | φ ⇒ ¬¬φ |
| Tautology | φ ∨ ¬φ |

In what follows, we use both non-valid and valid axiom schemas.  Non-valid schemas play a role in defining rules of inference, and valid schemas are used as components of deductive proof systems.

 =======================================================================

### 4.3 Rules of Inference

A *rule of inference* is a pattern of reasoning consisting of some schemas, called *premises*, and one or more additional schemas, called *conclusions*.  Rules of inference are often written as shown below.  The schemas above the line are the premises, and the schemas below the line are the conclusions.

| φ ⇒ ψ |
| --- |
| φ |
|  |
| ψ |

The rule in this case is called *Implication Elimination* (or IE), because it eliminates the implication from the first premise.

*Implication Creation* (IC), shown below, is another example.  This rule tells us that, if a sentence ψ is true, we can infer (φ ⇒ ψ) for any φ whatsoever.

| ψ |
| --- |
|  |
| φ ⇒ ψ |

*Implication Distribution* (ID) tells us that implication can be distributed over other implications.  If (φ ⇒ (ψ ⇒ χ)) is true, then we can infer ((φ ⇒ ψ) ⇒ (φ ⇒ χ)).

| φ ⇒ (ψ ⇒ χ) |
| --- |
|  |
| (φ ⇒ ψ) ⇒ (φ ⇒ χ) |

*Implication Reversal* (IR) allows us to infer an implication if we have an implication with the arguments reversed and negated.  If we know (¬ψ ⇒ ¬φ), we can infer (φ ⇒ ψ).

| ¬ψ ⇒ ¬φ |
| --- |
|  |
| φ ⇒ ψ |

An instance of a rule of inference is the rule obtained by consistently substituting sentences for the metavariables in the rule.  For example, the following is an instance of Implication Elimination.

| p ⇒ q |
| --- |
| p |
|  |
| q |

If a metavariable occurs more than once, the same expression must be used for every occurrence.  For example, in the case of Implication Elimination, it would not be acceptable to replace one occurrence of φ with one expression and the other occurrence of φ with a different expression.

Note that the replacement can be an arbitrary expression so long as the result is a legal expression.  For example, in the following instance of Implication Elimination, we have replaced the variables by compound sentences.

| ( p ⇒ q ) ⇒ ( q ⇒ r ) |
| --- |
| ( p ⇒ q ) |
|  |
| ( q ⇒ r ) |

Remember that there are infinitely many sentences in our language.  Even though we start with finitely many propositional constants (in a propositional vocabulary) and finitely many operators, we can combine them in arbitrarily many ways.  The upshot is that there are infinitely many instances of any rule of inference involving metavariables.

A rule *applies* to a set of sentences if and only if there is an instance of the rule in which all of the premises are in the set.  In this case, the conclusions of the instance are the results of the rule application.

For example, if we had a set of sentences containing the sentence *p* and the sentence (*p* ⇒ *q*), then we could apply Implication Elimination to derive *q* as a result.  If we had a set of sentences containing the sentence (*p* ⇒ *q*) and the sentence (*p* ⇒ *q*) ⇒ (*q* ⇒ *r*), then we could apply Implication Elimination to derive (*q* ⇒ *r*) as a result.

In using rules of inference, it is important to remember that they apply only to top-level sentences, not to components of sentences.  While applying to components sometimes works, it can also lead to incorrect results.

As an example of such a problem, consider the incorrect application of Implication Elimination shown below.  Suppose we believe (*p* ⇒ *q*) and (*p* ⇒ *r*).  We might try to apply Implication Elimination here, taking the first premise as the implication and taking the occurrence of *p* in the second premise as the matching condition, leading us to conclude (*q* ⇒ *r*).

|  | p ⇒ q |  |
| --- | --- | --- |
|  | p ⇒ r |  |
|  |  |  |
| Wrong! | q ⇒ r | Wrong! |

Unfortunately, this is not a proper logical conclusion from the premises, as we all know from experience and as we can quickly determine by looking at the associated truth table.  It is important to remember that rules of inference apply only to top-level sentences.

 =======================================================================

### 4.4 Direct Proofs

By writing down premises, writing instances of axiom schemas, and applying rules of inference, it is possible to derive conclusions that cannot be derived from the premises in a single step.  This idea of stringing things together in this way leads to the notion of a direct proof.

A *direct proof* of a conclusion from a set of premises is a sequence of sentences terminating in the conclusion in which each item is either (1) a premise, (2) an instance of an axiom schema, or (3) the result of applying a rule of inference to earlier items in sequence.

Here is an example.  Suppose we have the set of sentences we saw earlier.  We start our proof by writing out our premises.  We believe *p*; we believe (*p* ⇒ *q*); and we believe that (*p* ⇒ *q*) ⇒ (*q* ⇒ *r*).  Using Implication Elimination on the first premise and the second premise, we derive *q*.  Applying Implication Elimination to the second premise and the third premise, we derive (*q* ⇒ *r*).  Finally, we use the derived premises on lines 4 and 5 to arrive at our desired conclusion.

| 1. | p | Premise |
| --- | --- | --- |
| 2. | p ⇒ q | Premise |
| 3. | ( p ⇒ q ) ⇒ ( q ⇒ r ) | Premise |
| 4. | q | Implication Elimination: 2, 1 |
| 5. | q ⇒ r | Implication Elimination: 3, 2 |
| 6. | r | Implication Elimination: 5, 4 |

Here is another example.  Whenever *p* is true, *q* is true. Whenever *q* is true, *r* is true.  With these as premises, we can prove that, whenever *p* is true, *r* is true.  On line 3, we use Implication Creation to derive (*p* ⇒ (*q* ⇒ *r*)).  On line 4, we use Implication Distribution to distribute the implication in line 3.  Finally, on line 5, we use Implication Elimination to produce the desired result.

| 1. | p ⇒ q | Premise |
| --- | --- | --- |
| 2. | q ⇒ r | Premise |
| 3. | p ⇒ ( q ⇒ r ) | Implication Creation: 2 |
| 4. | ( p ⇒ q ) ⇒ ( p ⇒ r ) | Implication Distribution: 3 |
| 5. | p ⇒ r | Implication Elimination: 4, 1 |

Let R be a set of rules of inference.  If there exists a proof of a sentence φ from a set Δ of premises using the rules of inference in R, we say that φ is *provable* from Δ using R.  We usually write this as Δ ⊢R φ, using the provability operator ⊢ (which is sometimes called *single turnstile*).  If the set of rules is clear from context, we usually drop the subscript, writing just Δ ⊢ φ.

 =======================================================================

### 4.5 Proof Systems

A *proof system* is a finite set of axiom schemata and rules of inference.  Although it is interesting to consider proof systems with non-valid axiom schemata or unsound rules of inference, in this book we concentrate exclusively on proof systems with valid axiom schemata and sound rules of inference.

The *Hilbert System* is a well-known proof system for Propositional Logic.  It has one rule of inference, viz. Implication Elimination.

| φ ⇒ ψ |
| --- |
| φ |
|  |
| ψ |

In addition, the Hilbert systems has three axiom schemas.  See below.  These are the axiomatic versions of rules of inference we saw earlier.  In the Hilbert system, each rule takes the form of an implication.  The premises of each rule are written as antecedents of an implication and the rule's conclusion is written as the consequent of the implication.

| Implication Creation (IC) | φ ⇒ (ψ ⇒ φ) |
| --- | --- |
| Implication Distribution (ID) | (φ ⇒ (ψ ⇒ χ)) ⇒  ((φ ⇒ ψ) ⇒ (φ  ⇒ χ)) |
| Implication Reversal (IR) | (¬ψ ⇒ ¬φ) ⇒ (φ ⇒ ψ) |

As an example of the Hilbert system in action, consider the proof shown below.  Our premises are (*p* ⇒ *q*) and (*q* ⇒ *r*), and our goal is to prove (*p* ⇒ *r*).  We start our proof by writing out our premises.  We write down an instance of our Implication Creation schema and then use Implication Elimination to conclude (*p* ⇒ (*q* ⇒ *r*)).  We then write down an instance of our Implication Distribution Schema to conclude ((*p* ⇒ *q*) ⇒ (*p* ⇒ *r*)).  Finally, we use Implication Elimination to produce the desired conclusion.

| 1. | p ⇒ q | Premise |
| --- | --- | --- |
| 2. | q ⇒ r | Premise |
| 3. | ( q ⇒ r ) ⇒ ( p ⇒ ( q ⇒ r )) | Implication Creation |
| 4. | p ⇒ ( q ⇒ r ) | Implication Elimination: 3, 2 |
| 5. | ( p ⇒ ( q ⇒ r )) ⇒ (( p ⇒ q ) ⇒ ( p ⇒ r )) | Implication Distribution |
| 6. | ( p ⇒ q ) ⇒ ( p ⇒ r ) | Implication Elimination: 5, 4 |
| 7. | p ⇒ r | Implication Elimination: 6, 1 |

The Hilbert System is interesting in that is sufficient to prove all logical consequences from any set of premises expressed using only ¬ and ⇒.  And, as we shall see later, this subset of sentences is interesting because, for every sentence in Propositional Logic, there is a logically equivalent sentence written in terms of just these two operators.  Moreover, there is an inexpensive algorithm for converting every Propositional Logic sentence to its equivalent sentence in this form.

 =======================================================================

### 4.6 Soundness And Completeness

In talking about Logic, we now have two notions - logical entailment and provability. A set of premises logically entails a conclusion if and only if every truth assignment that satisfies the premises also satisfies the conclusion.  A sentence is provable from a set of premises if and only if there is a finite proof of the conclusion from the premises.

The concepts are quite different.  One is based on truth assignments; the other is based on symbolic manipulation of expressions.  Yet, for the proof systems we have been examining, they are closely related.

We say that a proof system is *sound* if and only if every provable conclusion is logically entailed.  In other words, if Δ ⊢ φ, then Δ ⊨ φ.  We say that a proof system is *complete* if and only if every logical conclusion is provable.  In other words, if Δ ⊨ φ, then Δ ⊢ φ.

The Hilbert system is sound and complete for Propositional Logic.  In other words, for this system, logical entailment and provability are identical.  An arbitrary set of sentences Δ logically entails an arbitrary sentence φ if and only if φ is provable from Δ using Hilbert.

The upshot of this result is significant.  On large problems, the proof method often takes fewer steps than the truth table method.  (Disclaimer: In the worst case, the proof method may take just as many or more steps to find an answer as the truth table method.)  Moreover, proofs are usually much smaller than the corresponding truth tables. So writing an argument to convince others does not take as much space.

 ======================================================================= <h3>4.5 <a name='section_04_07'>Practical Matters</a></h3> =======================================================================

### Recap

An *axiom schema* is an expression satisfying the grammatical rules of our language except for the occurrence of *metavariables* in place of various subparts of the expression.  An *instance* of a schema is the expression obtained by substituting expressions of the appropriate sort for the metavariables in the schema so that the result is a legal expression.  A *valid axiom schema* is one for which all instances are valid sentences.  A *rule of inference* is a pattern of reasoning consisting of a set of schemas, called *premises*, and a second set of schemas, called *conclusions*.  A *direct proof* of a conclusion from a set of premises is a sequence of sentences terminating in the conclusion in which each item is either (1) a premise, (2) an instance of an axiom schema, or (2) the result of applying a rule of inference to earlier items in sequence.  If there exists a proof of a sentence φ from a set Δ of premises and the axiom schemas and rules of inference of a proof system, then φ is said to be *provable* from Δ (written as Δ ⊢ φ) and is called a *theorem* of Δ.  A *proof system* is a finite set of axiom schemata and rules of inference.  A proof system is *sound* if and only if every provable conclusion is logically entailed.  A proof system is *complete* if and only if every logical conclusion is provable.  The Hilbert System is sound and complete for Propositional Logic.

 =======================================================================

### Exercises

[Exercise 4.1:](http://intrologic.stanford.edu/exercises/exercise_04_01.html)  Given (*p* ⇒ (*q*⇒ *r*)) and (*p* ⇒ *q*), use the Hilbert system to prove (*p* ⇒ *r*).

[Exercise 4.2:](http://intrologic.stanford.edu/exercises/exercise_04_02.html)  Given (*q* ⇒ *r*), use the Hilbert system to prove ((*p* ⇒ *q*) ⇒ (*p* ⇒ *r*)).

[Exercise 4.3:](http://intrologic.stanford.edu/exercises/exercise_04_03.html)  Given *p* and ¬*p*, use the Hilbert system to prove *q*.

[Exercise 4.4:](http://intrologic.stanford.edu/exercises/exercise_04_04.html)  Use the Hilbert system to prove (*p* ⇒ *p*).  No premises needed since this sentence is valid.

[Exercise 4.5:](http://intrologic.stanford.edu/exercises/exercise_04_05.html)  Given *p* and ¬*p*, use the Hilbert system to prove (¬*p* ⇒ (*p* ⇒ *q*)).  No premises needed since this sentence is valid.

 =======================================================================
