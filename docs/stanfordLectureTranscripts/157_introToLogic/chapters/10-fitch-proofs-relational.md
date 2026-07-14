# Chapter 10 — Fitch Proofs (Relational)

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_10.html](http://intrologic.stanford.edu/chapters/chapter_10.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |
| --- |
| C H A P T E R  10 |

| Fitch Proofs |
| --- |

  =======================================================================

### 10.1 Introduction

As with Propositional Logic, we can demonstrate logical entailment in Relational Logic by writing proofs.  As with Propositional Logic, it is possible to show that a set of Relational Logic premises logically entails a Relational Logic conclusion if and only if there is a finite proof of the conclusion from the premises.  Moreover, it is possible to find such proofs in a finite time.

The Fitch system for Relational Logic is an extension of the Fitch system for Propositional Logic.  In addition to the logical rules of inference we have already seen, there are five new rules of inference - *Universal Elimination*, *Universal Introduction*, *Existential Introduction*, *Existential Elimination*, and a new type of rule called *Domain Closure*.

Note that the Fitch system described here works only for premises and conclusions that are closed sentences.  This is not a significant limitation, since every open sentence is logically equivalent to a closed sentence in which the free variables have been universally quantified.

 =======================================================================

### 10.2 Universal Elimination

*Universal Elimination* (UE) allows us to reason from the general to the particular.  It states that, whenever we believe a universally quantified sentence, we can infer an instance of the target of that sentence in which the universally quantified variable is replaced by a ground term.  (In the following rule, the notation φν⇐τ means an instance of φ in which *all* occurrences of ν have been replaced by τ.)

| Universal Elimination |
| --- |
| ∀ν.φ |
|  |
| φ ν⇐τ |
| where τ is ground |

For example, consider the sentence ∀*y*.*hates*(*jane*,*y*).  From this premise, we can infer that Jane hates Jill, i.e. *hates*(*jane*,*jill*).  We can even infer than Jane hates herself, i.e. *hates*(*jane*,*jane*).

As an example of reasoning with Universal Elimination, consider the following problem.  Suppose we believe that everybody loves somebody.  And suppose we believe that everyone loves a lover.  Our job is to prove that Jack loves Jill.

First, we need to formalize our premises.  Everybody loves somebody.  For all *y*, there exists a *z* such that *loves*(*y*,*z*).

∀*y*.∃*z*.*loves*(*y*,*z*)

Everybody loves a lover.  If a person is a lover, then everyone loves him.  If a person loves another person, then everyone loves him.  For all *x* and for all *y* and for all *z*, *loves*(*y*,*z*) implies *loves*(*x*,*y*).

∀*x*.∀*y*.(∃*z*.*loves*(*y*,*z*) ⇒ *loves*(*x*,*y*))

Our goal is to show that Jack loves Jill.  In other words, starting with the preceding sentences, we want to derive the following sentence.

  *loves*(*jack*,*jill*)

A proof of this result is shown below.  Our premises appear on lines 1 and 2.  The sentence on line 3 is the result of applying Universal Elimination to the sentence on line 1, substituting *jill* for *y*.  The sentence on line 4 is the result of applying Universal Elimination to the sentence on line 2, substituting *jack* for *x*.   The sentence on line 5 is the result of applying Universal Elimination to the sentence on line 4, substituting *jill* for *y*.  Finally, we apply Implication Elimination to produce our conclusion on line 6.

| 1. | ∀ y .∃ z . loves ( y , z ) | Premise |
| --- | --- | --- |
| 2. | ∀ x .∀ y .(∃ z . loves ( y , z ) ⇒ loves ( x , y )) | Premise |
| 3. | ∃ z . loves ( jill , z ) | Universal Elimination: 1 |
| 4. | ∀ y .(∃ z . loves ( y , z ) ⇒ loves ( jack , y )) | Universal Elimination: 2 |
| 5. | ∃ z . loves ( jill , z ) ⇒ loves ( jack , jill ) | Universal Elimination: 4 |
| 6. | loves ( jack , jill ) | Implication Elimination: 5,3 |

  =======================================================================

### 10.3 Universal Introduction

*Universal Introduction* (UI) is the opposite of Universal Elimination - it allows us to reason from sentences about individuals to universally quantified versions of those sentences.

Unfortunately, it is not as easy as Universal Elimination.  Just because we can prove that a sentence is true of one specific object does not mean that it is true of all objects.  Of course, we could try proving a sentence about every known object.  (See the Domain Closure rule described later in this section.)  However, that could require a lot of work if the universe contains many objects.

Fortunately, there is a technique that allows us to derive universally quantified sentences without enumerating all individual objects.  The trick is the use of a new type of constant, called a *placeholder*.  A placeholder is effectively a stand-in for an actual object constant; we just do not know which constant it is.  In writing Fitch proofs, we differentiate placeholders from ordinary constants by choosing constants that (1) begin with a letter and (2) do not appear in the given premises.  For example, if the only object constants in our premises are *a* and *b*, we might choose *c* as a placeholder.

The basic idea is to introduce a new placeholder in our proof.  Once we have this new placeholder, we can use it like any other placeholder to derive conclusions.  Since we have not made any assumptions about this object, whatever we derive must be true of all objects.  So we can derive any such conclusion by a universally quantified sentence in which we have replaced the placeholder with a variable, provided that the placeholder does not occur in any active assumptions.

| Universal Introduction |
| --- |
| φ |
|  |
| ∀ν.φ τ⇐ν |
| where τ is not used in any active assumptions |

Suppose, for example, we have derived the conclusion *hates*(*c*,*jane*) ⇒ *hates*(*jane*,*c*) and suppose that the placeholder *c* does not occur in any active assumptions.  Then we can use Universal Introduction to conclude the universally quantified sentence ∀*x*.(*hates*(*x*,*jane*) ⇒ *hates*(*jane*,*x*)).

As an example of reasoning with Universal Introduction, consider a slightly more interesting version of the problem from the preceding section.  We start with the same premises.  Everybody loves somebody.  Everybody loves a lover.  However, our goal now is to prove the somewhat stronger result that everyone loves everyone.  For all *x* and for all *y*, *x* loves *y*.

 ∀*x*.∀*y*.*loves*(*x*,*y*)

The proof shown below is analogous to the proof above.  The only difference is that we have free variables in place of object constants at various points in the proof.  Once again, our premises appear on lines 1 and 2.  Once again, we use Universal Elimination to produce the result on line 3; but this time the result contains a placeholder.  We get the results on lines 4 and 5 by successive application of Universal Elimination to the sentence on line 2.  We deduce the result on line 6 using Implication Elimination. Finally, we use two applications of Universal Introduction to generalize our result and produce the desired conclusion.

| 1. | ∀ y .∃ z . loves ( y , z ) | Premise |
| --- | --- | --- |
| 2. | ∀ x .∀ y .(∃ z . loves ( y , z ) ⇒ loves ( x , y )) | Premise |
| 3. | ∃ z . loves ( d , z ) | Universal Elimination: 1 |
| 4. | ∀ y .(∃ z . loves ( y , z ) ⇒ loves ( c , y )) | Universal Elimination: 2 |
| 5. | ∃ z . loves ( d , z ) ⇒ loves ( c , d ) | Universal Elimination: 4 |
| 6. | loves ( c , d ) | Implication Elimination: 5,3 |
| 7. | ∀ y . loves ( c , y ) | Universal Introduction: 6 |
| 8. | ∀ x .∀ y . loves ( x , y ) | Universal Introduction: 7 |

This example illustrates the use of placeholders.  We can manipulate them as though we are talking about specific individuals (though each one could be any object); and, when we are done, we can universalize them to derive universally quantified conclusions.

 =======================================================================

### 10.4 Existential Introduction

*Existential Introduction* (EI) is easy.  If we believe a sentence involving a ground term τ, then we can infer an existentially quantified sentence in which occurrences of τ have been replaced by the existentially quantified variable.  (In the following rule, the notation φν←τ means an instance of φ in which *zero or more* occurrences of ν have been replaced by τ.)

| Existential Introduction |
| --- |
| φ |
|  |
| ∃ν.φ τ←ν |
| where τ is ground |

For example, from the sentence *hates*(*jill*,*jill*), we can infer that there is someone who hates himself, i.e. ∃*x*.*hates*(*x*,*x*).  We can also infer that there is someone Jill hates, i.e. ∃*y*.*hates*(*jill*,*y*), and there is someone who hates Jill, i.e. ∃*x*.*hates*(*x*,*jill*).  And, by two applications of Existential Introduction, we can infer that someone hates someone, i.e. ∃*x*.∃*y*.*hates*(*x*,*y*).

Note that Existential Introduction applies only in cases where the term being replaced is ground.  This restriction is necessary to avoid incorrect conclusions.  Suppose, for example, we had the sentence ∀*x*.*hates*(*x*,*x*).  If we were to use EI to replace the second occurrence of *x*, we would get the conclusion ∃*y*.∀*x*.*hates*(*x*,*y*), i.e. there is someone whom everyone hates.  The original sentence says that everyone hates himself whereas this incorrect conclusion states that there is a single person whom everyone hates.

As an example of reasoning with Existential Introduction, consider the following problem.  Given ∀*x*.(∃*y*.*p*(*x*,*y*) ⇒ *q*(*x*)), we know that ∀*x*.∀*y*.(*p*(*x*,*y*) ⇒ *q*(*x*)).  We can convert an existential quantifier in the antecedent of an implication into a universal quantifier outside the implication.

Our proof is shown below.  Once again, we start with our premise.  We create a new placeholder and use Universal Elimination to strip away the quantifier in the premise to expose the implication.  We start a subproof by making an assumption.  We make an assumption using another new placeholder.  We turn the assumption into an existential sentence to match the antecedent of the premise in line 2.  Then, we apply Implication Elimination to derive *q*(*c*).  We use Implication Introduction to create an implication.  Finally, we generalize using two applications of Universal Introduction.

| 1. | ∀ x .(∃ y . p ( x , y ) ⇒ q ( x )) | Premise |
| --- | --- | --- |
| 2. | ∃ y . p ( c , y ) ⇒ q ( c ) | Universal Elimination: 1 |
| 3. | p ( c , d ) | Assumption |
| 4. | ∃ y . p ( c , y ) | Existential Introduction: 3 |
| 5. | q ( c ) | Implication Elimination: 2, 4 |
| 6. | p ( c , d ) ⇒ q ( c ) | Implication Introduction: 3, 5 |
| 7. | ∀ y .( p ( c , y ) ⇒ q ( c )) | Universal Introduction: 6 |
| 8. | ∀ x .∀ y .( p ( x , y ) ⇒ q ( x )) | Universal Introduction: 7 |

  =======================================================================

### 10.5 Existential Elimination

*Existential Elimination* (EE) works in the opposite direction.Suppose we have an existentially quantified sentence with target φ; and suppose we have a universally quantified implication in which the antecedent is the same as the scope of our existentially quantified sentence and the conclusion does not contain any occurrences of the quantified variable.  Then, we can use Existential Elimination to infer the consequent.

| Existential Elimination |
| --- |
| ∃ν.φ |
| ∀ν.(φ ⇒ ψ) |
|  |
| ψ |
| where ν does not occur free in ψ |

For example, if we have the sentence ∃*x*.*p*(*a*,*x*) and we have the sentence ∀*x*.(*p*(*a*,*x*) ⇒ *q*(*a*)), then we can apply existential elimination to conclude *q*(*a*)).

