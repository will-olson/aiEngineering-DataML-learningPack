# Chapter 13 — Induction

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_13.html](http://intrologic.stanford.edu/chapters/chapter_13.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  13 |

| Induction |
| --- |

  =======================================================================

### 13.1 Introduction

Induction is reasoning from the specific to the general.  If various instances of a schema are true and there are no counterexamples, we are tempted to conclude a universally quantified version of the schema.

| p ( a ) ⇒ q ( a ) |  |  |
| --- | --- | --- |
| p ( b ) ⇒ q ( b ) → ∀ x .( p ( x ) ⇒ q ( x )) | → | ∀ x .( p ( x ) ⇒ q ( x )) |
| p ( c ) ⇒ q ( c ) |  |  |

*Incomplete induction* is induction where the set of instances is not exhaustive.  From a reasonable collection of instances, we sometimes leap to the conclusion that a schema is always true even though we have not seen all instances.  Consider, for example, the function *f* where *f*(1)=1, and *f*(*n*+1)=*f*(*n*) + 2*n* + 1.  If we look at some values of this function, we notice a certain regularity - the value of *f* always seems to be the square of its input.  From this sample, we are tempted to leap to the conclusion that *f*(*n*)=*n*2.  Lucky guess.  In this case, the conclusion happens to be true; and we can prove it.

| n | f ( n ) | n 2 |  | 1 | 1 | 1 | 2 | 4 | 2 2 | 3 | 9 | 3 2 | 4 | 16 | 4 2 | 5 | 25 | 5 2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | 1 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | 4 | 2 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | 9 | 3 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | 16 | 4 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | 25 | 5 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Here is another example.  This one is due to the mathematician Fermat (1601-1665).  He looked at values of the expression 22*n* + 1 for various values of *n* and noticed that they were all prime.  So, he concluded the value of the expression was prime number.  Unfortunately, this was not a lucky guess.  His conjecture was ultimately disproved, in fact with the very next number in the sequence.  (Mercifully, the counterexample was found after his death.)

| n | 2 2 n +1 | Prime? |  | 1 | 5 | Yes | 2 | 17 | Yes | 3 | 257 | Yes | 4 | 65537 | Yes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | 5 | Yes |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | 17 | Yes |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | 257 | Yes |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | 65537 | Yes |  |  |  |  |  |  |  |  |  |  |  |  |  |

For us, this is not so good.  In Logic, we are concerned with logical entailment.  We want to derive only conclusions that are guaranteed to be true when the premises are true.  Guesses like these are useful in suggesting possible conclusions, but they are not themselves proofs.  In order to be sure of universally quantified conclusions, we must be sure that *all* instances are true.  This is called *complete induction*.  When applied to numbers, it is usually called *mathematical induction*.

The technique used for complete induction varies with the structure of the language to which it is applied.  We begin this chapter with a discussion of domain closure, a rule that applies when the Herbrand base of our language is finite.  We then move on to Linear Induction, i.e. the special case in which the ground terms in the language form a linear sequence.  We look at tree induction, i.e. the special case in which the ground terms of the language form a tree.  And we look at Structural Induction, which applies to all languages.  Finally, we look at two special cases that make inductive reasoning more complicated - Multidimensional Induction and Embedded Induction.

 =======================================================================

### 13.2 Domain Closure

Induction for finite languages is trivial.  We simply use the Domain Closure rule of inference (DC).  For a language with object constants σ1, ... , σ*n*, the rule is written as shown below.  If we believe a schema is true for every instance, then we can infer a universally quantified version of that schema.

| φ[σ 1 ] |
| --- |
| ... |
| φ[σ n ] |
|  |
| ∀ν.φ[ν] |

Recall that, in our formalization of the Sorority World, we have just four constants - *abby*, *bess*, *cody*, and *dana*.  For this language, we would have the following Domain Closure rule.

| Domain Closure (DC) |
| --- |
| φ[ abby ] |
| φ[ bess ] |
| φ[ cody ] |
| φ[ dana ] |
|  |
| ∀ν.φ[ν] |

The following proof shows how we can use this rule to derive an inductive conclusion.  Given the premises we considered earlier in this book, it is possible to infer that Abby likes someone, Bess likes someone, Cody likes someone, and Dana likes someone.  Taking these conclusions as premises and using our Domain Closure rule, we can then derive the inductive conclusion ∀*x*.∃*y*.*likes*(*x*,*y*), i.e. everybody likes somebody.

| 1. | ∃ y . likes ( abby , y ) |  | Premise |
| --- | --- | --- | --- |
| 2. | ∃ y . likes ( bess , y ) |  | Premise |
| 3. | ∃ y . likes ( cody , y ) |  | Premise |
| 4. | ∃ y . likes ( dana , y ) |  | Premise |
| 5. | ∀ x .∃ y . likes ( x , y ) |  | DC: 1, 2, 3, 4 |

Unfortunately, this technique does not work when there are infinitely many ground terms.  Suppose, for example, we have a language with ground terms σ1, σ*2*, ...  A direct generalization of the Domain Closure rule is shown below.

| φ[σ 1 ] |
| --- |
| φ[σ 2 ] |
| ... |
|  |
| ∀ν.φ[ν] |

This rule is sound in the sense that the conclusion of the rule is logically entailed by the premises of the rule.  However, it does not help us produce a proof of this conclusion.  To use the rule, we would need to prove all of the rule's premises.  Unfortunately, there are infinitely many premises.  So, the rule cannot be used in generating a finite proof.

All is not lost.  It is sometimes possible to write rules that cover all instances without enumerating them individually.  The method depends on the structure of the language.  The next sections describe how this can be done for languages with different structures.

 =======================================================================

### 13.3 Linear Induction

Imagine an infinite set of dominoes placed in a line so that, when one falls, the next domino in the line also falls.  If the first domino falls, then the second domino falls. If the second domino falls, then the third domino falls.  And so forth.  By continuing this chain of reasoning, it is easy for us to convince ourselves that every domino eventually falls.  This is the intuition behind a technique called Linear Induction.

Consider a language with a single object constant *a* and a single unary function constant *s*.  There are infinitely many ground terms in this language, arranged in what resembles a straight line.  See below.  Starting from the object constant, we move to a term in which we apply the function constant to that constant, then to a term in which we apply the function constant to that term, and so forth.

  *a* → *s*(*a*) → *s*(*s*(*a*)) → *s*(*s*(*s*(*a*))) → ...

In this section, we concentrate on languages that have linear structure of this sort.  Hereafter, we call these *linear languages*.  In all cases, there is a single object constant and a single unary function constant.  In talking about a linear language, we call the object constant the *base element* of the language, and we call the unary function constant the *successor function*.

Although there are infinitely many ground terms in any linear language, we can still generate finite proofs that are guaranteed to be correct.  The trick is to use the structure of the terms in the language in expressing the premises of an inductive rule of inference known as *Linear Induction*.  See below for a statement of the induction rule (Ind) for the language introduced above.  In general, if we know that a schema holds of our base element and if we know that, whenever the schema holds of an element, it also holds of the successor of that element, then we can conclude that the schema holds of all elements.

| Linear Induction |
| --- |
| φ[ a ] |
| ∀μ.(φ[μ] ⇒ φ[ s (μ)]) |
|  |
| ∀ν.φ[ν] |

A bit of terminology before we go on.  The first premise in this rule is called the *base case* of the induction, because it refers to the base element of the language.  The second premise is called the *inductive case*.  The antecedent of the inductive case is called the *inductive hypothesis*, and the consequent is called, not surprisingly, the *inductive conclusion*.  The conclusion of the rule is sometimes called the *overall conclusion* to distinguish it from the inductive conclusion.

For the language introduced above, our rule of inference is sound.  Suppose we know that a schema is true of *a* and suppose that we know that, whenever the schema is true of an arbitrary ground term τ, it is also true of the term *s*(τ).  Then, the schema must be true of everything, since there are no other terms in the language.

The requirement that the signature consists of no other object constants or function constants is crucial.  If this were not the case, say there were another object constant *b*, then we would have trouble.  It would still be true that φ holds for every  element in the set {*a*, *s*(*a*), *s*(*s*(*a*)),...}.  However, because there are other elements in the Herbrand universe, e.g. *b* and *s*(*b*), ∀*x*.φ(*x*) would no longer be guaranteed.

Here is an example of induction in action.  Recall the formalization of Arithmetic introduced in Chapter 9.  Using the object constant 0 and the unary function constant *s*, we represent each number *n* by applying the function constant to 0 exactly *n* times.  For the purposes of this example, let's assume we have just one ternary relation constant, viz. *plus*, which we use to represent the addition table.

The following axioms describe *plus* in terms of 0 and *s*.  The first sentence here says that adding 0 to any element produces that element.  The second sentence states that adding the successor of a number to another number yields the successor of their sum.  The third sentence is a functionality axiom for *plus*.

| ∀ y . plus (0, y , y ) |
| --- |
| ∀ x .∀ y .∀ z .( plus ( x , y , z ) ⇒ plus ( s ( x ), y , s ( z ))) |
| ∀ x .∀ y .∀ z .∀ w .( plus ( x , y , z ) ∧ ¬ same ( z , w ) ⇒ ¬ plus ( x , y , w )) |

It is easy to see that any table that satisfies these axioms includes all of the usual addition facts.  The first axiom ensures that all cases with 0 as first argument are included.  From this fact and the second axiom, we can see that all cases with *s*(0) as first argument are included.  And so forth.

The first axiom above tells us that 0 is a *left identity* for addition - 0 added to any number produces that number as result.  As it turns out, given these definitions, 0 must also be a *right identity*, i.e it must be the case that ∀*x*.*plus*(*x*,0,*x*).

We can use induction to prove this result as shown below.  We start with our premises.  (We do not need the third axiom here, but we include it for completeness.)  We use Universal Elimination on the first premise to derive the sentence on line 4.  This takes care of the base case of our induction.  We then use three applications of Universal Elimination on the second premise to get the sentence on line 7.  We use Universal Introduction to get the result on line 8.  Finally, we use Linear Induction on lines 4 and 8 to derive our overall conclusion.

| 1. |  | ∀ y . plus (0, y , y ) |  | Premise |
| --- | --- | --- | --- | --- |
| 2. |  | ∀ x .∀ y .∀ z .( plus ( x , y , z ) ⇒ plus ( s ( x ), y , s ( z ))) |  | Premise |
| 3. |  | ∀ x .∀ y .∀ z .∀ w .( plus ( x , y , z ) ∧ ¬ same ( z , w ) ⇒ ¬ plus ( x , y , w )) |  | Premise |
| 4. |  | plus (0,0,0) |  | Universal Elimination: 1 |
| 5. |  | ∀ y .∀ z .( plus ( c , y , z ) ⇒ plus ( s ( c ), y , s ( z ))) |  | Universal Elimination: 2 |
| 6. |  | ∀ z .( plus ( c ,0, z ) ⇒ plus ( s ( c ),0, s ( z ))) |  | Universal Elimination: 5 |
| 7. |  | plus ( c ,0, c ) ⇒ plus ( s ( c ),0, s ( c )) |  | Universal Elimination: 6 |
| 8. |  | ∀ x .( plus ( x ,0, x ) ⇒ plus ( s ( x ),0, s ( x ))) |  | Universal Introduction: 7 |
| 9. |  | ∀ x . plus ( x ,0, x ) |  | Ind: 4, 8 |

Most inductive proofs have this simple structure.  We prove the base case.  We assume the inductive hypothesis; we prove the inductive conclusion; and, based on this proof, we have the inductive case.  From the base case and the inductive case, we infer the overall conclusion.

 =======================================================================

### 13.4 Tree Induction

Tree languages are a superset of linear languages.  While in linear languages the terms in the language form a linear sequence, in tree languages the structure is more tree-like.  Consider a language with an object constant *a* and two unary function constants *f* and *g*.  Some of the terms in this language are shown below.

|  |  |  |  | a |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  | ↙ |  | ↘ |  |  |  |
|  |  | f ( a ) |  |  |  | g ( a ) |  |  |
|  | ↙ |  | ↘ |  | ↙ |  | ↘ |  |
|  | f ( f ( a )) |  | g ( f ( a )) |  | f ( g ( a )) |  | g ( g ( a )) |  |

As with linear languages, we can write an inductive rule of inference for tree languages.  The tree induction rule of inference for the language just described is shown below.  Suppose we know that a schema φ holds of *a*.  Suppose we know that, whenever the schema holds of any element, it holds of the term formed by applying *f* to that element.  And suppose we know that, whenever the schema holds of any element, it holds of the term formed by applying *g* to that element.  Then, we can conclude that the schema holds of every element.

| Tree Induction |
| --- |
| φ[ a ] |
| ∀μ.(φ[μ] ⇒ φ[ f (μ)]) |
| ∀μ.(φ[μ] ⇒ φ[ g (μ)]) |
|  |
| ∀ν.φ[ν] |

In order to see an example of tree induction in action, consider the ancestry tree for a particular dog.  We use the object constant *rex* to refer to the dog; we use the unary function constant *f* to map an arbitrary dog to its father; and we use *g* map a dog to its mother.  Finally, we have a single unary relation constant *purebred* that is true of a dog if and only if it is purebred.

Now, we write down the fundamental rule of dog breeding - we know that, if a dog is purebred, then both its father and its mother must be purebred as well.  See below.  (This is a bit oversimplified on several grounds.  Properly, the father and mother should be of the same breed.  Also, this formalization suggests that every dog has an ancestry tree that stretches back without end.  However, let's ignore these imperfections for the purposes of our example.)

∀*x*.(*purebred*(*x*) ⇒ *purebred*(*f*(*x*)) ∧ *purebred*(*g*(*x*)))

Suppose now that we discover the fact that our dog *rex* is purebred.  Then, we know that every dog in his ancestry tree must be purebred.  We can prove this by a simple application of tree induction.

A proof of our conclusion is shown below.  We start with the premise that Rex is purebred.   We also have our constraint on purebred animals as a premise.  We use Universal Elimination to instantiate the second premise with placeholder *c*.  We then assume *purebred*(*c*).   We use Implication Elimination to derive the conjunction on line 5, and then we use And Elimination to pick out the first conjunct.  We use Implication Introduction to discharge our assumption, and we Universal Introduction to produce the inductive case for *f*.  We then repeat this process to produce an analogous result for *g* on line 13.  Finally, we use the tree induction rule on the sentences on lines 1, 8, and 13 and thereby derive the desired overall conclusion.

| 1. |  | purebred ( rex ) |  | Premise |
| --- | --- | --- | --- | --- |
| 2. |  | ∀ x .( purebred ( x ) ⇒ purebred ( f ( x )) ∧ purebred ( g ( x ))) |  | Premise |
| 3. |  | purebred ( c ) ⇒ purebred ( f ( c )) ∧ purebred ( g ( c )) |  | Universal Elimination: 2 |
| 4. |  | purebred ( c ) |  | Assumption |
| 5. |  | purebred ( f ( c )) ∧ purebred ( g ( c )) |  | Implication Elimination: 3, 4 |
| 6. |  | purebred ( f ( c )) |  | And Elimination: 5 |
| 7. |  | purebred ( c ) ⇒ purebred ( f ( c )) |  | Implication Introduction: 4, 6 |
| 8. |  | ∀ x .( purebred ( x ) ⇒ purebred ( f ( x ))) |  | Universal Introduction: 7 |
| 9. |  | purebred ( c ) |  | Assumption |
| 10. |  | purebred ( f ( c )) ∧ purebred ( g ( c )) |  | Implication Elimination: 3, 9 |
| 11. |  | purebred ( g ( c )) |  | And Elimination: 10 |
| 12. |  | purebred ( c ) ⇒ purebred ( g ( c )) |  | Implication Introduction: 9, 11 |
| 13. |  | ∀ x .( purebred ( x ) ⇒ purebred ( g ( x ))) |  | Universal Introduction: 12 |
| 14. |  | ∀ x . purebred ( x ) |  | Ind: 1, 8, 13 |

   successor and predecessor  =======================================================================

### 13.5 Structural Induction

Structural Induction is the most general form of induction.  In Structural Induction, we can have multiple object constants, multiple function constants, and, unlike our other forms of induction, we can have function constants with multiple arguments.  Consider a language with two object constants *a* and *b* and a single binary function constant *h*.  See below for a list of some of the terms in the language.  We do not provide a graphical rendering in this case, as the structure is more complicated than a line or a tree.

  *a*, *b*, *h*(*a*,*a*), *h*(*a*,*b*), *h*(*b*,*a*), *h*(*b*,*b*), *h*(*a*,*h*(*a*,*a*)), *h*(*h*(*a*,*a*),*a*), *h*(*h*(*a*,*a*),*h*(*a*,*a*)), ...

The Structural Induction rule for this language is shown below.  If we know that φ holds of our base elements *a* and *b* and if we know ∀μ.∀ν.((φ[μ] ∧ φ[ν]) ⇒ φ[*h*(μ,ν)]), then we can conclude ∀ν.φ[ν] in a single step.

| Structural Induction |
| --- |
| φ[ a ] |
| φ[ b ] |
| ∀λ.∀μ.((φ[λ] ∧ φ[μ]) ⇒ φ[ h (λ,μ)]) |
|  |
| ∀ν.φ[ν] |

As an example of a domain where Structural Induction is appropriate, recall the world of lists and trees introduced in Chapter 9.  Let's assume we have two object constants *a* and *b*, a binary function constant *h*, and two unary relation constants *p* and *q*.  Relation *p* is true of a structured object if and only if every fringe node is an *a*.  Relation *q* is true of a structured object if and only if at least one fringe node is an *a*.  The positive and negative axioms defining the relations are shown below.

| p ( a ) ∀ u .∀ v .( p ( u ) ∧ p ( v ) ⇒ p ( h ( u , v ))) ¬ p ( b ) ∀ u .∀ v .( p ( h ( u , v )) ⇒ p ( u )) ∀ u .∀ v .( p ( h ( u , v )) ⇒ p ( v )) |  | q ( a ) ∀ u .∀ v .( q ( u ) ⇒ q ( h ( u , v ))) ∀ u .∀ v .( q ( v ) ⇒ q ( h ( u , v ))) ¬ q ( b ) ∀ u .∀ v .( q ( h ( u , v )) ⇒ q ( u ) ∨ q ( v )) |
| --- | --- | --- |

Now, as an example of Structural Induction in action, let's prove that every object that satisfies *p* also satisfies *q*.  In other words, we want to prove the conclusion ∀*x*.(*p*(*x*) ⇒ *q*(*x*)).  As usual, we start with our premises.

| 1. |  | p ( a ) |  | Premise | 2. |  | ∀ u .∀ v .( p ( u ) ∧ p ( v ) ⇒ p ( h ( u , v ))) |  | Premise | 3. |  | ¬ p ( b ) | Premise | Premise | 4. |  | ∀ u .∀ v .( p ( h ( u , v )) ⇒ p ( u )) | Premise | Premise | 5. |  | ∀ u .∀ v .( p ( h ( u , v )) ⇒ p ( v )) | Premise | Premise | 6. |  | q ( a ) | Premise | Premise | 7. |  | ∀ u .∀ v .( q ( u ) ⇒ q ( h ( u , v ))) | Premise | Premise | 8. |  | ∀ u .∀ v .( q ( v ) ⇒ q ( h ( u , v ))) | Premise | Premise | 9. |  | ¬ q ( b ) | Premise | Premise | 10. |  | ∀ u .∀ v .( q ( h ( u , v )) ⇒ q ( u ) ∨ q ( v )) | Premise | Premise |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2. |  | ∀ u .∀ v .( p ( u ) ∧ p ( v ) ⇒ p ( h ( u , v ))) |  | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3. |  | ¬ p ( b ) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4. |  | ∀ u .∀ v .( p ( h ( u , v )) ⇒ p ( u )) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5. |  | ∀ u .∀ v .( p ( h ( u , v )) ⇒ p ( v )) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6. |  | q ( a ) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7. |  | ∀ u .∀ v .( q ( u ) ⇒ q ( h ( u , v ))) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 8. |  | ∀ u .∀ v .( q ( v ) ⇒ q ( h ( u , v ))) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 9. |  | ¬ q ( b ) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 10. |  | ∀ u .∀ v .( q ( h ( u , v )) ⇒ q ( u ) ∨ q ( v )) | Premise | Premise |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

To start the induction, we first prove the base cases for the conclusion.  In this world, with two object constants, we need to show the result twice - once for each object constant in the language.

Let's start with *a*.  The derivation is simple in this case.  We assume *p*(*a*), reiterate *q*(*a*) from line 6, then use Implication Introduction to prove (*p*(*a*) ⇒ *q*(*a*)).

| 11. |  | p ( a ) |  | Assumption |
| --- | --- | --- | --- | --- |
| 12. |  | q ( a ) |  | Reiteration: 6 |
| 13. |  | p ( a ) ⇒ q ( a ) |  | II: 11, 12 |

Now, let's do the case for *b*.  As before, we assume *p*(*b*), and our goal is to derive *q*(*b*).  This is a little strange.  We know that *q*(*b*) is false.  Still, we should be able to derive it since we have assumed *p*(*b*), which is also false.  The trick here is to generate contradictory conclusions from the assumption ¬*q*(*b*).  To this end, we assume ¬*q*(*b*) and first prove *p*(*b*).  Having done so, we use Implication Introduction to get one implication. Then, we assume ¬*q*(*b*) again and this time derive ¬*p*(*b*) and get an implication.  At this point, we can use Negation Introduction to derive ¬¬*q*(*b*) and Negation Elimination to get *q*(*b*).  Finally, we use Implication Introduction to prove (*p*(*b*) ⇒ *q*(*b*)).

| 14. |  | p ( b ) |  | Assumption |
| --- | --- | --- | --- | --- |
| 15. |  | ¬ q ( b ) |  | Assumption |
| 16. |  | p ( b ) |  | Reiteration: 14 |
| 17. |  | ¬ q ( b ) ⇒ p ( b ) |  | II: 14, 16 |
| 18. |  | ¬ q ( b ) |  | Assumption |
| 19. |  | ¬ p ( b ) |  | Reiteration: 3 |
| 20. |  | ¬ q ( b ) ⇒ ¬ p ( b ) |  | II: 18, 19 |
| 21. |  | ¬¬ q ( b ) |  | NI: 17, 20 |
| 22. |  | q ( b ) |  | NE: 21 |
| 23. |  | p ( b ) ⇒ q ( b ) |  | II: 17, 19 |

Having dealt with the base cases, the next step is to prove the inductive case.  We need to show that, if our conclusion holds of *u* and *v*, then it also holds of *h*(*u*,*v*).  To this end, we assume the conjunction of our assumptions with placeholders *c* and *d*; and we then use And Elimination to split that conjunction into its two conjuncts.  Our inductive conclusion is also an implication; and, to prove it, we assume its antecedent *p*(*h*(*c*,*d*)).  From this, we derive *p*(*c*); from that, we derive *q*(*c*); and, from that, we derive *q*(*h*(*c*,*d*)).  We then use Implication Introduction to get the desired implication.  A final use of Implication Introduction and a couple of applications of Universal Introduction gives us the inductive case for the induction.

| 24. |  | ( p ( c ) ⇒ q ( c )) ∧ ( p ( d ) ⇒ q ( d )) |  | Assumption |
| --- | --- | --- | --- | --- |
| 25. |  | p ( c ) ⇒ q ( c ) |  | AE: 24 |
| 26. |  | p ( d ) ⇒ q ( d ) |  | AE: 24 |
| 27. |  | p ( h ( c , d )) |  | Assumption |
| 28. |  | ∀ v .( p ( h ( c , v )) ⇒ p ( c )) |  | UE: 4 |
| 29. |  | p ( h ( c , d )) ⇒ p ( c ) |  | UE: 28 |
| 30. |  | p ( c ) |  | IE: 29, 27 |
| 31. |  | q ( c ) |  | IE: 25, 30 |
| 32. |  | ∀ v .( q ( c ) ⇒ q ( h ( c , v ))) |  | UE: 7 |
| 33. |  | q ( c ) ⇒ q ( h ( c , d )) |  | UE: 32 |
| 34. |  | q ( h ( c , d )) |  | IE: 33, 31 |
| 35. |  | p ( h ( c , d )) ⇒ q ( h ( c , d )) |  | II: 27, 34 |
| 36. |  | ( p ( c ) ⇒ q ( c )) ∧ ( p ( d ) ⇒ q ( d )) ⇒ ( p ( h ( c , d )) ⇒ q ( h ( c , d )) |  | II: 24, 35 |
| 37. |  | ∀ v .(( p ( c ) ⇒ q ( c )) ∧ ( p ( v ) ⇒ q ( v )) ⇒ ( p ( h ( c , v ))) ⇒ q ( h ( c , v ))) |  | UI: 36 |
| 38. |  | ∀ u .∀ v .(( p ( u ) ⇒ q ( u )) ∧ ( p ( v ) ⇒ q ( v )) ⇒ ( p ( h ( u , v )) ⇒ q ( h ( u , v )))) |  | UI: 37 |

Finally, using the base case on lines 13 and 23 and the inductive case on line 38, we use Structural Induction to give us the conclusion we set out to prove.

| 39. |  | ∀ x .( p ( x ) ⇒ q ( x )) |  | Ind: 13, 23, 38 |
| --- | --- | --- | --- | --- |

Although the proof in this case is longer than in the previous examples, the basic inductive structure is the same.  Importantly, using induction, we can prove this result where otherwise it would not be possible.

 =======================================================================

### 13.6 Multidimensional Induction

In our look at induction thus far, we have been concentrating on examples in which the conclusion is a universally quantified sentence with just one variable.  In many situations, we want to use induction to prove a result with more than one universally quantified variable.  This is called *multidimensional induction* or, sometimes, *multivariate induction*.

In principle, multidimensional induction is straightforward.  We simply use ordinary induction to prove the outermost universally quantified sentence.  Of course, in the case of multidimensional induction the base case and the inductive conclusion are themselves universally quantified sentences; and, if necessary we use induction to prove these subsidiary results.

As an example, consider a language with a single object constant *a*, a unary function constant *s*, and a binary relation constant *e*.  The axioms shown below define *e*.

| e ( a , a ) |
| --- |
| ∀ x .¬ e ( a , s ( x )) |
| ∀ x .¬ e ( s ( x ), a ) |
| ∀ x .∀ y .( e ( x , y ) ⇒ e ( s ( x ), s ( y ))) |
| ∀ x .∀ y .( e ( s ( x ), s ( y )) ⇒ e ( x , y )) |

The relation *e* is an equivalence relation - it is reflexive, symmetric, and transitive.  Proving reflexivity is easy.  Our goal here is to prove symmetry.

Goal: ∀*x*.∀*y*.(*e*(*x*,*y*) ⇒ *e*(*y*,*x*)).

In what follows, we use induction to prove the outer quantified formula and then use induction on each of the inner conclusions as well.  This means we have two immediate subgoals - the base case for the outer induction and the inductive case for the outer induction.

| Goal: ∀ y .( e ( a , y ) ⇒ e ( y , a )). |
| --- |
| Goal: ∀ x .(∀ y .( e ( x , y ) => e ( y , x )) ⇒ ∀ y .( e ( s ( x ), y ) => e ( y , s ( x )))). |

As usual, we start with our premises.  We then prove the base case of the inner induction.  This is easy.  We assume *e*(*a*,*a*) and then use Implication Introduction to prove the base case in one step.

| 1. |  | e ( a , a ) |  | Premise |
| --- | --- | --- | --- | --- |
| 2. |  | ∀ x .¬ e ( a , s ( x )) |  | Premise |
| 3. |  | ∀ x .¬ e ( s ( x ), a ) |  | Premise |
| 4. |  | ∀ x .∀ y .( e ( x , y ) ⇒ e ( s ( x ), s ( y ))) |  | Premise |
| 5. |  | ∀ x .∀ y .( e ( s ( x ), s ( y )) ⇒ e ( x , y )) |  | Premise |
| 6. |  | e ( a , a ) |  | Assumption |
| 7. |  | e ( a , a ) ⇒ e ( a , a ) |  | Implication Introduction: 6, 6 |

The next step is to prove the inductive case for the inner induction.  To this end, we assume the inductive hypothesis and try to prove the inductive conclusion.  Since the conclusion is itself an implication, we assume its antecedent and prove the consequent.  As shown below, we do this by assuming the consequent is false and proving a sentence and its negation.  We then use Negation Introduction and Negation Elimination to derive the consequent.  We finish with two applications of Implication Introduction and an application of Universal Introduction.

| 8. |  | e ( a , d ) ⇒ e ( d , a )) |  | Assumption |
| --- | --- | --- | --- | --- |
| 9. |  | e ( a , s ( d )) |  | Assumption |
| 10. |  | ¬ e ( s ( d ), a ) |  | Assumption |
| 11. |  | e ( a , s ( d )) |  | Reiteration: 9 |
| 12. |  | ¬ e ( s ( d ), a ) ⇒ e ( a , s ( d )) |  | Implication Introduction: 10, 11 |
| 13. |  | ¬ e ( s ( d ), a ) |  | Assumption |
| 14. |  | ¬ e ( a , s ( d )) |  | Universal Elimination: 2 |
| 15. |  | ¬ e ( s ( d ), a ) ⇒ ¬ e ( a , s ( d )) |  | Implication Introduction: 13, 14 |
| 16. |  | ¬¬ e ( s ( d ), a ) |  | Negation Introduction: 12, 15 |
| 17. |  | e ( s ( d ), a ) |  | Negation Elimination: 16 |
| 18. |  | e ( a , s ( d )) ⇒ e ( s ( d ), a ) |  | Implication Introduction: 9, 17 |
| 19. |  | ( e ( a , d ) ⇒ e ( d , a )) ⇒ ( e ( a , s ( d )) ⇒ e ( s ( d ), a )) |  | Implication Introduction: 8, 18 |
| 20. |  | ∀ y .(( e ( a , y ) ⇒ e ( y , a )) ⇒ ( e ( a , s ( y )) ⇒ e ( s ( y ), a ))) |  | Universal Introduction: 19 |
| 21. |  | ∀ y .( e ( a , y ) ⇒ e ( y , a )) |  | Induction: 7, 20 |

That's a lot of work just to prove the base case of the outer induction.  The inductive case of the outer induction is even more complex, and it is easy to make mistakes.  The trick to avoiding these mistakes is to be methodical.

In order to prove the inductive case for the outer induction, we assume the inductive hypothesis ∀*y*.(*e*(*c*,*y*) => *e*(*y*,*c*)); and we then prove the inductive conclusion ∀*y*.(*e*(*s*(*c*),*y*) => *e*(*y*,*s*(*c*)))).  We prove this by induction on the variable *y*.

We start by proving the base case for this induction.  We start with the inductive hypothesis.  We then assume the antecedent of the base case.

| 22. |  | ∀ y .( e ( c , y ) => e ( y , c )) |  | Assumption |
| --- | --- | --- | --- | --- |
| 23. |  | e ( s ( c ), a ) |  | Assumption |
| 24. |  | ¬ e ( a , s ( c )) |  | Assumption |
| 25. |  | e ( s ( c ), a ) |  | Reiteration: 23 |
| 26. |  | ¬ e ( a , s ( c ))) ⇒ e ( s ( c ), a ) |  | Implication Introduction: 24, 25 |
| 27. |  | ¬ e ( a , s ( c )) |  | Assumption |
| 28. |  | ¬ e ( s ( c ), a ) |  | Universal Elimination: 3 |
| 29. |  | ¬ e ( a , s ( c ))) ⇒ ¬ e ( s ( c ), a ) |  | Implication Introduction: 27, 28 |
| 30. |  | ¬¬ e ( a , s ( c ))) |  | Negation Introduction: 26, 29 |
| 31. |  | e ( a , s ( c ))) |  | Negation Elimination: 30 |
| 32. |  | e ( s ( c ), a ) ⇒ e ( a , s ( c ))) |  | Implication Introduction: 23, 31 |

