# Puzzle — Cards

> **Source:** [http://intrologic.stanford.edu/puzzles/cards.html](http://intrologic.stanford.edu/puzzles/cards.html)  
> **Attribution:** Tools for Thought / Michael Genesereth — educational mirror of http://intrologic.stanford.edu. Not an official Stanford distribution.

=======================================================================

|  |  | Introduction to Logic | Tools for Thought |  |
| --- | --- | --- | --- | --- |

 =======================================================================

---

| Cards |
| --- |

---

 =======================================================================

| Two logicians, Mike and Maureen, have a magic trick.  Mike starts with a standard 52-card deck of cards.  He hands the deck to a random skeptical audience member (let's call him Charles).  Mike asks Charles to inspect the deck, shuffle it however he'd like, and then choose any five cards.  Mike takes those five cards, then chooses one of them and hands it back to Charles. This is the "mystery card." Mike then takes the remaining four cards and lays them out on the table in a special order.  After looking just at the order of the four cards on the table, Maureen is able to announce the number and suit of Charles's hidden "mystery card".  What algorithm are Mike and Maureen using to "encode" the mystery card in the order of the other four cards?  Note that the solution uses pure logic, not sleight of hand, and will work no matter how devious Charles is about choosing his five cards. |
| --- |

  ======================================================================= <p>From each 5 card there are always 2 card from the same suite. So from 4 card that mike put on table, the first one has the same suit as mystery card!</p>

<p>now we the suite, we should encode the number of the card in those three remaining card. (jack 11, queen 12, king 13) difference between 2 card from same suite is always equal or less than 6! (imagine them around a table) so we have use 3 card to encode 1 to 6, it is easy because 3! = 6, but first we have to assign value to cards, lets use this order, Spade > Heart > club > Dimond. for instance, it mean 2 of spade is larger than four of heart; the four of heart is larger than queen club; Q of club is larger that ace of diamond.</p>

<p>so we have three card with order; Big, Medium, Small, so this is the coding S M B => 1 S B M => 2 M S B => 3 M B S => 4 B S M => 5 B M S => 6</p>

<p>so the number which is coded in these three cards will be added to the first card, for example QS, 2H , 2C , AH, it means M S B => 3 , Queen is 12, so 12+3=15, mod(15,13) = 2 = > mystery card is 2 of spades!</p>

<p>Mike's job is always harder than Maureen's job!</p> =======================================================================