| 1. | ∃ x . p ( a , x ) | Premise |
| --- | --- | --- |
| 2. | ∀ x .( p ( a , x ) ⇒ q ( a )) | Premise |
| 3. | q ( a ) | Existential Elimination: 1, 2 |

Note that the condition that ν does not occur free in ψ is essential.  Consider the following *erroneous* line of reasoning to see what goes wrong without this condition.

| 1. | ∃ x . p ( x ) | Premise |
| --- | --- | --- |
| 2. | ∀ x .( p ( x ) ⇒ q ( x )) | Premise |
| 3. | q ( x ) | Existential Elimination: 1, 2 |
| 4. | ∀ x . q ( x ) | Universal Introduction: 3 |

If *p* is true of an object, then *q* is also true of that object.  We know that *p* is true of at least one object.  And somehow we have shown that *q* is true of everything, which does not follow from the given premises.

In order to understand why existential elimination works, assume we know ∃*x*.*p*(*x*) and we also know ∀*x*.(*p*(*x*) ⇒ *q*(*c*)).  The distribution theorem for universal quantifiers tells us that the second sentence is logically equivalent to ∃*x*.*p*(*x*) ⇒ *q*(*c*).  Given a sentence that matches the first premise of Existential Elimination, e.g. ∃*x*.*p*(*x*), we can use Implication Elimination to conclude *q*(*c*), which is exactly what Existential Elimination allows us to do.

