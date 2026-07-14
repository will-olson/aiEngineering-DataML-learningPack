# Chapter 1 — Introduction

> **Source:** [http://intrologic.stanford.edu/chapters/chapter_01.html](http://intrologic.stanford.edu/chapters/chapter_01.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

| C H A P T E R  1 |
| --- |

| Introduction |
| --- |

  =======================================================================

### 1.1 Introduction

Hermione Granger got it right when, facing the potion-master's test in Harry Potter, she said: "This isn't magic - it's *logic* - a puzzle. A lot of the greatest wizards haven't got an ounce of logic; they'd be stuck here forever."

In the real world, we are better off.  We use Logic in just about everything we do.  We use it in our professional lives - in proving mathematical theorems, in debugging computer programs, in medical diagnosis, and in legal reasoning.  And we use it in our personal lives - in solving puzzles, in playing games, and in doing school assignments, not just in Math but also in History and English and other subjects.

Just because we use Logic does not mean we are necessarily good at it.  Thinking correctly and effectively requires training in Logic, just as writing well requires training in English and composition.  Without explicit training, we are likely to be unsure of our conclusions; we are prone to make mistakes; and we are apt to be fooled by others.

The ancient Greeks thought Logic sufficiently important that it was one of the three subjects in the Greek educational Trivium, along with Grammar and Rhetoric.  Oddly, Logic occupies a relatively small place in the modern school curriculum. We have courses in the Sciences and various branches of Mathematics, but very few secondary schools offer courses in Logic; and it is not required in most university programs.

Given the importance of the subject, this is surprising.  Calculus is important to physics.  And it is widely taught at the high school level. Logic is important in all of these disciplines, and it is *essential* in computer science.  Yet it is rarely offered as a standalone course, making it more difficult for students to succeed and get better quality jobs.

This course is a basic introduction to Logic.  It is intended primarily for university students. However, it has been used by motivated secondary school students and post-graduate professionals interested in honing their logical reasoning skills.

There are just two prerequisites. The course presumes that the student understands sets and set operations, such as union, intersection, and complement. The course also presumes that the student is comfortable with symbolic mathematics, at the level of high-school algebra.  Nothing else is required.

This chapter is an overview of the course.  We start with a look at the essential elements of logic - logical sentences, logical entailment, and logical proofs.  We then see some of the problems with the use of natural language and see how those problems can be mitigated through the use of Symbolic Logic.  Finally, we discuss the automation of logical reasoning and some of the computer applications that this makes possible.

 =======================================================================

### 1.2 Logical Sentences

For many, Logic is an esoteric subject.  It is used primarily by mathematicians in proving complicated theorems in geometry or number theory.  It is all about writing formal proofs to be published in scholarly papers that have little to do with everyday life.  Nothing could be further from the truth.

As an example of using Logic in everyday life, consider the interpersonal relations of a small group of friends.  There are just four members - Abby, Bess, Cody, and Dana.  Some of the girls like each other, but some do not.

The figure on the left below shows one set of possibilities.  The checkmark in the first row here means that Abby likes Cody, while the absence of a checkmark means that Abby does not like the other girls (including herself).  Bess likes Cody too.  Cody likes everyone but herself.  And Dana also likes the popular Cody.  Of course, this is not the only possible state of affairs.  The figure on the right shows another possible world.  In this world, every girl likes exactly two girls, and every girl is liked by just two girls.

| Abby Bess Cody Dana Abby Bess Cody Dana | Abby Bess Cody Dana Abby Bess Cody Dana |  | Abby | Bess | Cody | Dana | Abby |  |  |  |  | Bess |  |  |  |  | Cody |  |  |  |  | Dana |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Abby Bess Cody Dana Abby Bess Cody Dana |  | Abby | Bess | Cody | Dana | Abby |  |  |  |  | Bess |  |  |  |  | Cody |  |  |  |  | Dana |  |  |  |  |  |
|  | Abby | Bess | Cody | Dana |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Abby |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Bess |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Cody |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dana |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
