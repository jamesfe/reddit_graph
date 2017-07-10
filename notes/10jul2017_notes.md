# Notes for 10 July 2017

- Removed a minor linting error

## To Do

 [ ] Need a line graph so we can compare more than 2-3 sets of data in one graph
 [ ] In the line graph, I want some interactivity
 [ ] More unit tests
 [ ] Figure out better ways to modularize code to enable better unit tests
 [ ] Look into better js linting settings


## Lines

How will I solve the line problem?  It should probably be pretty easy.  Let's tackle it like this:

1. Read some of the lines documentation for d3
2. Check out some examples
3. Reformat the data so we can use it in line format (this should not be tough)

## Modularization

Let's look into ways I can modularize the code before doing the lines.  I'll scope around the files to see if there is anything I'm doing that is repetitive or whatever, then we can remove that.  The problem is that d3 is generally both concise and quite functional, which means a lot of action happens on each line and it may not be beneficial to refactor a lot.  This is a little abnormal to me, but I dislike the level of repetition I have.
