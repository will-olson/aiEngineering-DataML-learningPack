# Exercise 9.2

> **Source:** [http://intrologic.stanford.edu/exercises/exercise_09_02.html](http://intrologic.stanford.edu/exercises/exercise_09_02.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Exercise 9.2 - Boolean Models |
| --- |

---

 =======================================================================

| Amy, Bob, Coe, and Dan are traveling to different places.  One goes by train, one by car, one by plane, and one by ship. Amy hates flying.  Bob rented his vehicle.  Coe tends to get seasick.  And Dan loves trains.  Use the Boolean model technique and the following table to figure out which person, used which mode of transportation.  Clicking on an empty cell in the table makes that cell true; clicking on a true cell makes it false; and clicking on a false cell makes its truth value unknown. train car plane ship Amy Bob Coe Dan The sentences in the table below capture the available information.  As you change the world, the truth values of these sentences are recomputed and displayed in this table. Sentence Truth Value Each person took a train or a car or a plane or a ship. EY:rides(amy,Y)&EY:rides(bob,Y)&EY:rides(coe,Y)&EY:rides(dan,Y) No two people used the same method of transportation. (AX:(~rides(amy,X)\|~rides(bob,X)))&(AX:(~rides(amy,X)\|~rides(coe,X)))&(AX:(~rides(amy,X)\|~rides(dan,X)))&(AX:(~rides(bob,X)\|~rides(coe,X)))&(AX:(~rides(bob,X)\|~rides(dan,X)))&(AX:(~rides(coe,X)\|~rides(dan,X))) Amy hates flying ~rides(amy,plane) Bob rented his vehicle. rides(bob,car) Coe gets seasick. ~rides(coe,ship) Dan loves trains. rides(dan,train) |  | train | car | plane | ship | Amy |  |  |  |  | Bob |  |  |  |  | Coe |  |  |  |  | Dan |  |  |  |  | Sentence | Truth Value | Truth Value | Each person took a train or a car or a plane or a ship. | EY:rides(amy,Y)&EY:rides(bob,Y)&EY:rides(coe,Y)&EY:rides(dan,Y) |  | No two people used the same method of transportation. | (AX:(~rides(amy,X)\|~rides(bob,X)))&(AX:(~rides(amy,X)\|~rides(coe,X)))&(AX:(~rides(amy,X)\|~rides(dan,X)))&(AX:(~rides(bob,X)\|~rides(coe,X)))&(AX:(~rides(bob,X)\|~rides(dan,X)))&(AX:(~rides(coe,X)\|~rides(dan,X))) |  | Amy hates flying | ~rides(amy,plane) |  | Bob rented his vehicle. | rides(bob,car) |  | Coe gets seasick. | ~rides(coe,ship) |  | Dan loves trains. | rides(dan,train) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | train | car | plane | ship |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Amy |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Bob |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Coe |  |  |  |  | Dan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Sentence | Truth Value | Truth Value |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Each person took a train or a car or a plane or a ship. | EY:rides(amy,Y)&EY:rides(bob,Y)&EY:rides(coe,Y)&EY:rides(dan,Y) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| No two people used the same method of transportation. | (AX:(~rides(amy,X)\|~rides(bob,X)))&(AX:(~rides(amy,X)\|~rides(coe,X)))&(AX:(~rides(amy,X)\|~rides(dan,X)))&(AX:(~rides(bob,X)\|~rides(coe,X)))&(AX:(~rides(bob,X)\|~rides(dan,X)))&(AX:(~rides(coe,X)\|~rides(dan,X))) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Amy hates flying | ~rides(amy,plane) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Bob rented his vehicle. | rides(bob,car) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Coe gets seasick. | ~rides(coe,ship) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dan loves trains. | rides(dan,train) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

  =======================================================================
