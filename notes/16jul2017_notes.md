# Notes 16 July 2017

## Multi-line graph working

I finished getting a working version of the multi-line graph up today.  It's cool!  I am surprised by how many comments some reddits are deleting.

My intention is to have a cool interactive graph where you can mouse-over each line and bring it to the front (so you can clearly see it), the line will thicken up (style change) and the name of the reddit will appear somewhere.

Another thing I need to do is split this out into different divisions: some graphs organized by volume of reddit ("deleted by top 20 largest reddits") and then by top deleters ("top 20 deleters out of the 100 biggest reddits") and then finally by category ("deleted comments among political/gaming/etc subreddits").

## TO DO

*Features*
 [ ] Add mouse-over detection
 [ ] Re-render individual lines on demand
 [ ] Maybe something for `reddit_stats` but divide graphs by reddit types

*Maintenance*
 [ ] Look over code for opportunities to refactor
 [ ] Check all functions for unit tests
 [ ] Related: Spike on code coverage for JavaScript tests