This intuition raises the question of why Existential Elimination needs to be so complicated.  Why not use the version with an existential in the antecedent?  The reason is not easy to explain.  Suffice it to say that there are things that are logically entailed that cannot be proved without the version of Existential Elimination with the universal quantifier wrapped around the entire implication.

It is interesting to note that Existential Elimination is analogous to Or Elimination.  An existential sentence is effectively a disjunction.  To see this, consider a language with just two object constants *a* and *b* (or, equivalently, a world with just two objects).  Now suppose we learn that there is some object that satisfies the *p* relation, i.e. ∃*x*.*p*(*x*).  Then we know that *p* must be true of at least one of *a* or *b*, i.e. *p*(*a*) ∨ *p*(*b*).

Now, recall that, in Or Elimination, we start with a disjunction with *n* disjuncts and *n* implications, one for each of the disjuncts and produce as conclusion the consequent shared by all of the implications.  An existential sentence (like the first premise in any instance of Existential Elimination) is effectively a disjunction over the set of all ground terms; and a universal implication (like the second premise in any instance of Existential Elimination) is effectively a set of implications, one for each ground term in the language.  The conclusion of Existential Elimination is the common consequent of these implications, just as in Or Elimination.

Reasoning with existential statements is difficult, and confusion about Existential Elimination only complicates matters.  However, such reasoning can be simplified by thinking about existential reasoning in the right way.  The basic idea is illustrated in the following examples.

