# Notes for 9 July 2017

## Unit Tests

I installed some unit tests and found them to be handy.  Linting doens't seem to be as handy since it just tells me about semicolons everywhere but I'll look into tweaking the settings and maybe more inspections.

## General Thoughts

The project is going well - I am learning how to code in JS more as well as more about the ecosystem.  It's tough to write meaningful unit tests.  My JS code is a little messy and i think I should try to modularize it more but it's hard when you have a string of functions operating on a single SVG element.  It's forced me to use VIMs code-folding stuff.  Also, can I make modules two items deep?  Maybe that would help when splitting files.

## And axis tick marks

I reached out to Mike Bostock today and got a really nice tip on how to add unit labels to my axis (plural).  Thanks!

[https://twitter.com/mbostock/status/884061559995027458]

## TODO

There is a lot of work to do.  I'm pumping out features from the Golang side of the program pretty quickly and I'm looking forward to visualizing the data they create.  Let's summarize:

- Need a line graph so we can compare more than 2-3 sets of data in one graph
- In the line graph, I want some interactivity
- More unit tests
- Figure out better ways to modularize code to enable better unit tests
- Look into better js linting settings
