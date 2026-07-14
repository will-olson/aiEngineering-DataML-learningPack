# Exercise 14.7

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_14_07.html](http://intrologic.stanford.edu/exercises/exercise_14_07.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 14.7 - Resolution |
| --- |

---

 =======================================================================

| Use Resolution to prove ∀ x .((( p ( x ) ⇒ q ( x )) ⇒ p ( x )) ⇒ p ( x )). |
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

  =======================================================================   1 {p(c)} Negated Goal   2 {~q(c),p(c)} Negated Goal   3 {~p(c)} Negated Goal   4 {} Resolution 1 3    =======================================================================