Suppose we are given the statement ∃*x*.(*p*(*x*) ∧ *q*(*x*)) and we are asked to prove  the statement ∃*x*.*q*(*x*).  We begin our proof with the given premise.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |

We know there is an object that satisfies both *p* and *q*.  In order to make progress, let's use a placeholder, e.g. *c*, to talk about this object, and let us assume that *c* satisfies the scope of the existential.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |
| 2. | p ( c ) ∧ q ( c ) | Assumption |

At this point, we use and elimination to split the conjunction.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |
| 2. | p ( c ) ∧ q ( c ) | Assumption |
| 3. | q ( c ) | And Elimination: 2 |

Now, we use existential introduction to derive the sentence we are trying to prove.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |
| 2. | p ( c ) ∧ q ( c ) | Assumption |
| 3. | q ( c ) | And Elimination: 2 |
| 4. | ∃ x . q ( x ) | Existential Introduction: 3 |

That looks good, but our conclusion is embedded in a subproof.  We have shown that ∃*x*.*q*(*x*) is true under the assumption that *p*(*c*) ∧ *q*(*c*) is true.  To finish the proof, we need to get the conclusion out of the subproof.  Fortunately, this is easy to do, but it takes a few steps.

First, we use Implication Introduction to exit the subproof.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |
| 2. | p ( c ) ∧ q ( c ) | Assumption |
| 3. | q ( c ) | And Elimination: 2 |
| 4. | ∃ x . q ( x ) | Existential Introduction: 3 |
| 5. | p ( c ) ∧ q ( c ) ⇒ ∃ x . q ( x ) | Implication Introduction: 2, 4 |

