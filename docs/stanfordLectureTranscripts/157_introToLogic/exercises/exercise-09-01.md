# Exercise 9.1

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_09_01.html](http://intrologic.stanford.edu/exercises/exercise_09_01.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 9.1 - Boolean Models |
| --- |

---

 =======================================================================

| Ruby Red, Willa White, and Betty Blue meet for lunch. One is wearing a red skirt; one is wearing a white skirt; and one is wearing a blue skirt. No one is wearing more than one color, and no two are wearing the same color. Betty Blue tells one of her companions, "Did you notice we are all wearing skirts with different colors from our names?"; and the other woman, who is wearing a white skirt, says, "Wow, that's right!" Use the Boolean model technique to figure out who is wearing what color skirt.  Clicking on an empty cell in the table makes that cell true; clicking on a true cell makes it false; and clicking on a false cell makes its truth value unknown. red white blue Ruby Willa Betty The sentences in the table below capture the available information.  As you change the world, the truth values of these sentences are recomputed and displayed in this table. Sentence Truth Value Each person is wearing a red skirt or a white skirt or a blue skirt. AX:EY:wears(X,Y) No one is wearing more than one color. AX:AY:AZ:(~wears(X,Y) \| ~wears(X,Z) \| same(Y,Z)) No two people are wearing the same color. AX:AY:AZ:(~wears(X,Z) \| ~wears(Y,Z) \| same(X,Y)) Each person's skirt color is different from the person's name. (wears(red,white)\|wears(red,blue)) & (wears(white,red)\|wears(white,blue)) & (wears(blue,red)\|wears(blue,white)) The woman wearing the white skirt is not Betty Blue. EX:(wears(X,white) & distinct(X,blue)) |  | red | white | blue | Ruby |  |  |  | Willa |  |  |  | Betty |  |  |  | Sentence | Truth Value | Truth Value | Each person is wearing a red skirt or a white skirt or a blue skirt. | AX:EY:wears(X,Y) |  | No one is wearing more than one color. | AX:AY:AZ:(~wears(X,Y) \| ~wears(X,Z) \| same(Y,Z)) |  | No two people are wearing the same color. | AX:AY:AZ:(~wears(X,Z) \| ~wears(Y,Z) \| same(X,Y)) |  | Each person's skirt color is different from the person's name. | (wears(red,white)\|wears(red,blue)) & (wears(white,red)\|wears(white,blue)) & (wears(blue,red)\|wears(blue,white)) |  | The woman wearing the white skirt is not Betty Blue. | EX:(wears(X,white) & distinct(X,blue)) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | red | white | blue |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Ruby |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Willa |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Betty |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Sentence | Truth Value | Truth Value |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Each person is wearing a red skirt or a white skirt or a blue skirt. | AX:EY:wears(X,Y) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| No one is wearing more than one color. | AX:AY:AZ:(~wears(X,Y) \| ~wears(X,Z) \| same(Y,Z)) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| No two people are wearing the same color. | AX:AY:AZ:(~wears(X,Z) \| ~wears(Y,Z) \| same(X,Y)) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Each person's skirt color is different from the person's name. | (wears(red,white)\|wears(red,blue)) & (wears(white,red)\|wears(white,blue)) & (wears(blue,red)\|wears(blue,white)) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| The woman wearing the white skirt is not Betty Blue. | EX:(wears(X,white) & distinct(X,blue)) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

  =======================================================================