Next, we work on the inductive case.  We start by assuming the inductive hypothesis.  We then assume the antecedent of the inductive conclusion.

| 33. |  | e ( s ( c ), d ) ⇒ e ( d , s ( c )) |  | Assumption |
| --- | --- | --- | --- | --- |
| 34. |  | e ( s ( c ), s ( d )) |  | Assumption |
| 35. |  | ∀ d .( e ( s ( c ), s ( d )) ⇒ e ( c , d )) |  | Universal Elimination: 5 |
| 36. |  | e ( s ( c ), s ( d )) ⇒ e ( c , d ) |  | Universal Elimination: 35 |
| 37. |  | e ( c , d ) |  | Implication Elimination: 36, 34 |
| 38. |  | e ( c , d ) => e ( d , c ) |  | Universal Elimination: 22 |
| 39. |  | e ( d , c ) |  | Implication Elimination: 38, 37 |
| 40. |  | ∀ d .( e ( d , c ) ⇒ e ( s ( d ), s ( c ))) |  | Universal Elimination: 4 |
| 41. |  | e ( d , c ) ⇒ e ( s ( d ), s ( c )) |  | Universal Elimination: 40 |
| 42. |  | e ( s ( d ), s ( c )) |  | Implication Elimination: 41, 39 |
| 43. |  | e ( s ( c ), s ( d )) ⇒ e ( s ( d ), s ( c )) |  | Implication Introduction: 34, 42 |
| 44. |  | ( e ( s ( c ), d ) ⇒ e ( d , s ( c ))) ⇒ ( e ( s ( c ), s ( d )) ⇒ e ( s ( d ), s ( c ))) |  | Implication Introduction: 33, 43 |
| 45. |  | ∀ y .(( e ( s ( c ), y )⇒ e ( y , s ( c )))⇒( e ( s ( c ), s ( y ))⇒ e ( s ( y ), s ( c )))) |  | Universal Introduction: 44 |