Next, we get rid of our placeholder using Universal Introduction.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |
| 2. | p ( c ) ∧ q ( c ) | Assumption |
| 3. | q ( c ) | And Elimination: 2 |
| 4. | ∃ x . q ( x ) | Existential Introduction: 3 |
| 5. | p ( c ) ∧ q ( c ) ⇒ ∃ x . q ( x ) | Implication Introduction: 2, 4 |
| 6. | ∀ x .( p ( x ) ∧ q ( x ) ⇒ ∃ x . q ( x )) | Universal Introduction: 5 |

Finally, we use existential elimination to get our desired conclusion.

| 1. | ∃ x .( p ( x ) ∧ q ( x )) | Premise |
| --- | --- | --- |
| 2. | p ( c ) ∧ q ( c ) | Assumption |
| 3. | q ( c ) | And Elimination: 2 |
| 4. | ∃ x . q ( x ) | Existential Introduction: 3 |
| 5. | p ( c ) ∧ q ( c ) ⇒ ∃ x . q ( x ) | Implication Introduction: 2, 4 |
| 6. | ∀ x .( p ( x ) ∧ q ( x ) ⇒ ∃ x . q ( x )) | Universal Introduction: 5 |
| 7. | ∃ x . q ( x ) | Existential Elimination: 1, 6 |

The key to this proof is the subproof.  Given an existential statement, we start by assuming the scope of true for some placeholder and we prove our result.  Having done this, we use Implication Introduction, Universal Introduction, and Existential Elimination to get the conclusion out of the subproof.

 =======================================================================

### 10.6 Domain Closure

*Domain Closure* (DC) offers an alternative way to derive universally quantified sentences.  For a language with object constants σ1, ... , σ*n*, the rule is written as shown below.  If we believe a schema is true for every instance, then we can infer a universally quantified version of that schema.

| Domain Closure |
| --- |
| φ[σ 1 ] |
| ... |
| φ[σ n ] |
|  |
| ∀ν.φ[ν] |

For example, in a language with four object constants *a* and *b* and *c* and *d*, we can derive the conclusion ∀*x*.φ[*x*] whenever we have φ[*a*] and  φ[*b*] and  φ[*c*] and  φ[*d*].

Note that in applying Domain Closure, we do *not* need to worry about placeholders.  Placeholders are just surrogates for constants in our language.  If we have managed to prove that a condition holds for all of our object constants, then it must be true of everything, including whatever objects our placeholders represent.

Why restrict Domain Closure to languages with finitely many ground terms?  Why not use domain closure rules for languages with infinitely many ground terms as well?  It would be good if we could, but this would require rules of infinite length, and we do not allow infinitely large sentences in our language.  We can get the effect of such sentences through the use of *induction*, which is discussed in a later chapter.

 ======================================================================= <h3>10.7 Examples</h3>

<p>As an illustration of these concepts, consider the following problem.  Suppose we believe that everybody loves somebody.  And suppose we believe that everyone loves a lover.  Our job is to prove that Jack loves Jill.</p>

<p>First, we need to formalize our premises.  Everybody loves somebody.  For all <i>y</i>, there exists a <i>z</i> such that <i>loves</i>(<i>y</i>,<i>z</i>).</p>

