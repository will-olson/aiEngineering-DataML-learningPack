# Exercise 8.3

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_08_03.html](http://intrologic.stanford.edu/exercises/exercise_08_03.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 8.3 - Consistency |
| --- |

---

 =======================================================================

| Consider a version of the Blocks World with just three blocks - a , b , and c .  The on relation is axiomatized below. ¬ on ( a , a ) on ( a , b ) ¬ on ( a , c ) ¬ on ( b , a ) ¬ on ( b , b ) on ( b , c ) ¬ on ( c , a ) ¬ on ( c , b ) ¬ on ( c , c ) Let's suppose that the above relation is defined as follows.  This is almost the same as in Section 7.7 except that we have replaced an occurrence of on with above . ∀ x .∀ z .( above ( x , z ) ⇔ on ( x , z ) ∨ ∃ y .( above ( x , y ) ∧ above ( y , z ))) A sentence φ is consistent with a set Δ of sentences if and only if there is a truth assignment that satisfies all of the sentences in Δ ∪ {φ}.  Say whether each of the following sentences is consistent with the sentences about on and above shown above.  Be careful.  It's tricky. a. above ( a , c ) Consistent Inconsistent b. above ( a , a ) Consistent Inconsistent c. above ( c , a ) Consistent Inconsistent | ¬ | on ( a , a ) |  |  | on ( a , b ) |  | ¬ | on ( a , c ) | ¬ | on ( b , a ) |  | ¬ | on ( b , b ) |  |  | on ( b , c ) | ¬ | on ( c , a ) |  | ¬ | on ( c , b ) |  | ¬ | on ( c , c ) | a. | above ( a , c ) | Consistent Inconsistent |  | b. | above ( a , a ) | Consistent Inconsistent |  | c. | above ( c , a ) | Consistent Inconsistent |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ¬ | on ( a , a ) |  |  | on ( a , b ) |  | ¬ | on ( a , c ) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ¬ | on ( b , a ) |  | ¬ | on ( b , b ) |  |  | on ( b , c ) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ¬ | on ( c , a ) |  | ¬ | on ( c , b ) |  | ¬ | on ( c , c ) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| a. | above ( a , c ) | Consistent Inconsistent |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| b. | above ( a , a ) | Consistent Inconsistent |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| c. | above ( c , a ) | Consistent Inconsistent |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

  =======================================================================
