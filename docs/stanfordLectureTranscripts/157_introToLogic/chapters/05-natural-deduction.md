# Chapter 5 — Natural Deduction

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_05.html](http://intrologic.stanford.edu/chapters/chapter_05.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  5 |

| Natural Deduction |
| --- |

  =======================================================================

### 5.1 Introduction

Direct deduction has the merit of being simple to understand.  Unfortunately, as we have seen, the proofs can easily become unwieldy.  The deduction theorem helps.  It assures us that, if we have a proof of a conclusion form premises, there is a proof of the corresponding implication.  However, that assurance is not itself a proof.  *Natural deduction* cures this deficiency through the use of conditional proofs.

We begin this lesson with a discussion of conditional proofs.  We then show how they are combined in the popular *Fitch proof system*.   We discuss soundness and completeness of the system.  And we finish by providing some tips for finding proofs using the Fitch system.

 =======================================================================

### 5.2 Conditional Proofs

*Conditional proofs* are similar to direct proofs in that they are sequences of reasoning steps.  However, they differ from direct proofs in that they have more structure.  In particular, sentences can be grouped into *subproofs* nested within outer *superproofs*.

As an example, consider the conditional proof shown below.  It resembles a direct proof except that we have grouped the sentences on lines 3 through 5 into a subproof within our overall proof.

| 1. | p ⇒ q |  | Premise |
| --- | --- | --- | --- |
| 2. | q ⇒ r |  | Premise |
| 3. | p |  | Assumption |
| 4. | q |  | Implication Elimination: 3, 1 |
| 5. | r |  | Implication Elimination: 4, 2 |
| 6. | p ⇒ r |  | Implication Introduction: 3, 5 |

The main benefit of conditional proofs is that they allow us to prove things that cannot be proved using only ordinary rules of inference.  In conditional proofs, we can make assumptions within subproofs; we can prove conclusions from those assumptions; and, from those derivations, we can derive implications outside of those subproofs, with our assumptions as antecedents and our conclusions as consequents.

The conditional proof above illustrates this.  On line 3, we begin a subproof with the assumption that *p* is true.  Note that *p* is not a premise in the overall problem.  In a subproof, we can make whatever assumptions that we like.  From *p*, we derive *q* using the premise on line 1; and, from that *q*, we prove *r* using the premise on line 2.  That terminates the subproof.  Finally, from this subproof, we derive (*p* ⇒ *r*) in the outer proof.  Given *p*, we can prove *r*; and so we know (*p* ⇒ *r*).  The rule used in this case is called Implication Introduction, or II for short.

As this example illustrates, there are three basic operations involved in creating useful subproofs - (1) making assumptions, (2) using ordinary rules of inference to derive conclusions, and (3) using conditional rules of inference to derive conclusions outside of subproofs.  Let's look at each of these operations in turn.

In a conditional proof, it is permissible to make an arbitrary assumption in any subproof.  The assumptions need not be members of the initial premise set.  Note that such assumptions cannot be used directly outside of the subproof, only as conditions in derived implications, so they do not contaminate the superproof or any unrelated subproofs.

For example, in the proof we just saw, we used this assumption operation in the nested subproof even though *p* was not among the given premises.

An ordinary rule of inference applies to a particular subproof of a conditional proof if and only if there is an instance of the rule in which all of the premises occur earlier in the subproof or in some superproof of the subproof.  Importantly, it is not permissible to use sentences in subproofs of that subproof or in other subproofs of its superproofs.

For example, in the conditional proof we have been looking at, it is okay to apply Implication Elimination to 1 and 3.  And it is okay to use Implication Elimination on lines 2 and 4.

However, it is *not* acceptable to use a sentence from a subproof in applying an ordinary rule of inference in a superproof.

The last line of the malformed proof shown below gives an example of this.  It is *not* permissible to use Implication Elimination as shown here because it uses a conclusion from a subproof as a premise in an application of an ordinary rule of inference in its superproof.

|  | 1. | p ⇒ q |  | Premise |  |
| --- | --- | --- | --- | --- | --- |
|  | 2. | q ⇒ r |  | Premise |  |
|  | 3. | p |  | Assumption |  |
|  | 4. | q |  | Implication Elimination: 1, 3 |  |
|  | 5. | r |  | Implication Elmination: 2, 4 |  |
|  | 6. | p ⇒ r |  | Implication Introduction: 3, 5 |  |
| Wrong! | 7. | r |  | Implication Elimination: 2, 4 | Wrong! |

The malformed proof shown below is another example.  Here, line 8 is illegal because line 4 is not in the current subproof or a superproof of this subproof.

|  | 1. | p ⇒ q |  | Premise |  |
| --- | --- | --- | --- | --- | --- |
|  | 2. | q ⇒ r |  | Premise |  |
|  | 3. | p |  | Assumption |  |
|  | 4. | q |  | Implication Elimination: 1, 3 |  |
|  | 5. | r |  | Implication Elmination: 2, 4 |  |
|  | 6. | p ⇒ r |  | Implication Introduction: 3, 5 |  |
|  | 7. | ¬ r |  | Assumption |  |
| Wrong! | 8. | r |  | Implication Elmination: 2, 4 | Wrong! |
|  | 9. | ¬ r ⇒ r |  | Implication Introduction: 7, 8 |  |

Correctly utilizing results derived in subproofs is the responsibility of a new type of rule of inference.  Like an ordinary rule of inference, a conditional rule of inference is a pattern of reasoning consisting of one or more premises and one or more conclusions.  As before, the premises and conclusions can be schemas.  However, the premises can also include conditions of the form φ ⊢ ψ.  The rule in this case is called Implication Introduction, because it allows us to introduce new implications.

| φ ⊢ ψ |
| --- |
|  |
| φ ⇒ ψ |

Finally, we define a *conditional proof* of a conclusion from a set of premises to be a sequence of (possibly nested) sentences terminating in an occurrence of the conclusion at the *top level* of the proof.  Each step in the proof must be either (1) a premise (at the top level) or an assumption (other than at the top level) or (2) the result of applying an ordinary or conditional rule of inference to earlier items in the sequence (subject to the constraints given above).

 =======================================================================

### 5.3 Fitch

Fitch is a proof system that is particularly popular in the Logic community.  It is as powerful as many other proof systems and is far simpler to use.  Fitch achieves this simplicity through its support for conditional proofs and its use of conditional rules of inference in addition to ordinary rules of inference.

Fitch has ten rules of inference in all.  Nine of these are ordinary rules of inference.  The other rule (Implication Introduction) is a conditional rule of inference.

*And Introduction* (shown below on the left) allows us to derive a conjunction from its conjuncts.  If a proof contains sentences φ1 through φ*n*, then we can infer their conjunction.  *And Elimination* (shown below on the right) allows us to derive conjuncts from a conjunction.  If we have the conjunction of φ1 through φ*n*, then we can infer any of the conjuncts.

| And Introduction φ 1 ... φ n φ 1 ∧ ... ∧ φ n | And Introduction | φ 1 | ... | φ n |  | φ 1 ∧ ... ∧ φ n |  | And Elimination φ 1 ∧ ...  ∧ φ n φ i | And Elimination | φ 1 ∧ ...  ∧ φ n |  | φ i |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| And Introduction |  |  |  |  |  |  |  |  |  |  |  |  |
| φ 1 |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |
| φ n |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ 1 ∧ ... ∧ φ n |  |  |  |  |  |  |  |  |  |  |  |  |
| And Elimination |  |  |  |  |  |  |  |  |  |  |  |  |
| φ 1 ∧ ...  ∧ φ n |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ i |  |  |  |  |  |  |  |  |  |  |  |  |

*Or Introduction* allows us to infer an arbitrary disjunction so long as at least one of the disjuncts is already in the proof.  *Or Elimination* is a little more complicated than And Elimination.  Since we do not know which of the disjuncts is true, we cannot just drop the ∨.  However, if we know that every disjunct entails some sentence, then we can infer that sentence even if we do not know which disjunct is true.

| Or Introduction φ i φ 1 ∨ ... ∨ φ n | Or Introduction | φ i |  | φ 1 ∨ ... ∨ φ n |  | Or Elimination φ 1 ∨ ...  ∨ φ n φ 1 ⇒ ψ ... φ n ⇒ ψ ψ | Or Elimination | φ 1 ∨ ...  ∨ φ n | φ 1 ⇒ ψ | ... | φ n ⇒ ψ |  | ψ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Or Introduction |  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ i |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ 1 ∨ ... ∨ φ n |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Or Elimination |  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ 1 ∨ ...  ∨ φ n |  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ 1 ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ... |  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ n ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ψ |  |  |  |  |  |  |  |  |  |  |  |  |  |

*Negation Introduction* allows us to derive the negation of a sentence if it leads to a contradiction.  If we believe (φ ⇒ ψ) and (φ ⇒ ¬ψ), then we can derive that φ is false.  *Negation Elimination* allows us to delete double negatives.

| Negation Introduction φ ⇒ ψ φ ⇒ ¬ ψ ¬φ | Negation Introduction | φ ⇒ ψ | φ ⇒ ¬ ψ |  | ¬φ |  | Negation Elimination ¬¬φ φ | Negation Elimination | ¬¬φ |  | φ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Negation Introduction |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇒ ¬ ψ |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |
| ¬φ |  |  |  |  |  |  |  |  |  |  |  |
| Negation Elimination |  |  |  |  |  |  |  |  |  |  |  |
| ¬¬φ |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |
| φ |  |  |  |  |  |  |  |  |  |  |  |

*Implication Introduction* is the conditional rule we saw in section 5.3.  If, by assuming φ, we can derive ψ, then we can derive (φ ⇒ ψ).  *Implication Elimination* is the first rule we saw Section 5.2.

| Implication Introduction φ ⊢ ψ φ ⇒ ψ | Implication Introduction | φ ⊢ ψ |  | φ ⇒ ψ |  | Implication Elimination φ ⇒ ψ φ ψ | Implication Elimination | φ ⇒ ψ | φ |  | ψ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Implication Introduction |  |  |  |  |  |  |  |  |  |  |  |
| φ ⊢ ψ |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |
| Implication Elimination |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |
| φ |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |
| ψ |  |  |  |  |  |  |  |  |  |  |  |

*Biconditional Introduction* allows us to deduce a biconditional from an implication and its inverse.  *Biconditional Elimination* goes the other way, allowing us to deduce two implications from a single biconditional.

| Biconditional Introduction φ ⇒ ψ ψ ⇒ φ φ ⇔ ψ | Biconditional Introduction | φ ⇒ ψ | ψ ⇒ φ |  | φ ⇔ ψ |  | Biconditional Elimination φ ⇔ ψ φ ⇒ ψ ψ ⇒ φ | Biconditional Elimination | φ ⇔ ψ |  | φ ⇒ ψ | ψ ⇒ φ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Biconditional Introduction |  |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |  |
| ψ ⇒ φ |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇔ ψ |  |  |  |  |  |  |  |  |  |  |  |  |
| Biconditional Elimination |  |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇔ ψ |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ ⇒ ψ |  |  |  |  |  |  |  |  |  |  |  |  |
| ψ ⇒ φ |  |  |  |  |  |  |  |  |  |  |  |  |

In addition to these rules of inference, it is common to include in Fitch proof editors several additional operations that are of use in constructing Fitch proofs.  For example, the Premise operation allows one to add a new premise to a proof.  The Reiteration operation allows one to reproduce an earlier conclusion for the purposes of clarity.  Finally, the Delete operation allows one to delete unnecessary lines.

 =======================================================================

### 5.4 Soundness And Completeness

In talking about Logic, we now have two notions - logical entailment and provability. A set of premises logically entails a conclusion if and only if every truth assignment that satisfies the premises also satisfies the conclusion.  A sentence is provable from a set of premises if and only if there is a finite proof of the conclusion from the premises.

The concepts are quite different.  One is based on truth assignments; the other is based on symbolic manipulation of expressions.  Yet, for the proof systems we have been examining, they are closely related.

We say that a proof system is *sound* if and only if every provable conclusion is logically entailed.  In other words, if Δ ⊢ φ, then Δ ⊨ φ.  We say that a proof system is *complete* if and only if every logical conclusion is provable.  In other words, if Δ ⊨ φ, then Δ ⊢ φ.

The Fitch system is sound and complete for the full language.  In other words, for this system, logical entailment and provability are identical.  An arbitrary set of sentences Δ logically entails an arbitrary sentence φ if and only if φ is provable from Δ using Fitch.

The upshot of this result is significant.  On large problems, the proof method often takes fewer steps than the truth table method.  (Disclaimer: In the worst case, the proof method may take just as many or more steps to find an answer as the truth table method.)  Moreover, proofs are usually much smaller than the corresponding truth tables. So writing an argument to convince others does not take as much space.

 =======================================================================

### 5.5 Reasoning Tips

<p>Although each of the Fitch rules is simple in itself, constructing complex proofs using the Fitch system can sometimes be difficult.  In this section, we describe some strategies to facilitate this process.  We start with some tips based solely on the form of the goal and then we discuss some tips based on the premises as well as the goal.</p>

<p>The Fitch rules are all fairly simple to use; and, as we discuss in the next section, they are all that we need to prove any result that follows logically from any set of premises.  Unfortunately, figuring out which rules to use in any given situation is not always that simple.  Fortunately, there are a few tricks that help in many cases.</p>

<p>(1) To prove a conjunction, prove the conjuncts and then use And Introduction to produce the desired conjunction.</p>

<p>(2) To prove an implication, i.e. a sentence of the form &phi; &rArr; &psi;, assume &phi;, thereby starting a subproof; try to prove &psi;; and, if successful, use Implication Introduction to discharge the subproof and prove the desired implication.</p>

<p>(3) To prove a negation, assume the target of the negated sentence to produce two implications with contradictory conclusions and then use negation introduction to produce the desired negation.</p>

<p>These particular tricks are very useful, but there are many more.  The best way to become adept at producing proofs is to start by proving simple things (e.g. various valid sentences) and then build up incrementally to more complex conclusions.</p>

The Fitch rules are all fairly simple to use; and, as we discuss in the next section, they are all that we need to prove any result that follows logically from any set of premises.  Unfortunately, figuring out which rules to use in any given situation is not always that simple.  Fortunately, there are a few tricks that help in many cases.

If the goal has the form (φ ⇒ ψ), it is often good to assume φ and prove ψ and then use Implication Introduction to derive the goal.  For example, if we have a premise *q* and we want to prove (*p* ⇒ *q*), we assume *p*, reiterate *q*, and then use Implication Introduction to derive the goal.

| 1. | q |  | Premise |
| --- | --- | --- | --- |
| 2. | p |  | Assumption |
| 3. | q |  | Reiteration: 1 |
| 4. | p ⇒ q |  | Implication Introduction: 2, 3 |

If the goal has the form (φ ∧ ψ), we first prove φ and then prove ψ and then use And Introduction to derive (φ ∧ ψ).

If the goal has the form (φ ∨ ψ), all we need to do is to prove φ or prove ψ, but we do not need to prove both.   Once we have proved either one, we can disjoin that with anything else whatsoever.

If the goal has the form (¬φ), it is often useful to assume φ and prove a contradiction, meaning that φ must be false.  To do this, we assume φ and derive some sentence ψ leading to (φ ⇒ ψ).  We assume φ again and derive some sentence ¬ψ leading to (φ ⇒ ¬ψ).  Finally, we use Negation Introduction to derive ¬φ as desired.

More generally, whenever we want to prove a sentence φ of any sort, we can sometimes succeed by assuming ¬φ, proving a contradiction as just discussed and thereby deriving ¬¬φ.  We can then apply Negation Elimination to get φ.

The following two tips suggest useful things we can try based on the form of the premises and the goal or subgoal we are trying to prove.

If there is a premise of the form (φ ⇒ ψ) and our goal is to prove ψ, then it is often useful to try proving φ.  If we succeed, we can then use Implication Elimination to derive ψ.

If we have a premise (φ ∨ ψ) and our goal is to prove χ, then we should try proving (φ ⇒ χ) and (ψ ⇒ χ).  If we succeed, we can then use Or Elimination to derive χ.

As an example of using these tips in constructing the proof, consider the following problem.  We are given *p* ∨ *q* and ¬*p*, and we are asked to prove *q*.  Since the goal is not an implication or a conjunction or a disjunction or a negation, only the last of the goal-based tips applies.  Unfortunately, this does not help us in this case.  Luckily, the second of the premise-based tips is relevant because we have a disjunction as a premise.  To use this all we need is to prove *p* ⇒ *q* and *q* ⇒ *q*.  To prove *p* ⇒ *q*, we use the first goal-based tip.  We assume *p* and try to prove *q*.  To do this we use that last goal-based tip.  We assume ~*q* and prove *p*.  Then we assume ~*q* and prove ¬*p*.  Since we have proved *p* and ¬*p* from ¬*q*, we can infer *q*. Using Implication Introduction, we then have *p* ⇒ *q*.  Proving *q* ⇒ *q* is easy.  Finally, we can apply Or Elimination to get the desired result.

| 1. | p \| q |  | Premise |
| --- | --- | --- | --- |
| 2. | ¬ p |  | Premise |
| 3. | p |  | Assumption |
| 4. | ¬ q |  | Assumption |
| 5. | p |  | Reiteration: 3 |
| 6. | ¬ q ⇒ p |  | Implication Introduction: 4, 5 |
| 7. | ¬ q |  | Assumption |
| 8. | ¬ p |  | Reiteration: 2 |
| 9. | ¬ q ⇒ ¬ p |  | Implication Introduction: 7, 8 |
| 10. | ¬¬ q |  | Negation Introduction: 6, 9 |
| 11. | q |  | Negation Elimination: 10 |
| 12. | p ⇒ q |  | Implication Introduction: 3, 11 |
| 13. | q |  | Assumption |
| 14. | q ⇒ q |  | Implication Introduction: 13 |
| 15. | q |  | Or Elimination: 1, 12, 14 |

In general, when trying to generate a proof, it is useful to apply the premise tips to derive conclusions.  However, this often works only for very short proofs.  For more complex proofs, it is often useful to think backwards from the desired conclusion before starting to prove things from the premises in order to devise a strategy for approaching the proof.  This often suggests subproblems to be solved.  We can then work on these simpler subproblems and put the solutions together to produce a proofs for our overall conclusion.

 =======================================================================

### 5.6 Some Unnecessary But Useful Rules

As just discussed, the Fitch rules of inference discussed above are complete.  They are all we need to prove any logical conclusion from any set of premises.  However, proving some conclusions can be tedious, and the resulting proofs can be hard to understand.  Adding a few additional rules makes some proofs shorter and simpler.  In this section, we discuss two such rules - False Introduction and False Elimination.

*False Introduction* allows us to deduce *false* if we have proved any sentence and its negation.  *False Elimination* allows us to deduce the negation of a sentence if we have a proof in which that sentence is an assumption and *false* is a conclusion.

| False Introduction φ ¬φ false | False Introduction | φ | ¬φ |  | false |  | False Elimination φ ⊢ false ¬φ | False Elimination |  | φ ⊢ false |  | ¬φ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| False Introduction |  |  |  |  |  |  |  |  |  |  |  |  |
| φ |  |  |  |  |  |  |  |  |  |  |  |  |
| ¬φ |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| false |  |  |  |  |  |  |  |  |  |  |  |  |
| False Elimination |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| φ ⊢ false |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |
| ¬φ |  |  |  |  |  |  |  |  |  |  |  |  |

The main benefit of these rules is that they simplify proofs by contradiction.  As an example, consider the problem of proving the sentence ¬(*p* ∧ ¬*p*).  A proof using our basic rules is shown below.  We start by assuming the negation of our conclusion, i.e. *p*∧¬*p*.  We then use And Elimination to split the conjunction; and, finally, we use False Elimination to exit the subproof and yield the desired result.

| 1. | p ∧¬ p |  | Assumption |
| --- | --- | --- | --- |
| 2. | p |  | And Elimination: 1 |
| 3. | p ∧¬ p ⇒ p |  | Implication Introduction: 1, 2 |
| 4. | p ∧¬ p |  | Assumption |
| 5. | ¬ p |  | And Elimination: 4 |
| 6. | p ∧¬ p ⇒ ¬ p |  | Implication Introduction: 4, 5 |
| 7. | ¬( p ∧¬ p ) |  | Negation Introduction: 3, 6 |

See below for a proof using our new rules.  As before, we start by assuming the negation of our conclusion, i.e. *p*∧¬*p*.  We then use And Elimination to split the conjunction, but in this case we use False Introduction to produce *false* within a single subproof.  Finally, we use False Elimination to exit the subproof and yield the desired result.

| 1. | p ∧¬ p |  | Assumption |
| --- | --- | --- | --- |
| 2. | p |  | And Elimination: 1 |
| 3. | ¬ p |  | And Elimination: 1 |
| 4. | false |  | False Introduction: 2, 3 |
| 5. | ¬( p ∧¬ p ) |  | False Elimination: 1, 4 |

This proof is only two steps shorter than the proof without the new rules of inference.  However, the proof is simpler; and the savings that comes from doing just one subproof can be more significant for more complex proofs.

 =======================================================================

### Recap

*Fitch* is a powerful yet simple proof system that supports conditional proofs.  Fitch is sound and complete for Propositional Logic.

 =======================================================================

### Exercises

[Exercise 5.1:](http://intrologic.stanford.edu/exercises/exercise_05_01.html)  Given *p* and *q* and (*p* ∧ *q* ⇒ *r*), use the Fitch system to prove *r*.

[Exercise 5.2:](http://intrologic.stanford.edu/exercises/exercise_05_02.html) Given (*p* ∧ *q*), use the Fitch system to prove (*q* ∨ *r*).

[Exercise 5.3:](http://intrologic.stanford.edu/exercises/exercise_05_03.html)  Given *p* ⇒ *q* and *q* ⇔ *r*, use the Fitch system to prove *p* ⇒ *r*.

[Exercise 5.4:](http://intrologic.stanford.edu/exercises/exercise_05_04.html) Given *p* ⇒ *q* and *m* ⇒ *p* ∨ *q*, use the Fitch System to prove *m* ⇒ *q*.

[Exercise 5.5:](http://intrologic.stanford.edu/exercises/exercise_05_05.html) Given *p* ⇒ (*q* ⇒ *r*), use the Fitch System to prove (*p* ⇒ *q*) ⇒ (*p* ⇒ *r*).

[Exercise 5.6:](http://intrologic.stanford.edu/exercises/exercise_05_06.html) Use the Fitch System to prove *p* ⇒ (*q* ⇒ *p*).

[Exercise 5.7:](http://intrologic.stanford.edu/exercises/exercise_05_07.html)  Use the Fitch System to prove (*p* ⇒ (*q* ⇒ *r*)) ⇒ ((*p* ⇒ *q*) ⇒ (*p* ⇒ *r*)).

[Exercise 5.8:](http://intrologic.stanford.edu/exercises/exercise_05_08.html)  Use the Fitch System to prove (¬*p* ⇒ *q*) ⇒ ((¬*p* ⇒ ¬*q*) ⇒ *p*).

[Exercise 5.9:](http://intrologic.stanford.edu/exercises/exercise_05_09.html) Given *p*, use the Fitch System to prove ¬¬*p*.

[Exercise 5.10:](http://intrologic.stanford.edu/exercises/exercise_05_10.html) Given *p* ⇒ *q*, use the Fitch System to prove ¬*q* ⇒ ¬*p*.

[Exercise 5.11:](http://intrologic.stanford.edu/exercises/exercise_05_11.html) Given *p* ⇒ *q*, use the Fitch System to prove ¬*p* ∨ *q*.

[Exercise 5.12:](http://intrologic.stanford.edu/exercises/exercise_05_12.html) Use the Fitch System to prove ((*p* ⇒ *q*) ⇒ *p*) ⇒ *p*.

[Exercise 5.13:](http://intrologic.stanford.edu/exercises/exercise_05_13.html) Given ¬(*p* ∨ *q*), use the Fitch system to prove (¬*p* ∧ ¬*q*).

[Exercise 5.14:](http://intrologic.stanford.edu/exercises/exercise_05_14.html) Use the Fitch system to prove the tautology (*p* ∨ ¬*p*).

 =======================================================================