<center>
&forall;<i>y</i>.&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>)</center><p>Everybody loves a lover.  If a person is a lover, then everyone loves him.  If a person loves another person, then everyone loves him.  For all <i>x</i> and for all <i>y</i> and for all <i>z</i>, <i>loves</i>(<i>y</i>,<i>z</i>) implies <i>loves</i>(<i>x</i>,<i>y</i>).</p>

<center>
&forall;<i>x</i>.&forall;<i>y</i>.(&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>) &rArr; <i>loves</i>(<i>x</i>,<i>y</i>))</center><p>Our goal is to show that Jack loves Jill.  In other words, starting with the preceding sentences, we want to derive the following sentence.</p><center><i>loves</i>(<i>jack</i>,<i>jill</i>)
</center>

<p>A proof of this result is shown below.  Our premises appear on lines 1 and 2.  The sentence on line 3 is the result of applying Universal Elimination to the sentence on line 1, substituting <i>jill</i> for <i>y</i>.  The sentence on line 4 is the result of applying Universal Elimination to the sentence on line 2, substituting <i>jack</i> for <i>x</i>.   The sentence on line 5 is the result of applying Universal Elimination to the sentence on line 4, substituting <i>jill</i> for <i>y</i>.  Finally, we apply Implication Elimination to produce our conclusion on line 6.</p>
<center><table><tr height='24'><td width='20'>1.</td><td>&forall;<i>y</i>.&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>)</td><td>Premise</td></tr><tr height='24'><td>2.</td><td>&forall;<i>x</i>.&forall;<i>y</i>.(&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>) &rArr; <i>loves</i>(<i>x</i>,<i>y</i>))</td><td>Premise</td></tr><tr height='24'><td>3.</td><td>&exist;<i>z</i>.<i>loves</i>(<i>jill</i>,<i>z</i>)</td><td>Universal Elimination: 1</td></tr><tr height='24'><td>4.</td><td>&forall;<i>y</i>.(&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>) &rArr; <i>loves</i>(<i>jack</i>,<i>y</i>))</td><td>Universal Elimination: 2</td></tr><tr height='24'><td>5.</td><td>&exist;<i>z</i>.<i>loves</i>(<i>jill</i>,<i>z</i>) &rArr; <i>loves</i>(<i>jack</i>,<i>jill</i>)</td><td>Universal Elimination: 4</td></tr><tr height='24'><td>6.</td><td><i>loves</i>(<i>jack</i>,<i>jill</i>)</td><td>Implication Elimination: 5,3</td></tr>
  </table>
</center>

<p>Now, let's consider a slightly more interesting version of this problem.  We start with the same premises.  However, our goal now is to prove the somewhat stronger result that everyone loves everyone.  For all <i>x</i> and for all <i>y</i>, <i>x</i> loves <i>y</i>.</p>

<center>&forall;<i>x</i>.&forall;<i>y</i>.<i>loves</i>(<i>x</i>,<i>y</i>)
</center>

<p>The proof shown below is analogous to the proof above.  The only difference is that we have free variables in place of object constants at various points in the proof.  Once again, our premises appear on lines 1 and 2.  Once again, we use Universal Elimination to produce the result on line 3; but this time the result contains a placeholder.  We get the results on lines 4 and 5 by successive application of Universal Elimination to the sentence on line 2.  We deduce the result on line 6 using Implication Elimination. Finally, we use two applications of Universal Introduction to generalize our result and produce the desired conclusion.</p>

