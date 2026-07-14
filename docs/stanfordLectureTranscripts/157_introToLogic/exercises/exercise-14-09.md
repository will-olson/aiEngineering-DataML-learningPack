# Exercise 14.9

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_14_09.html](http://intrologic.stanford.edu/exercises/exercise_14_09.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 14.9 - Resolution |
| --- |

---

 =======================================================================

| Use resolution to show that the clauses {¬ p ( x , y ), q ( x , y , f ( x , y ))},
{¬ r ( y , z ), q ( a , y , z )},
{ r ( y , z ), ¬ q ( a , y , z )},
{ p ( x ,g( x )), q ( x ,g( x ), z )}, and
{¬ r ( x , y ), ¬ q ( x , w , z )} are unsatisfiable.  This one is a little tricky.  Be careful about factoring. |
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

  =======================================================================    1 {~p(X,Y),q(X,Y,f(X,Y))} Premise   2 {~r(Y,Z),q(a,Y,Z)} Premise   3 {r(Y,Z),~q(a,Y,Z)} Premise   4 {p(X,g(X)),q(X,g(X),Z)} Premise   5 {~r(X,Y),~q(X,W,Z)} Premise   6 {~q(a,X,Y),~q(X,W,Z)} Resolution 3 5   7 {q(X,g(X),V34),q(X,g(X),f(X,g(X)))} Resolution 4 1   8 {q(X,g(X),f(X,g(X)))} Factoring 7   9 {~q(a,X,Y)} Resolution 8 6   10 {} Resolution 8 9   =======================================================================