From the results on lines 32 and 45, we can conclude the inductive case for the outer induction.

| 46. |  | ∀ y .( e ( s ( c ), y ) ⇒ e ( y , s ( c ))) |  | Induction: 32, 45 |
| --- | --- | --- | --- | --- |
| 47. |  | ∀ y .( e ( c , y ) => e ( y , c )) ⇒ ∀ y .( e ( s ( c ), y ) ⇒ e ( y , s ( c ))) |  | Implication Introduction: 22, 46 |
| 48. |  | ∀ x .(∀ y .( e ( x , y ) => e ( y , x )) ⇒ ∀ y .( e ( s ( x ), y ) ⇒ e ( y , s ( x )))) |  | Universal Introduction: 47 |

Finally, from the base case for the outer induction and this inductive case, we can conclude our overall result.

| 49. |  | ∀ x .∀ y .( e ( x , y ) ⇒ e ( y , x )) |  | Induction: 21, 48 |
| --- | --- | --- | --- | --- |

As this proof illustrates, the technique of using induction within induction works just fine.  Unfortunately, it is tedious and error-prone.   For this reason, many people prefer to use specialized forms of multidimensional induction.

 =======================================================================

### 13.7 Embedded Induction

In the examples in this chapter thus far, induction is used to prove the overall result.  While this approach works nicely in many cases, it is not always successful.  In some cases, it is easier to use induction on parts of a problem or to prove alternative conclusions and then use these intermediate results to derive the overall conclusions (using non-inductive methods).