<center>  <table><tr height='30'><td width='20'>1.</td><td>&forall;<i>y</i>.&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>)</td><td>Premise</td></tr><tr height='30'><td>2.</td><td>&forall;<i>x</i>.&forall;<i>y</i>.(&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>) &rArr; <i>loves</i>(<i>x</i>,<i>y</i>))</td><td>Premise</td></tr><tr height='30'><td>3.</td><td>&exist;<i>z</i>.<i>loves</i>(<i>d</i>,<i>z</i>)</td><td>Universal Elimination: 1</td></tr><tr height='30'><td>4.</td><td>&forall;<i>y</i>.(&exist;<i>z</i>.<i>loves</i>(<i>y</i>,<i>z</i>) &rArr; <i>loves</i>(<i>c</i>,<i>y</i>))</td><td>Universal Elimination: 2</td></tr><tr height='30'><td>5.</td><td>&exist;<i>z</i>.<i>loves</i>(<i>d</i>,<i>z</i>) &rArr; <i>loves</i>(<i>c</i>,<i>d</i>)</td><td>Universal Elimination: 4</td></tr><tr height='30'><td>6.</td><td><i>loves</i>(<i>c</i>,<i>d</i>)</td><td>Implication Elimination: 5,3</td></tr>

<tr height='30'><td>7.</td><td>&forall;<i>y</i>.<i>loves</i>(<i>c</i>,<i>y</i>)</td><td>Universal Introduction: 6</td></tr>

<tr height='30'><td>8.</td><td>&forall;<i>x</i>.&forall;<i>y</i>.<i>loves</i>(<i>x</i>,<i>y</i>)</td><td>Universal Introduction: 7</td></tr>
  </table>
</center>

<p>This second example illustrates the use of placeholders.  We can manipulate them as though we are talking about specific individuals (though each one could be any object); and, when we are done, we can universalize them to derive universally quantified conclusions.</p> =======================================================================

### Recap

A Fitch system for Relational Logic can be obtained by extending the Fitch system for Propositional Logic with five additional rules to deal with quantifiers.  The *Universal Elimination* rule allows us to reason from a universally quantified sentence to a version of the target of that sentence in which the universally quantified variable is replaced by an appropriate term.  The *Universal Introduction* rule allows us to reason from arbitrary sentences to universally quantified versions of those sentences.  The *Existential Introduction* rule allows us to reason from a sentence involving a term τ to an existentially quantified sentence in which one, some, or all occurrences of τ have been replaced by the existentially quantified variable.  The *Existential Elimination* rule allows us to derive consequences of an existentially quantified sentence.  Finally, the Domain Closure rule allows us to reason from all instances of a sentence to a universally quantified version of that sentence.

 =======================================================================

### Exercises

