# Chapter 3 — Propositional Analysis

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_03.html](http://intrologic.stanford.edu/chapters/chapter_03.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  3 |

| Propositional Analysis |
| --- |

  =======================================================================

### 3.1 Introduction

 <p>Validity, satisfiability, falsifiability, and unsatisfiability are properties of individual sentences or sets on sentences.  In Logic, we are sometimes more concerned with relationships between sentences.  In this chapter, we look at three such relationships - logical entailment, logical equivalence, and logical consistency.  We conclude with a look at the relationship between these logical relationships and the notion of satisfiability.</p>
<p>Satisfaction is a relationship between specific sentences and specific truth assignments.  In Logic, we are sometimes more interested in the properties of sentences that hold across truth assignments.  In particular, the notion of satisfaction imposes a classification of sentences in a language based on whether there are truth assignments that satisfy that sentence.</p>

Satisfaction is a relationship between specific sentences and specific truth assignments.  In Logic, we are usually more interested in properties and relationships of sentences that hold across all truth assignments.  We begin this chapter with a look at logical properties of individual sentences (as opposed to relationships among sentences) - validity, contingency, and unsatisfiability.  We then look at three types of logical relationship between sentences - logical entailment, logical equivalence, and logical consistency.  We conclude with a discussion of the connections between the logical properties of individual sentences and logical relationships between sentences.

 =======================================================================

### 3.2 Logical Properties

In the preceding chapter, we saw that some sentences are true in some truth assignments and false in others.  However, this is not always the case.  There are sentences that are always true and sentences that are always false as well as sentences that are sometimes true and sometimes false.  This leads to a partition of sentences into three disjoint categories.

A sentence is *valid* if and only if it is satisfied by *every* truth assignment.  For example, the sentence (*p* ∨ ¬*p*) is valid.  If a truth assignment makes *p* true, then the first disjunct is true and the disjunction as a whole true.  If a truth assignment makes *p* false, then the second disjunct is true and the disjunction as a whole is true.

A sentence is *unsatisfiable* if and only if it is not satisfied by any truth assignment.  For example, the sentence (*p* ∧ ¬*p*) is unsatisfiable.  No matter what truth assignment we take, the sentence is always false.  The argument is analogous to the argument in the preceding paragraph.

Finally, a sentence is *contingent* if and only if there is some truth assignment that satisfies it and some truth assignment that falsifies it.  For example, the sentence (*p* ∧ *q*) is contingent.  If *p* and *q* are both true, it is true.  If *p* and *q* are both false, it is false.

In one sense, valid sentences and unsatisfiable sentences are useless.  Valid sentences do not rule out any possible truth assignments, and unsatisfiable sentences rule out all truth assignments.  Thus, they tell us nothing about the world.  In this regard, contingent sentences are the most useful.  On the other hand, from a logical perspective, valid and unsatisfiable sentences are useful in that, as we shall see, they serve as the basis for legal transformations that we can perform on other logical sentences.

For many purposes, it is useful to group validity, contingency, and unsatisfiability into two groups.  We say that a sentence is *satisfiable* if and only if it is valid or contingent.  In other words the sentence is satisfied by at least one truth assignment.  We say that a sentence is *falsifiable* if and only if it is unsatisfiable or contingent.  In other words, the sentence is falsified by at least one truth assignment.

 =======================================================================

### 3.3 Logical Equivalence

Intuitively, we think of two sentences as being equivalent if they say the same thing, i.e. they are true in exactly the same worlds.  More formally, we say that a sentence φ is *logically equivalent* to a sentence ψ if and only if every truth assignment that satisfies φ satisfies ψ *and* every truth assignment that satisfies ψ satisfies φ.

The sentence ¬(*p* ∨ *q*) is logically equivalent to the sentence (¬*p* ∧ ¬*q*).  If *p* and *q* are both true, then both sentences are false.  If either *p* is true or *q* is true, then the disjunction in the first sentence is true and the sentence as a whole false.  Similarly, if either *p* is true or *q* is true, then one of the conjuncts in the second sentence is false and so the sentence as a whole is false.  Since both sentences are satisfied by the same truth assignments, they are logically equivalent.

By contrast, the sentences (*p* ∧ *q*) and (*p* ∨ *q*) are not logically equivalent.  The first is false when *p* is true and *q* is false, while in this situation the disjunction is true.  Hence, they are not logically equivalent.

One way of determining whether or not two sentences are logically equivalent is to check the truth table for the proposition constants in the language. This is called the truth table method. (1) First, we form a truth table for the proposition constants and add a column for each of the sentences. (2) We then evaluate the two expressions.  (3) Finally, we compare the results.  If the values for the two sentences are the same in every case, then the two sentences are logically equivalent; otherwise, they are not.

As an example, let's use this method to show that ¬(*p* ∨ *q*) is logically equivalent to (¬*p* ∧ ¬*q*).  We set up our truth table, add a column for each of our two sentences, and evaluate them for each truth assignment.  Having done so, we notice that every row that satisfies the first sentence also satisfies the second.  Hence, the sentences are logically equivalent.

| p | q | ¬( p ∨ q ) | ¬ p ∧ ¬ q |
| --- | --- | --- | --- |
| 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 |

Now, let's do the same for (*p* ∧ *q*) and (*p* ∨ *q*).  We set up our table as before and evaluate our sentences.  In this case, there is only one row that satisfies first sentence while three rows satisfy the second.  Consequently, they are not logically equivalent.

| p | q | p ∧ q | p ∨ q |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 0 | 0 | 0 |

One of the interesting properties of logical equivalence is substitutability.  If a sentence φ is logically equivalent to a sentence ψ, then we can substitute φ for ψ in any Propositional Logic sentence and the result will be logically equivalent to the original sentence.  (Note that this is not quite true in Relational Logic, as we shall see when we cover that logic.)

 =======================================================================

### 3.4 Logical Entailment

We say that a sentence φ *logically entails* a sentence ψ (written φ ⊨ ψ) if and only if every truth assignment that satisfies φ also satisfies ψ.  More generally, we say that a set of sentences Δ *logically entails* a sentence ψ (written Δ ⊨ ψ) if and only if every truth assignment that satisfies all of the sentences in Δ also satisfies ψ.

For example, the sentence *p* logically entails the sentence (*p* ∨ *q*).  Since a disjunction is true whenever one of its disjuncts is true, then (*p* ∨ *q*) must be true whenever *p* is true.  On the other hand, the sentence *p* does *not* logically entail (*p* ∧ *q*).  Aconjunction is true if and only if *both* of its conjuncts are true, and *q* may be false.  Of course, any set of sentences containing both *p* and *q* does logically entail (*p* ∧ *q*).

Note that the relationship of logical entailment is a purely logical one.  Even if the premises of a problem do not logically entail the conclusion, this does not mean that the conclusion is necessarily false, even if the premises are true.  It just means that it is *possible* that the conclusion is false.

Once again, consider the case of (*p* ∧ *q*).  Although *p* does not logically entail this sentence, it is *possible* that both *p* and *q* are true and, therefore, (*p* ∧ *q*) is true.  However, the logical entailment does not hold because it is also possible that *q* is false and, therefore, (*p* ∧ *q*) is false.

Note also that logical entailment is not the same as logical equivalence.  The sentence *p* logically entails (*p* ∨ *q*), but (*p* ∨ *q*) does not logically entail *p*.  Logical entailment is not analogous to arithmetic equality; it is closer to arithmetic inequality.

As with logical equivalence, we can use truth tables to determine whether or not a set of premises logically entails a possible conclusion by checking the truth table for the proposition constants in the language.  (1) We form a truth table for the proposition constants and add a column for the premises and a column for the conclusion. (2) We then evaluate the premises.  (3) We evaluate the conclusion.  (4) Finally, we compare the results.  If every row that satisfies the premises also satisfies the conclusion, then the premises logically entail the conclusion.

As an example, let's use this method to show that *p* logically entails (*p* ∨ *q*).  We set up our truth table and add a column for our premise and a column for our conclusion.  In this case the premise is just p and so evaluation is straightforward; we just copy the column.    The conclusion is true if and only if *p* is true or *q* is true.  Finally, we notice that every row that satisfies the premise also satisfies the conclusion.

| p | q | p p ∨ q | p ∨ q |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 0 | 0 | 0 |

Now, let's do the same for the premise *p* and the conclusion (*p* ∧ *q*).  We set up our table as before and evaluate our premise.  In this case, there is only one row that satisfies our conclusion.  Finally, we notice that the assignment in the second row satisfies our premise but does not satisfy our conclusion; so logical entailment does not hold.

| p | q | p p ∧ q | p ∧ q |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 0 | 0 | 0 |

Now, let's look at the problem of determining whether the set of propositions {*p*, *q*} logically entails (*p* ∧ *q*).  Here we set up our table as before, but this time we have two premises to satisfy.  Only one truth assignment satisfies both premises, and this truth assignment also satisfies the conclusion; hence in this case logical entailment does hold.

| p | q | p q p ∧ q | q | p ∧ q |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 0 | 0 | 0 | 0 |

As a final example, let's return to the love life of the fickle Mary.   Here is the problem from the course introduction.  We know (*p* ⇒ *q*), i.e. if Mary loves Pat, then Mary loves Quincy.  We know (*m* ⇒ *p* ∨ *q*), i.e. if it is Monday, then Mary loves Pat or Quincy.  Let's confirm that, if it is Monday, then Mary loves Quincy.  We set up our table and evaluate our premises and our conclusion.  Both premises are satisfied by the truth assignments on rows 1, 3, 5, 7, and 8; and we notice that those truth assignments make the conclusion true.  Hence, the logical entailment holds.

| m | p | q | m ⇒ p ∨ q | p ⇒ q | m ⇒ q |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 0 | 1 |
| 0 | 0 | 1 | 1 | 1 | 1 |
| 0 | 0 | 0 | 1 | 1 | 1 |

  =======================================================================

### 3.5 Logical Consistency

A sentence φ is *consistent with* a sentence ψ if and only if there is a truth assignment that satisfies both φ and ψ.  A sentence ψ is *consistent with* a set of sentences Δ if and only if there is a truth assignment that satisfies both Δ and ψ.

For example, the sentence (*p* ∨ *q*) is consistent with the sentence (¬*p* ∨ ¬*q*).  However, it is *not* consistent with (¬*p* ∧ ¬*q*).

As with logical equivalence and logical entailment, we can use the truth table method to determine logical consistency.  The following truth table shows all truth assignments for the propositional constants in the examples just mentioned.  The third column shows the truth values for the first sentence; the fourth column shows the truth values for the second sentence, and the fifth column shows the truth values for the third sentence.  The second and third truth assignments here make (*p* ∨ *q*) true and also (¬*p* ∨ ¬*q*); hence (*p* ∨ *q*) and (¬*p* ∨ ¬*q*) are consistent.  By contrast, none of the truth assignments that makes (*p* ∨ *q*) true makes (¬*p* ∧ ¬*q*) true; hence, they are not consistent.

| p | q | p ∨ q | ¬ p ∨ ¬ q | ¬ p ∧ ¬ q |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 |
| 0 | 0 | 0 | 1 | 1 |

The distinction between entailment and consistency is a subtle one and deserves some attention.  Just because two sentences are consistent does not mean that they are logically equivalent or that either sentence logically entails the other.

Consider the sentences in the previous example.  As we have seen, the first sentence and the second sentence are logically consistent, but they are clearly not logically equivalent and neither sentence logically entails the other.

Conversely, if one sentence logically entails another this does not necessarily mean that the sentences are consistent.  This situation occurs when one of the sentences is unsatisfiable.  If a sentence is unsatisfiable, there are no truth assignments that satisfy it.  So, by definition, every truth assignment that satisfies the sentence (there are none) trivially satisfies the other sentence.

An interesting consequence of this fact is that any unsatisfiable sentence or set of sentences logically entails *everything*.  Weird fact, but it follows directly from our definitions.  And it makes clear why we want to avoid unsatisfiable sets of sentences in logical reasoning.

 =======================================================================

### 3.6 Connections Between Properties and Relationships

Before we end this chapter, it is worth noting that there are some strong connections between logical properties like validity and satisfiability and the logical relationships introduced in the preceding three sections.

First of all, there is a connection between the logical equivalence of two sentences and the validity of the biconditional sentence built from the two sentences.  In particular, we have the following theorem expressing this connection.

*Equivalence Theorem*: A sentence φ and a sentence ψ are logically equivalent if and only if the sentence (φ ⇔ ψ) is valid.

Why is this true?  Consider the definition of logical equivalence.  Two sentences are logically equivalent if and only if they are satisfied by the same set of truth assignments.  Now recall the semantics of sentences involving the biconditional operator.  A biconditional is true if and only if the truth values of the conditional sentences are the same.  Clearly, if two sentences are logically equivalent, they are satisfied by the same truth assignments, and so the corresponding biconditional must be valid.  Conversely, if a biconditional is valid, the two component sentences must be satisfied by the same truth assignments and so they are logically equivalent.

There is a similar connection between logical entailment between two sentences and the validity of the corresponding implication.  And there is a natural extension to cases of logical entailment involving finite sets of sentences.  The following theorem summarizes these results.

*Deduction Theorem*: A sentence φ logically entails a sentence ψ if and only if (φ ⇒ ψ) is valid.  More generally, a finite set of sentences {φ1, ... , φ*n*} logically entails φ if and only if the compound sentence (φ1 ∧ ... ∧ φ*n* ⇒ φ) is valid.

If a sentence φ logically entails a sentence ψ, it means that any truth assignment that satisfies φ also satisfies ψ.  Looking at the semantics of implications, we see that an implication is true if and only if every truth assignment that makes the antecedent true also makes the consequent true.  Consequently, logical entailment holds exactly when the corresponding implication is valid.

There is also a connection between logical entailment and unsatisfiability.  In particular, if a set Δ of sentences logically entails a sentence φ, then Δ together with the negation of φ must be unsatisfiable.  The reverse is also true.

*Unsatisfiability Theorem*: A set Δ of sentences logically entails a sentence φ if and only if the set of sentences Δ ∪ {¬φ} is unsatisfiable.

Suppose that  Δ logically entails φ.  If a truth assignment satisfies Δ, then it must also satisfy φ.  But then it cannot satisfy ¬φ.  Therefore, Δ ∪ {¬φ} is unsatisfiable.  Suppose that Δ∪{¬φ} is unsatisfiable.  Then every truth assignment that satisfies Δ must fail to satisfy ¬φ, i.e. it must satisfy φ.  Therefore, Δ must logically entail φ.

 An interesting consequence of this result is that we can determine logical entailment by checking for unsatisfiability.  This turns out to be useful in various logical proof methods, as described in the following chapters.

Finally, consider the definition of logical consistency.  A sentence φ is logically consistent with a sentence ψ if and only if there is a truth assignment that satisfies both φ and ψ.  This is equivalent to saying that the sentence (φ ∧ ψ) is satisfiable.

*Consistency Theorem*: A sentence φ is logically consistent with a sentence ψ if and only if the sentence (φ ∧ ψ) is satisfiable.  More generally, a sentence φ is logically consistent with a finite set of sentences {φ1, ... , φ*n*} if and only if the compound sentence (φ1 ∧ ... ∧ φ*n* ∧ φ) is satisfiable.

In thinking about these various connections, the main thing to keep in mind is that logical properties and logical relationships are metalevel.  They are things we assert in talking *about* logical sentences; they are not sentences *within* our formal language.  By contrast, implications and biconditionals and conjunctions are statements *within* our formal language; they are not metalevel statements.  What the preceding paragraphs tell us is that we can *implicitly* express some logical relationships within our formal language by writing the corresponding biconditionals and implications and conjunctions and checking for the logical properties of these sentences.

 =======================================================================

### 3.7 Equivalence Rewritings

The connections described in the preceding section are useful in solving logical problems because they allow us to transform problems of one type into problems of another type.  For example, if we needed to determine the validity of a sentence of the form (φ => ψ), the deduction theorem tells us that we could instead solve the equivalent problem of determining whether φ logically entails ψ.  In making this determination, we need to consider only those interpretations that make φ true and we can ignore all of the other interpretations.  The upshot is that solving the equivalent problem can be easier than solving the original.

The idea of problem transformation can also be used to transform problems of one type into equivalent problems of the same type.  The trick is to rewrite the sentences involved in the problem into logically equivalent sentences.  Suppose we wanted to know whether a complex sentence like ((¬*p* ∨ *q*) ⇒ (*p* ⇒ *q*)) ∧ *q* is valid, contingent, or unsatisfiable.  Since (¬*p* ∨ *q*) is logically equivalent to (*p* ⇒ *q*), we can rewrite the given sentence as  ((*p* ⇒ *q*) ⇒ (*p* ⇒ *q*)) ∧ *q*.  The first conjunct is clearly valid; the second is contingent; and so the sentence as  whole must be contingent.

The following is a list of logical equivalences that can be used in rewriting sentences as logically equivalent sentences.

| ¬¬φ ⇔ φ |
| --- |
| ¬(φ ∧ ψ) ⇔ (¬φ ∨ ¬ψ) |
| ¬(φ ∨ ψ) ⇔ (¬φ ∧ ¬ψ) |
| (φ ⇒ ψ) ⇔ (¬φ ∨ ψ) |
| (φ ⇔ ψ) ⇔ (φ ⇒ ψ) ∧ (ψ ⇒ φ) |

Of course, there are many more such equivalences.  In fact, there are infinitely many.  The ones listed here are the most common and the simplest to apply.  Moreover, as we shall see later, they are also the basis for the conversion of sentences to *clausal form*.

The idea of rewriting sentences as logically equivalent sentences can also be applied to sets.  We can transform the individual sentences in the sets; and, in some cases, we can add or delete sentences.  For example, we can replace the set {*p*, *p* ⇒ *q*} with the set {*p*, *q*}, since they are logically equivalent.

As we shall see in the next two chapters, proofs are, in a way, a special case of this idea (one where we add sentences but do not delete sentences).  For example, to prove a conclusion in the Fitch system (described in the next chapter), we start with our set of premises and incrementally add logical consequences until we produce a set containing the desired conclusion.  The resolution method (described later) is analogous; to show that a set of sentences is unsatisfiable, we start with a set of premises and add conclusions until we obtain a direct contradiction.

 =======================================================================

### Recap

A sentence is *valid* if and only if it is satisfied by *every* truth assignment.  A sentence is *unsatisfiable* if and only if it is not satisfied by any truth assignment.  A sentence is *contingent* if and only if it is both satisfiable and falsifiable, i.e. it is neither valid nor unsatisfiable.  A sentence is *satisfiable* if and only if it is either valid or contingent.  A sentence is *falsifiable* if and only if it is unsatisfiable or contingent.  A sentence φ is *logically equivalent* to a sentence ψ if and only if every truth assignment that satisfies φ satisfies ψ *and* every truth assignment that satisfies ψ satisfies φ.  A set of sentences Δ *logically entails* a sentence φ (written Δ ⊨ φ) if and only if every truth assignment that satisfies Δ also satisfies φ.  A sentence φ is *consistent with* a set of sentences Δ if and only if there is a truth assignment that satisfies both Δ and φ.  The *Equivalence Theorem* states that sentence φ and a sentence ψ are logically equivalent if and only the sentence (φ ⇔ ψ) is valid.  The *Deduction Theorem* states that a sentence φ logically entails a sentence ψ if and only the sentence (φ ⇒ ψ) is valid.  More generally, a finite set of sentences {φ1, ... , φ*n*} logically entails φ if and only if the compound sentence (φ1 ∧ ... ∧ φ1 ⇒ φ) is valid.  The *Unsatisfiability Theorem* states that a set Δ of sentences logically entails a sentence φ if and only if the set of sentences Δ ∪ {¬φ} is unsatisfiable.  The *Consistency Theorem* states that a sentence φ is consistent with a set of sentences Δ if and only if the set of sentences Δ ∪ {φ} is satisfiable.  A sentence φ is consistent with a set of sentences {φ1, ... , φ*n*} if and only if the compound sentence (φ1 ∧ ... ∧ φ1 ∧ φ) is satisfiable.  Finally, a consequence of our definitions - any unsatisfiable set of sentences logically entails everything.

 =======================================================================

### Exercises

[Exercise 3.1:](http://intrologic.stanford.edu/exercises/exercise_03_01.html) Say whether each of the following sentences is valid, contingent, or unsatisfiable.

|  | ( a ) | ( p ⇒ q ) ∨ ( q ⇒ p ) |
| --- | --- | --- |
|  | ( b ) | p ∧ ( p ⇒ ¬ q ) ∧ q |
|  | ( c ) | ( p ⇒ ( q ∧ r )) ⇔ ( p ⇒ q ) ∧ ( p ⇒ r ) |
|  | ( d ) | ( p ⇒ ( q ⇒ r )) ⇒ (( p ∧ q ) ⇒ r ) |
|  | ( e ) | ( p ⇒ q ) ∧ ( p ⇒ ¬ q ) |
|  | ( f ) | (¬ p ∨ ¬ q ) ⇒ ¬( p ∧ q ) |
|  | ( g ) | ((¬ p ⇒ q ) ⇒ (¬ q ⇒ p )) ∧ ( p ∨ q ) |
|  | ( h ) | (¬ p ∨ q ) ⇒ ( q ∧ ( p ⇔ q )) |
|  | ( i ) | ((¬ r ⇒ ¬ p ∧ ¬ q ) ∨ s ) ⇔ ( p ∨ q ⇒ r ∨ s ) |
|  | ( j ) | ( p ∧ ( q ⇒ r )) ⇔ ((¬ p ∨ q ) ⇒ ( p ∧ r )) |

[Exercise 3.2:](http://intrologic.stanford.edu/exercises/exercise_03_02.html) For each of the following pairs of sentences, determine whether or not the sentences are logically equivalent.

|  | ( a ) | ( p ⇒ q ∨ r ) and ( p ∧ q ⇒ r ) |
| --- | --- | --- |
|  | ( b ) | ( p ⇒ ( q ⇒ r )) and ( p ∧ q ⇒ r ) |
|  | ( c ) | ( p ∧ q ⇒ r ) and ( p ∧ r ⇒ q ) |
|  | ( d ) | (( p ⇒ q ∨ r ) ∧ ( p ⇒ r )) and ( q ⇒ r ) |
|  | ( e ) | (( p ⇒ q ) ∨ ( q ⇒ r )) and ( p ∨ ¬ p ) |

[Exercise 3.3:](http://intrologic.stanford.edu/exercises/exercise_03_03.html) Use the Truth Table Method to answer the following questions about logical entailment.

|  | ( a ) | { p ⇒ q ∨ r } ⊨ ( p ⇒ r ) |
| --- | --- | --- |
|  | ( b ) | { p ⇒ r } ⊨ ( p ⇒ q ∨ r ) |
|  | ( c ) | { q ⇒ r } ⊨ ( p ⇒ q ∨ r ) |
|  | ( d ) | { p ⇒ q ∨ r , p ⇒ r } ⊨ ( q ⇒ r ) |
|  | ( e ) | { p ⇒ q ∨ r , q ⇒ r } ⊨ ( p ⇒ r ) |

[Exercise 3.4:](http://intrologic.stanford.edu/exercises/exercise_03_04.html) Let Γ and Δ be sets of sentences in Propositional Logic, and let φ and ψ be individual sentences in Propositional Logic.  State whether each of the following statements is true or false.

|  | ( a ) | If Γ ⊨ φ and Δ ⊨ φ, then Γ ∩ Δ ⊨ φ. |
| --- | --- | --- |
|  | ( b ) | If Γ ⊨ φ and Δ ⊨ φ, then Γ ∪ Δ ⊨ φ. |
|  | ( c ) | If Γ ⊨ φ and Δ ⊭ φ, then Γ ∪ Δ ⊨ φ. |
|  | ( d ) | If Γ ⊭ ψ, then Γ ⊨ ¬ψ. |
|  | ( e ) | If Γ ⊨ ¬ψ, then Γ ⊭ ψ. |

[Exercise 3.5:](http://intrologic.stanford.edu/exercises/exercise_03_05.html) In each of the following cases, determine whether the given individual sentence is consistent with the given set of sentences.

|  | ( a ) | { p ∨ q , p ∨ ¬ q , ¬ p ∨ q } and (¬ p ∨ ¬ q ) |
| --- | --- | --- |
|  | ( b ) | { p ⇒ r , q ⇒ r , p ∨ q } and r |
|  | ( c ) | { p ⇒ r , q ⇒ r , p ∨ q } and ¬ r |
|  | ( d ) | { p ⇒ q ∨ r , q ⇒ r } and p ∧ q |
|  | ( e ) | { p ⇒ q ∨ r , q ⇒ r } and q ∧ r |

[Exercise 3.6:](http://intrologic.stanford.edu/exercises/exercise_03_06.html) Logical equivalence, logical entailment, and logical consistency are related to each other in interesting ways, but they are not identical.  Answer the following true or false questions about the relationships between these concepts.

|  | ( a ) | If φ is equivalent to ψ, then φ entails ψ. |
| --- | --- | --- |
|  | ( b ) | If φ is equivalent to ψ, then φ is consistent with ψ. |
|  | ( c ) | If φ entails ψ, then φ is equivalent to ψ. |
|  | ( d ) | If φ entails ψ, then φ is consistent with ψ. |
|  | ( e ) | If φ is consistent with ψ, then φ is equivalent to ψ. |
|  | ( f ) | If φ is consistent with ψ, then φ entails ψ. |

 =======================================================================