As an example, consider a world characterized by a single object constant *a*, a single unary function constant *s*, and a single unary relation constant *p*.  Assume we have the set of axioms shown below.

| ∀ x .( p ( x ) ⇒ p ( s ( s ( x )))) |
| --- |
| p ( a ) |
| p ( s ( a )) |

A little thought reveals that these axioms logically entail the universal conclusion ∀*x*.*p*(*x*).  Unfortunately, it is difficult to derive this conclusion directly using Linear Induction.  The base case *p*(*a*) is easy enough, but it is not so easy to derive the inductive case ∀*x*.(*p*(*x*) ⇒ *p*(*s*(*x*))).

The good news is that we can succeed by proving a slightly more complicated intermediate conclusion and then using that conclusion to prove the overall result.  One way to do this is shown below.  We start by using Linear Induction to prove ∀*x*.(*p*(*x*) ∧ *p*(*s*(*x*)).  It is easy to prove the base case *p*(*a*) ∧ *p*(*s*(*a*)), since we are given the two conjuncts as axioms.  And the inductive case is straightforward.  We add a placeholder *c* and then assume *p*(*c*) ∧ *p*(*s*(*c*)).  From this hypothesis, we use And Elimination to get *p*(*c*) and *p*(*s*(*c*)). We then use Universal Elimination and Implication Elimination to derive *p*(*s*(*s*(*c*))).  We then conjoin these results, use Implication Introduction and Universal Introduction to get the inductive case for our induction.  From the base case and the inductive case, we get our intermediate conclusion.  Finally, starting with this conclusion, we use Universal Elimination on our inductive conclusion, then And Elimination, and, finally, Universal Introduction to get the overall result.

| 1. |  | ∀ x .( p ( x ) ⇒ p ( s ( s ( x )))) |  | Premise |
| --- | --- | --- | --- | --- |
| 2. |  | p ( a ) |  | Premise |
| 3. |  | p ( s ( a )) |  | Premise |
| 4. |  | p ( a ) ∧ p ( s ( a )) |  | And Introduction: 2, 3 |
| 5. |  | p ( c ) ∧ p ( s ( c )) |  | Assumption |
| 6. |  | p ( c ) |  | And Elimination: 5 |
| 7. |  | p ( s ( c )) |  | And Elimination: 5 |
| 8. |  | p ( c ) ⇒ p ( s ( s ( c ))) |  | Universal Elimination: 1 |
| 9. |  | p ( s ( s ( c ))) |  | Implication Elimination: 8, 6 |
| 10. |  | p ( s ( c )) ∧ p ( s ( s ( c ))) |  | And Introduction: 7, 9 |
| 11. |  | p ( c ) ∧ p ( s ( c )) ⇒ p ( s ( c )) ∧ p ( s ( s ( c ))) |  | Implication Introduction: 5, 10 |
| 12. |  | ∀ x .( p ( x ) ∧ p ( s ( x )) ⇒ p ( s ( x )) ∧ p ( s ( s ( x )))) |  | Universal Introduction: 11 |
| 13. |  | ∀ x .( p ( x ) ∧ p ( s ( x ))) |  | Induction: 4, 12 |
| 14. |  | p ( c ) ∧ p ( s ( c )) |  | Universal Elimination: 13 |
| 15. |  | p ( c ) |  | And Elimination: 14 |
| 16. |  | p ( s ( c )) |  | And Elimination: 14 |
| 17. |  | ∀ x . p ( x ) |  | Universal Introduction: 15 |

In this case, we are lucky that there is a useful conclusion that we can prove with standard Linear Induction.  Things are not always so simple; and in some cases we need more complex forms of induction.  Unfortunately, there is no finite collection of approaches to induction that covers all cases.  If there were, we could build an algorithm for determining logical entailment for Herbrand Logic in all cases; and, as we discussed earlier, there is no such algorithm.

 =======================================================================

### Recap

Induction is reasoning from the specific to the general.  *Complete induction* is induction where the set of instances is exhaustive.  *Incomplete induction* is induction where the set of instances is not exhaustive.  *Linear Induction* is a type of complete induction for languages with a single object constants and a single unary function constant.  *Tree Induction* is a type of complete induction for languages with a single object constants and multiple unary function constants.  *Structural Induction* is a generalization of both Linear Induction and Tree Induction that works even in the presence of multiple object constants and multiple *n*-ary function constants.

 =======================================================================

### Exercises

[Exercise 13.1:](http://intrologic.stanford.edu/exercises/exercise_13_01.html) Assume a language with the object constants *a* and *b* and no function constants. Given *q*(*a*) and *q*(*b*), use the Fitch system with domain closure to prove ∀*x*.(*p*(*x*) ⇒ *q*(*x*)).

[Exercise 13.2:](http://intrologic.stanford.edu/exercises/exercise_13_02.html) Assume a language with the object constant *a* and the function constant *s*. Given *r*(*a*), ∀*x*.(*p*(*x*) ⇒ *r*(*s*(*x*))), ∀*x*.(*q*(*x*) ⇒ *r*(*s*(*x*))), and ∀*x*.(*r*(*x*) ⇒ *p*(*x*) ∨ *q*(*x*)), use the Fitch system with Linear Induction to prove ∀*x*.*r*(*x*).

[Exercise 13.3:](http://intrologic.stanford.edu/exercises/exercise_13_03.html) Assume a language with object constant *a* and unary function constants *f* and *g*. Given *p*(*a*), ∀*x*.(*p*(*x*) ⇒ *p*(*f*(*x*))), and ∀*x*.(*p*(*f*(*x*)) ⇒ *p*(*g*(*x*))), use the Fitch system with Tree Induction to prove ∀*x*.*p*(*x*).

[Exercise 13.4:](http://intrologic.stanford.edu/exercises/exercise_13_04.html) Consider a language with object constant *a*, binary function constant *h*, and unary relation constant *p*.  Given *p*(*a*) and ∀*x*.∀*y*.(*p*(*x*) ∨ *p*(*y*) ⇒ *p*(*h*(*x*,*y*))), prove ∀*x*.*p*(*x*).

[Exercise 13.5:](http://intrologic.stanford.edu/exercises/exercise_13_05.html) Assume a language with object constant *a*, unary function constant *f*, and unary relation constants *p* and *q*.  Given *p*(*a*), ∀*x*.(*p*(*x*) ⇒ *q*(*f*(*x*))), and ∀*x*.(*q*(*x*) ⇒ *p*(*f*(*x*))), use induction to prove ∀*x*.(*p*(*x*) ∨ *q*(*x*)).

[Exercise 13.6:](http://intrologic.stanford.edu/exercises/exercise_13_06.html) Assume a language with object constant *a*, unary function constant *s*, and unary relation constant *p*.  Given *p*(*a*), *p*(*s*(*a*)), and ∀*x*.(*p*(*x*) ⇒ *p*(*s*(*s*(*x*)))), prove ∀*x*.*p*(*x*).  Hint: Use induction to prove a conjunctive result and then use the result to prove the desired conclusion.

 =======================================================================