[Exercise 10.1:](http://intrologic.stanford.edu/exercises/exercise_10_01.html) Given ∀*x*.(*p*(*x*) ∧ *q*(*x*)), use the Fitch System to prove ∀*x*.*p*(*x*) ∧ ∀*x*.*q*(*x*).

[Exercise 10.2:](http://intrologic.stanford.edu/exercises/exercise_10_02.html) Given ∀*x*.*p*(*x*) ∧ ∀*x*.*q*(*x*), use the Fitch System to prove ∀*x*.(*p*(*x*) ∧ *q*(*x*)).

[Exercise 10.3:](http://intrologic.stanford.edu/exercises/exercise_10_03.html) Given ∀*x*.(*p*(*x*) ⇒ *q*(*x*)), use the Fitch System to prove ∀*x*.*p*(*x*) ⇒ ∀*x*.*q*(*x*).

[Exercise 10.4:](http://intrologic.stanford.edu/exercises/exercise_10_04.html) Given ∀*x*.*p*(*x*) ∨ ∀*x*.*q*(*x*), use the Fitch System to prove ∀*x*.(*p*(*x*) ∨ *q*(*x*)).

[Exercise 10.5:](http://intrologic.stanford.edu/exercises/exercise_10_05.html) Given ∀*x*.∀*y*.*p*(*x*,*y*), use the Fitch System to prove ∀*y*.∀*x*.*p*(*x*,*y*).

[Exercise 10.6:](http://intrologic.stanford.edu/exercises/exercise_10_06.html) Given ∃*x*.(*p*(*x*) ∧ *q*(*x*)), use the Fitch System to prove ∃*x*.*p*(*x*) ∧ ∃*x*.*q*(*x*).

[Exercise 10.7:](http://intrologic.stanford.edu/exercises/exercise_10_07.html) Given ∃*x*.(*p*(*x*) ∨ *q*(*x*)), use the Fitch System to prove ∃*x*.*p*(*x*) ∨ ∃*x*.*q*(*x*).

[Exercise 10.8:](http://intrologic.stanford.edu/exercises/exercise_10_08.html) Given ∃*x*.*p*(*x*) ∨ ∃*x*.*q*(*x*), use the Fitch System to prove ∃*x*.(*p*(*x*) ∨ *q*(*x*)).

[Exercise 10.9:](http://intrologic.stanford.edu/exercises/exercise_10_09.html) Given ∃*x*.∃*y*.*p*(*x*,*y*), use the Fitch System to prove ∃*y*.∃*x*.*p*(*x*,*y*).

[Exercise 10.10:](http://intrologic.stanford.edu/exercises/exercise_10_10.html) Given ∃*y*.∀*x*.*p*(*x*,*y*), use the Fitch system to prove ∀*x*.∃*y*.*p*(*x*,*y*).

[Exercise 10.11:](http://intrologic.stanford.edu/exercises/exercise_10_11.html) Given ∃*x*.¬*p*(*x*), use the Fitch System to prove ¬∀*x*.*p*(*x*).

[Exercise 10.12:](http://intrologic.stanford.edu/exercises/exercise_10_12.html) Given ∀*x*.¬*p*(*x*), use the Fitch System to prove ¬∃*x*.*p*(*x*).

[Exercise 10.13:](http://intrologic.stanford.edu/exercises/exercise_10_13.html) Given ¬∃*x*.*p*(*x*), use the Fitch System to prove ∀*x*.¬*p*(*x*).

[Exercise 10.14:](http://intrologic.stanford.edu/exercises/exercise_10_14.html) Given ¬∀*x*.*p*(*x*), use the Fitch System to prove ∃*x*.¬*p*(*x*).

[Exercise 10.15:](http://intrologic.stanford.edu/exercises/exercise_10_15.html) Consider a language with just three object constants - *a*, *b*, and *c*.  Given *p*(*a*,*b*) and *p*(*b*,*c*) and *p*(*c*,*a*), use the Fitch System to prove ∀*x*.∃*y*.*p*(*x*,*y*).

[Exercise 10.16:](http://intrologic.stanford.edu/exercises/exercise_10_16.html) Consider a language with just two object constants - *a* and *b*.  Given ¬*p*(*a*) and *q*(*b*), use the Fitch System to prove ∀*x*(*p*(*x*) ⇒ *q*(*x*)).

 <p><a href='../exercises/exercise_10_03.html' style='color:#6666ff;cursor:pointer;text-decoration:none'>Exercise 10.3:</a> Given the premises &forall;<i>x</i>.(<i>p</i>(<i>x</i>) &rArr; <i>q</i>(<i>x</i>)) and &forall;<i>x</i>.(<i>q</i>(<i>x</i>) &rArr; <i>r</i>(<i>x</i>)), use the Fitch system to prove the conclusion &forall;<i>x</i>.(<i>p</i>(<i>x</i>) &rArr; <i>r</i>(<i>x</i>)).</p> <p><a href='../exercises/exercise_10_05.html' style='color:#6666ff;cursor:pointer;text-decoration:none'>Exercise 10.5:</a> Given &forall;<i>x</i>.&forall;<i>y</i>.<i>p</i>(<i>x</i>,<i>y</i>), use the Fitch System to prove &forall;<i>x</i>.&forall;<i>y</i>.<i>p</i>(<i>y</i>,<i>x</i>).</p>
<hr/>
<!--=======================================================================
