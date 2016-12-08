# Use jQuery to Fetch and Show Code School Badges Using Ajax

You’ll build a personal web page that displays the courses you’ve completed on Code School by pulling data from the Code School website.

![Poster](http://courseware.codeschool.com.s3.amazonaws.com/projects/use-jquery-to-fetch-and-show-code-school-badges-using-ajax.png)

## What You’ll Use

- JavaScript with jQuery
- Ajax calls
- DOM elements
- Loops

## What You’ll Learn

You will further your JavaScript and jQuery skills, as well as feel more comfortable writing JavaScript code in a real-world scenario.

## Live Demo

[Check out this link](https://codeschool-project-demos.github.io/jQueryBadgesProject/) to see a working version of this project. Feel free to customize your project even further by adding more custom CSS styles to it once you've completed the steps.

You’ll build a personal web page that displays the courses you’ve completed on Code School by pulling data from the Code School website.

## Setup Instructions

Once you have cloned the forked repository, go into the directory containing the project and look for the `/src` directory. This is the directory where you will be making changes when you start following the step-by-step instructions. You can simply open those files in a text editor and get started.

In this project, all of your changes will happen in the file called `/src/assets/main.js`.


## Tasks

Complete the following tasks to finish this project.

### Make an Ajax Call

Let's start by finding your `Report Card URL` _([click here to see how](https://github.com/codeschool/jQueryBadgesProject/wiki/How-to-get-your-Report-Card-URL))_ on CodeSchool.com and make an Ajax request that follows the following requirements: - Make an Ajax request to the `Report Card URL` you found on CodeSchool.com - Set the `dataType` as `jsonp` - Pass a `success` callback _We made a [sample Ajax request](https://github.com/codeschool/project-jquery-badges/wiki/Sample-Report-Card-Ajax-Request) available to help you with this task._	MENU

### An Element per Completed Course

By now, our Ajax call will have returned a response object that contains an array field called `response.courses.completed`. Let's add one `div` element per item in the `courses.completed` array inside of the `#badges` element. Add the CSS class `course` to each `div` element we add to `#badges`.	MENU

### Adding Course Titles

Let's add an `h3` tag inside each of the `.course` elements we are generating. These `h3` tags should have the `title` property of each course as its contents.	MENU

### Adding Course Images

This time, let's add an `img` tag inside our `.course` elements. These images should have each course's `badge` property as its `src` attribute.	MENU

### Adding Course Buttons

Now let's add an `a` tag to our `.course` elements. These anchor tags need to include: - the `href` attribute set as each course's `url` property - the `target` attribute set as `_blank` - the `btn` & `btn-primary` CSS classes - `See Course` as its text contents	MENU

## Next Steps

Now that you’ve completed this project, you should make it available online so you can share your progress with others! One way to do this is by using GitHub Pages.

To deploy your `/src` directory to GitHub Pages, be sure to commit all of your changes and make a new branch called `gh-pages`. Once you are checked into the `gh-pages` branch, run the following command:

```
git subtree push --prefix src origin gh-pages
```

This will push the `src` folder up to GitHub on the `gh-pages` branch. After that, you should be able to open up `http://username.github.io/jQueryBadgesProject`, where `username` is your GitHub username.
