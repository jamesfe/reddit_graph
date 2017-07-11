# Notes 11 Jul 2017

Working on making a more intuitive graph of lines - here is how I am approaching it: Load the JSON file, do some parsing and then begin to render each object.

This is a difference from other graphs because we have more streams of data (more lines) so performance will matter as well as getting out of the async function handlers.  My hope is that the async function will set some value or pass along the values to a more modular set of functions.

Currently data is organized as such:
`TLD -> reddit -> dates -> [list of items for which there exist {deleted, total, total_not_deleted}]`
