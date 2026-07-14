# Exercise 14.8

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_14_08.html](http://intrologic.stanford.edu/exercises/exercise_14_08.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 14.8 - Resolution |
| --- |

---

 =======================================================================

| Given ∀ x .∀ y .∀ z .( p ( x , y ) ∧ p ( y , z ) ⇒ p ( x , z )), ∀ x . p ( x , a ), and ∀ y . p ( a , y ), use Relational Resolution to prove ∀ x .∀ y . p ( x , y ). |
| --- |

  =======================================================================

| Robinson |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
| Undo Copy Paste Help | Undo | Copy | Paste | Help |  |  |
| Undo | Copy | Paste | Help |  |  |  |
| To apply a rule of inference, check the lines you wish to use as premises and click the button for the rule of inference.  Reiteration allows you to repeat an earlier item.  To delete one or more lines from a proof, check the desired lines and click Delete.  Note that factoring and resolution are implemented here as separate rules of inference.  When entering expressions, use Ascii characters only.  Use ~ for ¬; use { and } for sets.  For variables use strings of alphanumeric characters that begin with a capital letter.  For example, to enter the sentence {¬ p ( x ), q ( y )}, write {~p(X), q(Y)} . |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| Objects: a, b, c Functions: f, g | Objects: a, b, c | Objects: | a, b, c |  | Functions: | f, g |
| Objects: a, b, c | Objects: | a, b, c |  |  |  |  |
|  | Functions: | f, g |  |  |  |  |
| Enter the object constants you wish to add to the vocabulary: | Enter the object constants you wish to add to the vocabulary: |  |  |  |  |  |
| Enter the object constants you wish to add to the vocabulary: |  |  |  |  |  |  |
| Enter the object constants you wish to delete from the vocabulary: | Enter the object constants you wish to delete from the vocabulary: |  |  |  |  |  |
| Enter the object constants you wish to delete from the vocabulary: |  |  |  |  |  |  |
| Enter the function constants you wish to add to the vocabulary: | Enter the function constants you wish to add to the vocabulary: |  |  |  |  |  |
| Enter the function constants you wish to add to the vocabulary: |  |  |  |  |  |  |
| Enter the function constants you wish to delete from the vocabulary: | Enter the function constants you wish to delete from the vocabulary: |  |  |  |  |  |
| Enter the function constants you wish to delete from the vocabulary: |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| Goal Incomplete | Goal |  | Incomplete |  |  |  |
| Goal |  | Incomplete |  |  |  |  |
| Enter the clause or the premise you wish to clausify and add to the proof: | Enter the clause or the premise you wish to clausify and add to the proof: |  |  |  |  |  |
| Enter the clause or the premise you wish to clausify and add to the proof: |  |  |  |  |  |  |
| Enter the goal you wish to negate, clausify, and add to the proof: | Enter the goal you wish to negate, clausify, and add to the proof: |  |  |  |  |  |
| Enter the goal you wish to negate, clausify, and add to the proof: |  |  |  |  |  |  |
| Enter the symbol you wish to replace: Enter the replacement: | Enter the symbol you wish to replace: Enter the replacement: |  |  |  |  |  |
| Enter the symbol you wish to replace: Enter the replacement: |  |  |  |  |  |  |
| Enter the variable you wish to instantiate: Enter the term you want to use as a replacement: | Enter the variable you wish to instantiate: Enter the term you want to use as a replacement: |  |  |  |  |  |
| Enter the variable you wish to instantiate: Enter the term you want to use as a replacement: |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |

 =======================================================================

  =======================================================================    1 {~p(X,Y),~p(Y,Z),p(X,Z)} Premise   2 {p(X,a)} Premise   3 {p(a,Y)} Premise   4 {~p(b,c)} Negated Goal   5 {~p(b,V35),~p(V35,c)} Resolution 1 4   6 {~p(a,c)} Resolution 2 5   7 {} Resolution 3 6    =======================================================================
