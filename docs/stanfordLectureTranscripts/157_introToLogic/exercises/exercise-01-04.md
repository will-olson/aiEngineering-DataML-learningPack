# Exercise 1.4

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_01_04.html](http://intrologic.stanford.edu/exercises/exercise_01_04.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 1.4 - Satisfaction |
| --- |

---

 =======================================================================

| This exercise concerns the interpersonal relations of a small sorority.  There are just four members - Abby, Bess, Cody, and Dana; and there is just one type of binary relationship - likes.  The following table below shows who likes whom.  A check in a box of the table indicates that the girl named at the beginning of the row likes the girl named at the head of the column; the absence of a check means that she does not.  You can add a relationship by clicking in one of the empty squares of the table; you can remove a relationship by clicking in a checked square. Abby Bess Cody Dana Abby Bess Cody Dana The sentences in the table below describe some relationships among the girls, with an indication of whether they are true or false in the world depicted in the first table.  As you change the world, the truth values of these sentences are recomputed and displayed in this table. Sentence Truth Value Dana likes Cody. likes(dana,cody) Abby does not like Dana. ~likes(abby,dana) Bess likes Cody or Dana. likes(bess,cody) \| likes(bess,dana) Abby likes everyone that Bess likes. AY:(likes(bess,Y) => likes(abby,Y)) Cody likes everyone who likes her. AY:(likes(Y,cody) => likes(cody,Y)) Nobody likes herself. AX:~likes(X,X) Try to make all of the sentences true.  Note that there are multiple ways this can be done. |  | Abby | Bess | Cody | Dana | Abby |  |  |  |  | Bess |  |  |  |  | Cody |  |  |  |  | Dana |  |  |  |  | Sentence | Truth Value | Truth Value | Dana likes Cody. | likes(dana,cody) |  | Abby does not like Dana. | ~likes(abby,dana) |  | Bess likes Cody or Dana. | likes(bess,cody) \| likes(bess,dana) |  | Abby likes everyone that Bess likes. | AY:(likes(bess,Y) => likes(abby,Y)) |  | Cody likes everyone who likes her. | AY:(likes(Y,cody) => likes(cody,Y)) |  | Nobody likes herself. | AX:~likes(X,X) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | Abby | Bess | Cody | Dana |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Abby |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Bess |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Cody |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dana |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Sentence | Truth Value | Truth Value |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dana likes Cody. | likes(dana,cody) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Abby does not like Dana. | ~likes(abby,dana) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Bess likes Cody or Dana. | likes(bess,cody) \| likes(bess,dana) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Abby likes everyone that Bess likes. | AY:(likes(bess,Y) => likes(abby,Y)) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Cody likes everyone who likes her. | AY:(likes(Y,cody) => likes(cody,Y)) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Nobody likes herself. | AX:~likes(X,X) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

  =======================================================================
